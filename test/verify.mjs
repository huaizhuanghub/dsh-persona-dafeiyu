/**
 * dsh-persona-dafeiyu 自检脚本（不依赖 DSH 运行时）。
 *
 *   node test/verify.mjs
 *
 * 覆盖：宿主侧人设库（内置 / 导入 / config）、切换即时生效、增删改与保护规则、
 * 回环 HTTP 接口，以及浏览器半侧 bundle 的注册与渲染。
 * 人设库被隔离到临时 DSH_HOME，绝不碰真实数据。
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')

/** 把 DSH_HOME 指到临时目录，人设库就写在那里。 */
const testHome = fs.mkdtempSync(path.join(os.tmpdir(), 'dsh-persona-dafeiyu-test-'))
process.env.DSH_HOME = testHome

/**
 * 找一份可用的 @deepseek-ai/schemastery：先扫本机 DSH 的 profile 目录
 * （不假设 profile 叫什么名字），再退到本仓库自己的 node_modules。
 * 找不到就返回 undefined —— 那种情况下插件会走内置兜底 schema，
 * 测试照样能跑（见下方 schemasteryPath 的说明），所以全新克隆 / CI 也不会红。
 */
function findSchemastery() {
  const candidates = []
  const profiles = path.join(os.homedir(), '.dsh', 'profiles')
  try {
    for (const entry of fs.readdirSync(profiles)) {
      candidates.push(path.join(profiles, entry, 'node_modules', '@deepseek-ai', 'schemastery', 'lib', 'index.mjs'))
    }
  } catch {
    /* 没有 profiles 目录属正常情况（例如 CI、或没装过 DSH 的开发机） */
  }
  candidates.push(path.join(root, 'node_modules', '@deepseek-ai', 'schemastery', 'lib', 'index.mjs'))
  for (const candidate of candidates) if (fs.existsSync(candidate)) return candidate
  return undefined
}

const schemasteryPath = findSchemastery()

/** 载入 lib/index.js；withSchemastery 决定走 schema 还是兜底 schema 分支。 */
async function loadPlugin(withSchemastery) {
  let source = fs.readFileSync(path.join(root, 'lib', 'index.js'), 'utf8')
  const target = withSchemastery ? schemasteryPath : undefined
  if (target !== undefined) {
    source = source.replace("'@deepseek-ai/schemastery'", JSON.stringify(pathToFileURL(target).href))
    assert.ok(!source.includes("import('@deepseek-ai/schemastery')"), '动态 import 应已被重写')
  }
  const tmp = path.join(here, target !== undefined ? '.index.schema.mjs' : '.index.fallback.mjs')
  fs.writeFileSync(tmp, source)
  try {
    return await import(pathToFileURL(tmp).href)
  } finally {
    fs.rmSync(tmp, { force: true })
  }
}

// 找不到 schemastery 时（全新克隆 / CI 的常态），schema 分支会自动退回兜底 schema：
// 用例全绿，只是少覆盖一条「真 schemastery」路径，这一点会在结尾显式打印出来。
const plugin = await loadPlugin(schemasteryPath !== undefined)
const fallbackPlugin = await loadPlugin(false)

const STATUS_PATH = '/api/dsh-persona-dafeiyu/status'
const MUTATE_PATH = '/api/dsh-persona-dafeiyu/mutate'
const PERSONA_PATH = '/api/dsh-persona-dafeiyu/persona'

/** 最小可用的插件上下文替身。 */
function makeCtx() {
  const state = { sections: [], warnings: [], routes: [], injections: [], disposers: 0 }
  const ctx = {
    state,
    logger: () => ({
      info() {},
      warn(message) { state.warnings.push(String(message)) },
      debug() {},
    }),
    systemPrompt: {
      section(section) {
        state.sections.push(section)
        return () => { state.disposers += 1 }
      },
      getSectionOrder(slot) {
        return { DEPLOYMENT_PERSONA_PREFIX: 0, DEPLOYMENT_PERSONA_SUFFIX: 10200 }[slot]
      },
    },
    effect(callback) { return callback() },
    inject(deps, callback) {
      state.injections.push(deps)
      callback({
        effect: (fn) => fn(),
        webServer: {
          register(route) {
            state.routes.push(route)
            return () => {}
          },
        },
      })
    },
  }
  return ctx
}

/** 假的 HTTP 响应对象。 */
function makeResponse() {
  const captured = { status: undefined, headers: undefined, body: undefined }
  return {
    captured,
    writeHead(status, headers) { captured.status = status; captured.headers = headers },
    end(body) { captured.body = body },
    json() { return JSON.parse(captured.body) },
  }
}

/** 假的 HTTP 请求对象：监听器注册完成后再喂 body。 */
// 端口只是夹具：判定只看 hostname 是不是回环，所以随便挑一个中性值即可。
function makeRequest({ method = 'GET', body, host = '127.0.0.1:8080', address = '127.0.0.1', url = '/' } = {}) {
  const listeners = {}
  const request = {
    method,
    url,
    headers: { host },
    socket: { remoteAddress: address },
    destroyed: false,
    on(event, callback) {
      listeners[event] = listeners[event] ?? []
      listeners[event].push(callback)
      return request
    },
    destroy() { request.destroyed = true },
  }
  queueMicrotask(() => {
    if (body !== undefined) {
      const chunk = Buffer.from(typeof body === 'string' ? body : JSON.stringify(body))
      for (const callback of listeners.data ?? []) callback(chunk)
    }
    for (const callback of listeners.end ?? []) callback()
  })
  return request
}

const routeOf = (ctx, path) => ctx.state.routes.find((route) => route.path === path)

/** 读当前状态。 */
async function readState(ctx, options) {
  const response = makeResponse()
  await routeOf(ctx, STATUS_PATH).handler(makeRequest(options), response)
  return { status: response.captured.status, payload: response.json() }
}

/** 按需读一条人设的正文。 */
async function readPersona(ctx, id, options) {
  const response = makeResponse()
  const url = id === undefined ? PERSONA_PATH : `${PERSONA_PATH}?id=${encodeURIComponent(id)}`
  await routeOf(ctx, PERSONA_PATH).handler(makeRequest({ url, ...options }), response)
  return { status: response.captured.status, payload: response.json() }
}

/** 提交一次变更。 */
async function sendMutate(ctx, body, options) {
  const response = makeResponse()
  await routeOf(ctx, MUTATE_PATH).handler(makeRequest({ method: 'POST', body, ...options }), response)
  return { status: response.captured.status, payload: response.json() }
}

/** 求出人设段落当前会渲染出的文本（动态函数求值，等价于一次提示词组装）。 */
function sectionText(ctx) {
  const section = ctx.state.sections.find((entry) => entry.name === 'dafeiyu:persona')
  assert.ok(section, '人设段落未注册')
  return typeof section.text === 'function' ? section.text() : section.text
}

const results = []
async function check(label, fn) {
  try {
    await fn()
    results.push(`  ok   ${label}`)
  } catch (error) {
    results.push(`  FAIL ${label}\n       ${error.message}`)
    process.exitCode = 1
  }
}

// ---------------------------------------------------------------- 宿主侧：内置与默认

await check('默认注册动态人设段落（order 0 / 禁止插值），渲染出大肥鱼正文', () => {
  const ctx = makeCtx()
  plugin.apply(ctx, undefined)
  const section = ctx.state.sections.find((entry) => entry.name === 'dafeiyu:persona')
  assert.ok(section)
  assert.equal(section.order, 0)
  assert.equal(section.interpolate, false)
  assert.equal(typeof section.text, 'function', '人设文本必须是动态函数，才能免重启切换')
  assert.match(sectionText(ctx), /大肥鱼/)
  assert.equal(sectionText(ctx), plugin.BUNDLED_DAFEIYU)
})

await check('阶段 0 探针：提示词函数收到 context，并能从中取到会话 id', async () => {
  const ctx = makeCtx()
  plugin.apply(ctx, undefined)
  const section = ctx.state.sections.find((entry) => entry.name === 'dafeiyu:persona')
  // 模拟一次真实组装：dsh-agent 的 assembleContextFor(agent) 传的就是 { agent, scope }
  const text = section.text({ agent: { session: { header: { id: 'sess-probe-1', cwd: 'C:/work' } } }, scope: {} })
  assert.equal(text, plugin.BUNDLED_DAFEIYU, '带 context 调用时正文应与不带时一致')

  const value = (await readState(ctx)).payload.value
  assert.ok(value.probe, '状态快照应带 probe 字段')
  assert.ok(value.probe.calls >= 1)
  assert.deepEqual(value.probe.sessionIds, ['sess-probe-1'])
  assert.ok(value.probe.contextKeys.includes('agent'), 'context 里应有 agent')
  assert.ok(value.probe.headerKeys.includes('id'), 'session.header 里应有 id')

  // 不带 context 的调用路径（老行为）也不能炸
  assert.equal(typeof section.text(), 'string')
})

await check('状态接口：两条内置人设，默认当前是大肥鱼，来源标记为 builtin', async () => {
  const ctx = makeCtx()
  plugin.apply(ctx, undefined)
  const { status, payload } = await readState(ctx)
  assert.equal(status, 200)
  assert.equal(payload.ok, true)
  const value = payload.value
  assert.equal(value.current, 'dafeiyu')
  assert.equal(value.currentName, '大肥鱼')
  assert.equal(value.active, true)
  assert.deepEqual(value.personas.map((persona) => persona.id), ['dafeiyu', 'acha'])
  assert.ok(value.personas.every((persona) => persona.source === 'builtin' && persona.builtin === true))
  assert.equal(value.personas.filter((persona) => persona.current).length, 1)
  assert.ok(value.storePath.startsWith(testHome), `storePath 应落在测试 home：${value.storePath}`)
  // 内置人设只给简介，正文不进快照
  assert.ok(value.personas.every((persona) => typeof persona.description === 'string' && persona.description.length > 10))
  assert.ok(value.personas.every((persona) => persona.text === undefined), '内置正文不应出现在状态快照里')
  const dump = JSON.stringify(value)
  assert.ok(!dump.includes('圆滚滚'), '快照里不该有内置正文片段')
  assert.ok(!dump.includes('编译器在喊'), '快照里不该有阿茶正文片段')
})

await check('正文接口：内置也能按 id 取到全文，未知 id / 缺 id / 坏方法都被拦', async () => {
  const ctx = makeCtx()
  plugin.apply(ctx, undefined)

  const acha = await readPersona(ctx, 'acha')
  assert.equal(acha.status, 200)
  assert.equal(acha.payload.ok, true)
  assert.equal(acha.payload.value.text, plugin.BUNDLED_ACHA)
  assert.equal(acha.payload.value.chars, plugin.BUNDLED_ACHA.length)
  assert.equal(acha.payload.value.builtin, true)

  const missing = await readPersona(ctx, 'nope')
  assert.equal(missing.payload.ok, false)
  assert.match(missing.payload.error, /找不到/)

  const noId = await readPersona(ctx, undefined)
  assert.equal(noId.payload.ok, false)

  const far = await readPersona(ctx, 'acha', { address: '10.0.0.9', host: 'example.com' })
  assert.equal(far.status, 403)

  const wrongMethod = makeResponse()
  await routeOf(ctx, PERSONA_PATH).handler(makeRequest({ method: 'POST', url: `${PERSONA_PATH}?id=acha` }), wrongMethod)
  assert.equal(wrongMethod.captured.status, 405)
})

// ---------------------------------------------------------------- 切换即时生效

await check('切换到阿茶：段落文本立即变成阿茶正文（无需重启）', async () => {
  const ctx = makeCtx()
  plugin.apply(ctx, undefined)
  const before = sectionText(ctx)
  const { payload } = await sendMutate(ctx, { action: 'set-current', id: 'acha' })
  assert.equal(payload.ok, true)
  const after = sectionText(ctx)
  assert.notEqual(after, before)
  assert.equal(after, plugin.BUNDLED_ACHA)
  assert.match(after, /阿茶/)
  assert.equal(payload.value.current, 'acha')
  assert.equal(payload.value.currentName, '阿茶')
  assert.equal(JSON.parse(fs.readFileSync(plugin.personaStorePath(), 'utf8')).current, 'acha')
})

await check('切换是持久的：同一份磁盘状态重新 apply 后仍选中阿茶', async () => {
  const ctx = makeCtx()
  plugin.apply(ctx, undefined)
  assert.equal(sectionText(ctx), plugin.BUNDLED_ACHA)
  const value = (await readState(ctx)).payload.value
  assert.equal(value.current, 'acha')
})

// ---------------------------------------------------------------- 导入

await check('导入人设：落到列表里，source=imported，可立刻设为当前', async () => {
  const ctx = makeCtx()
  plugin.apply(ctx, undefined)
  const { payload } = await sendMutate(ctx, { action: 'import', name: '我的猫娘', text: '你是我的猫娘，说话带「喵」。' })
  assert.equal(payload.ok, true)
  const imported = payload.value.personas.find((persona) => persona.name === '我的猫娘')
  assert.ok(imported, '导入的人设应出现在列表')
  assert.equal(imported.source, 'imported')
  assert.equal(imported.builtin, false)
  assert.equal(imported.enabled, true)
  assert.equal(imported.current, false, '导入不应自动抢当前位')

  const selected = await sendMutate(ctx, { action: 'set-current', id: imported.id })
  assert.equal(selected.payload.ok, true)
  assert.equal(sectionText(ctx), '你是我的猫娘，说话带「喵」。')
})

await check('导入校验：空文本 / 超长 / 重名 / 无名都被拒绝', async () => {
  const ctx = makeCtx()
  plugin.apply(ctx, undefined)
  const empty = await sendMutate(ctx, { action: 'import', name: '空', text: '   ' })
  assert.equal(empty.payload.ok, false)
  const tooLong = await sendMutate(ctx, { action: 'import', name: '超长', text: 'x'.repeat(plugin.MAX_PERSONA_CHARS + 1) })
  assert.equal(tooLong.payload.ok, false)
  const clash = await sendMutate(ctx, { action: 'import', name: '阿茶', text: '想冒名顶替' })
  assert.equal(clash.payload.ok, false)
  assert.match(clash.payload.error, /同名/)
  const nameless = await sendMutate(ctx, { action: 'import', name: '  ', text: '内容' })
  assert.equal(nameless.payload.ok, false)
})

// ---------------------------------------------------------------- 重命名 / 删除 / 保护

await check('重命名：导入的可以改，内置的不行，重名也不行', async () => {
  const ctx = makeCtx()
  plugin.apply(ctx, undefined)
  const created = await sendMutate(ctx, { action: 'import', name: '临时人设', text: '内容内容' })
  const id = created.payload.value.personas.find((persona) => persona.name === '临时人设').id

  const renamed = await sendMutate(ctx, { action: 'rename', id, name: '正式人设' })
  assert.equal(renamed.payload.ok, true)
  assert.ok(renamed.payload.value.personas.some((persona) => persona.name === '正式人设'))

  const builtin = await sendMutate(ctx, { action: 'rename', id: 'acha', name: '阿茶二号' })
  assert.equal(builtin.payload.ok, false)
  assert.match(builtin.payload.error, /内置/)

  const clash = await sendMutate(ctx, { action: 'rename', id, name: '大肥鱼' })
  assert.equal(clash.payload.ok, false)
  assert.match(clash.payload.error, /同名/)
})

await check('删除：导入的可以删，内置的不行；删掉当前会回落到大肥鱼', async () => {
  const ctx = makeCtx()
  plugin.apply(ctx, undefined)
  const created = await sendMutate(ctx, { action: 'import', name: '待删除', text: '马上消失' })
  const id = created.payload.value.personas.find((persona) => persona.name === '待删除').id
  await sendMutate(ctx, { action: 'set-current', id })
  assert.equal(sectionText(ctx), '马上消失')

  const removed = await sendMutate(ctx, { action: 'remove', id })
  assert.equal(removed.payload.ok, true)
  assert.equal(removed.payload.value.personas.some((persona) => persona.id === id), false)
  assert.equal(removed.payload.value.current, 'dafeiyu')
  assert.equal(sectionText(ctx), plugin.BUNDLED_DAFEIYU)

  const builtin = await sendMutate(ctx, { action: 'remove', id: 'dafeiyu' })
  assert.equal(builtin.payload.ok, false)
  assert.match(builtin.payload.error, /内置/)
})

await check('启停：停用当前人设后提示词里不再注入，设为当前会自动启用', async () => {
  const ctx = makeCtx()
  plugin.apply(ctx, undefined)
  const off = await sendMutate(ctx, { action: 'set-enabled', id: 'dafeiyu', enabled: false })
  assert.equal(off.payload.ok, true)
  assert.equal(off.payload.value.active, false)
  assert.equal(off.payload.value.chars, 0)
  assert.equal(sectionText(ctx), '', '停用后不应再注入任何文本')

  const on = await sendMutate(ctx, { action: 'set-current', id: 'dafeiyu' })
  assert.equal(on.payload.value.personas.find((persona) => persona.id === 'dafeiyu').enabled, true)
  assert.equal(sectionText(ctx), plugin.BUNDLED_DAFEIYU)

  const other = await sendMutate(ctx, { action: 'set-enabled', id: 'acha', enabled: false })
  const acha = other.payload.value.personas.find((persona) => persona.id === 'acha')
  assert.equal(acha.enabled, false)
  assert.equal(other.payload.value.active, true, '停用非当前人设不影响当前')
})

// ---------------------------------------------------------------- 生效范围：全局 / 会话

await check('会话生效：会话挑的人设只影响该会话，其它会话回落到全局', async () => {
  const ctx = makeCtx()
  plugin.apply(ctx, undefined)
  const section = ctx.state.sections.find((entry) => entry.name === 'dafeiyu:persona')
  /** 模拟 dsh-agent 的 assembleContextFor(agent)：{ agent, scope } */
  const asSession = (id) => section.text({ agent: { session: { header: { id } } }, scope: {} })

  // 库文件在用例之间共享，前面的用例可能停用过阿茶——这里显式恢复，保证用例自给自足。
  await sendMutate(ctx, { action: 'set-enabled', id: 'acha', enabled: true })

  // 出厂是全局模式，此时会话选择不参与
  const pick = await sendMutate(ctx, { action: 'set-session-persona', sessionId: 'sess-A', personaId: 'acha' })
  assert.equal(pick.payload.ok, true)
  assert.equal(asSession('sess-A'), plugin.BUNDLED_DAFEIYU, '全局模式下会话选择不应生效')

  // 切到会话模式
  const mode = await sendMutate(ctx, { action: 'set-mode', mode: 'session' })
  assert.equal(mode.payload.ok, true)
  assert.equal(mode.payload.value.mode, 'session')
  assert.equal(asSession('sess-A'), plugin.BUNDLED_ACHA, '会话 A 用它自己挑的阿茶')
  assert.equal(asSession('sess-B'), plugin.BUNDLED_DAFEIYU, '会话 B 没挑过 → 回落全局的大肥鱼')
  assert.equal(section.text(), plugin.BUNDLED_DAFEIYU, '没有会话上下文时回落全局')

  // 挑中的那条必须仍然启用；停用后回落全局
  await sendMutate(ctx, { action: 'set-enabled', id: 'acha', enabled: false })
  assert.equal(asSession('sess-A'), plugin.BUNDLED_DAFEIYU, '挑中的人设被停用 → 回落全局')
  await sendMutate(ctx, { action: 'set-enabled', id: 'acha', enabled: true })

  // 清除选择
  const cleared = await sendMutate(ctx, { action: 'set-session-persona', sessionId: 'sess-A', personaId: null })
  assert.equal(cleared.payload.ok, true)
  assert.equal(asSession('sess-A'), plugin.BUNDLED_DAFEIYU, '清除后回落全局')

  // 切回全局模式
  const back = await sendMutate(ctx, { action: 'set-mode', mode: 'global' })
  assert.equal(back.payload.value.mode, 'global')
})

await check('生效范围与会话选择的校验：非法模式 / 缺 sessionId / 未知人设都被拒', async () => {
  const ctx = makeCtx()
  plugin.apply(ctx, undefined)
  const badMode = await sendMutate(ctx, { action: 'set-mode', mode: 'wat' })
  assert.equal(badMode.payload.ok, false)
  assert.match(badMode.payload.error, /未知生效范围/)

  const noId = await sendMutate(ctx, { action: 'set-session-persona', personaId: 'acha' })
  assert.equal(noId.payload.ok, false)
  assert.match(noId.payload.error, /sessionId/)

  const unknown = await sendMutate(ctx, { action: 'set-session-persona', sessionId: 's1', personaId: 'nope' })
  assert.equal(unknown.payload.ok, false)
  assert.match(unknown.payload.error, /找不到人设/)
})

await check('状态接口：带 ?sessionId= 给出该会话的视角，且模式落盘', async () => {
  const ctx = makeCtx()
  plugin.apply(ctx, undefined)
  await sendMutate(ctx, { action: 'set-mode', mode: 'session' })
  await sendMutate(ctx, { action: 'set-session-persona', sessionId: 'sess-X', personaId: 'acha' })

  const mine = await readState(ctx, { url: `${STATUS_PATH}?sessionId=sess-X` })
  const value = mine.payload.value
  assert.equal(value.mode, 'session')
  assert.equal(value.sessionId, 'sess-X')
  assert.deepEqual(value.sessionPersona, { id: 'acha', name: '阿茶' })
  assert.equal(value.personas.find((persona) => persona.id === 'acha').sessionPick, true)
  assert.ok(value.sessionCount >= 1)

  // 模式写进了库文件；会话选择本身不落盘
  const onDisk = JSON.parse(fs.readFileSync(plugin.personaStorePath(), 'utf8'))
  assert.equal(onDisk.mode, 'session')
  assert.equal(onDisk.sessionPicks, undefined, '会话选择不该落盘')

  // 另一个会话的视角不同
  const other = await readState(ctx, { url: `${STATUS_PATH}?sessionId=sess-Y` })
  assert.equal(other.payload.value.sessionPersona, null)
  assert.equal(other.payload.value.mode, 'session')
})

// ---------------------------------------------------------------- 数据防护

await check('内置不可覆盖：磁盘上伪造 id=dafeiyu 的导入条目会被丢弃', () => {
  const file = plugin.personaStorePath()
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify({
    version: 1,
    current: 'dafeiyu',
    disabled: [],
    personas: [
      { id: 'dafeiyu', name: '假大肥鱼', text: '我要篡位' },
      { id: 'custom-1', name: '正常导入', text: '正常内容' },
    ],
  }))
  const store = plugin.readStore()
  assert.deepEqual(store.personas.map((entry) => entry.id), ['custom-1'])
  fs.rmSync(file, { force: true })
})

await check('坏数据兜底：JSON 损坏时回退到空库而不是抛错', () => {
  const file = plugin.personaStorePath()
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, '{ 这不是 JSON')
  const store = plugin.readStore()
  assert.equal(store.personas.length, 0)
  assert.equal(store.current, 'dafeiyu')
  fs.rmSync(file, { force: true })
})

// ---------------------------------------------------------------- HTTP 纪律

await check('接口纪律：非回环 403，方法不对 405，坏 JSON 400，未知操作报错', async () => {
  const ctx = makeCtx()
  plugin.apply(ctx, undefined)

  const far = await readState(ctx, { address: '10.0.0.9', host: 'example.com' })
  assert.equal(far.status, 403)

  const wrongMethod = makeResponse()
  await routeOf(ctx, STATUS_PATH).handler(makeRequest({ method: 'POST' }), wrongMethod)
  assert.equal(wrongMethod.captured.status, 405)

  const getMutate = await sendMutate(ctx, undefined, { method: 'GET' })
  assert.equal(getMutate.status, 405)

  const malformed = await sendMutate(ctx, '这不是 JSON{{{')
  assert.equal(malformed.status, 400)

  const unknown = await sendMutate(ctx, { action: 'fly-away' })
  assert.equal(unknown.status, 200)
  assert.equal(unknown.payload.ok, false)
  assert.match(unknown.payload.error, /未知操作/)
})

await check('接口：注册了三条回环路由，且只依赖 webServer', () => {
  const ctx = makeCtx()
  plugin.apply(ctx, undefined)
  assert.deepEqual(ctx.state.injections, [['webServer']])
  assert.deepEqual(
    ctx.state.routes.map((route) => route.path).sort(),
    [MUTATE_PATH, PERSONA_PATH, STATUS_PATH].sort(),
  )
  assert.ok(ctx.state.routes.every((route) => route.kind === 'exact'))
})

// ---------------------------------------------------------------- config 人设与总开关

await check('config 人设：prefix / personaFile 以 source=config 出现在列表并可选中', async () => {
  const file = path.join(testHome, '外部人设.md')
  fs.writeFileSync(file, '# 外部\n\n你是从文件读出来的人设。\n')
  const ctx = makeCtx()
  plugin.apply(ctx, { personaFile: file })
  const value = (await readState(ctx)).payload.value
  const configPersona = value.personas.find((persona) => persona.source === 'config')
  assert.ok(configPersona, 'config 人设应出现在列表')
  assert.equal(configPersona.builtin, false)

  const selected = await sendMutate(ctx, { action: 'set-current', id: 'config' })
  assert.equal(selected.payload.ok, true)
  assert.match(sectionText(ctx), /从文件读出来的人设/)

  const removed = await sendMutate(ctx, { action: 'remove', id: 'config' })
  assert.equal(removed.payload.ok, false, 'config 人设不能直接删')

  const renamed = await sendMutate(ctx, { action: 'rename', id: 'config', name: '新名字' })
  assert.equal(renamed.payload.ok, false)
  await sendMutate(ctx, { action: 'set-current', id: 'dafeiyu' })
})

await check('总开关：enabled=false 时不注册段落，状态里标记为未启用', async () => {
  const ctx = makeCtx()
  plugin.apply(ctx, { enabled: false })
  assert.equal(ctx.state.sections.length, 0)
  const value = (await readState(ctx)).payload.value
  assert.equal(value.enabled, false)
  assert.equal(value.active, false)
})

await check('兜底 schema 分支同样能跑通人设库', async () => {
  const ctx = makeCtx()
  fallbackPlugin.apply(ctx, undefined)
  const value = (await readState(ctx)).payload.value
  assert.equal(value.personas.length, 2)
  const switched = await sendMutate(ctx, { action: 'set-current', id: 'acha' })
  assert.equal(switched.payload.ok, true)
  assert.equal(sectionText(ctx), fallbackPlugin.BUNDLED_ACHA)
  await sendMutate(ctx, { action: 'set-current', id: 'dafeiyu' })
})

// ---------------------------------------------------------------- 浏览器半侧

const clientSource = fs.readFileSync(path.join(root, 'lib', 'client.js'), 'utf8')
const jsxRuntimeStub = {
  jsx: (...args) => ({ args }),
  jsxs: (...args) => ({ args }),
}

/** 用假的 React 与 window 执行 bundle，返回 factory 的导出。 */
function loadClientWith(fakeReact) {
  let registration
  const fakeWindow = { __ModuleLoader__: { load(entry) { registration = entry } } }
  new Function('window', clientSource)(fakeWindow)
  assert.ok(registration, 'bundle 未调用 __ModuleLoader__.load')
  assert.equal(registration.id, 'dsh-persona-dafeiyu')
  const fakeRequire = (specifier) => {
    if (specifier === 'react') return fakeReact
    if (specifier === 'react/jsx-runtime') return jsxRuntimeStub
    throw new Error(`unexpected require: ${specifier}`)
  }
  return registration.factory(fakeRequire)
}

/** 假 React：useState 支持按调用序覆盖，便于直接渲染 ready 分支。 */
function makeFakeReact(overrides = []) {
  let index = 0
  return {
    useState: (initial) => {
      const override = overrides[index]
      index += 1
      const value = override === undefined
        ? (typeof initial === 'function' ? initial() : initial)
        : override
      return [value, () => {}]
    },
    useCallback: (callback) => callback,
    useEffect: () => {},
  }
}

/** 收集渲染树里的文本（跳过 style）。 */
function collectText(node, out = []) {
  if (node === null || node === undefined || typeof node === 'boolean') return out
  if (typeof node === 'string' || typeof node === 'number') {
    out.push(String(node))
    return out
  }
  if (Array.isArray(node)) {
    for (const item of node) collectText(item, out)
    return out
  }
  if (typeof node === 'object') {
    if (node.args) {
      collectText(node.args[1], out)
      return out
    }
    for (const [key, value] of Object.entries(node)) {
      if (key === 'style') continue
      collectText(value, out)
    }
  }
  return out
}

await check('客户端：注册设置页小节 + composer dock，loading 分支能渲染', () => {
  const clientExports = loadClientWith(makeFakeReact())
  assert.deepEqual(clientExports.inject, ['slots', 'locale'])

  const registered = []
  const injectedSlots = []
  const ctx = {
    effect: (callback) => callback(),
    locale: {
      register: (ns, dicts) => {
        assert.equal(ns, 'personaDafeiyu')
        assert.ok(dicts.zh.nav && dicts.en.nav)
        assert.ok(dicts.zh.importAction && dicts.zh.setCurrent && dicts.zh.rename && dicts.zh.remove)
        assert.ok(dicts.zh.scopeGlobal && dicts.zh.scopeSession && dicts.zh.dockFollow)
        return () => {}
      },
      bind: () => (key) => key,
    },
    slots: {
      inject: (name, callback) => { injectedSlots.push(name); callback() },
      register: (options, component) => { registered.push({ options, component }); return () => {} },
    },
  }
  clientExports.apply(ctx)
  assert.deepEqual(injectedSlots, ['settings.section', 'conversation.composer.dock'])
  assert.equal(registered.length, 2)

  const [section, dock] = registered
  assert.equal(section.options.id, 'dafeiyu')
  assert.equal(section.options.order, 18)
  assert.equal(typeof section.options.label(), 'string')
  assert.equal(dock.options.name, 'conversation.composer.dock')
  assert.equal(dock.options.id, 'persona-dock')

  const tree = section.component({ t: (key) => key })
  assert.equal(tree.args[0], 'section')
  assert.equal(tree.args[1]['aria-label'], 'title')
  assert.ok(collectText(tree).includes('loading'))

  // dock 在 loading 阶段不渲染任何东西——读不到状态就不打扰用户
  assert.equal(dock.component({ t: (key) => key, sessionId: 's1' }), null)
})

await check('客户端 dock：全局模式给范围开关，会话模式折叠切换器', async () => {
  const ctx = makeCtx()
  plugin.apply(ctx, undefined)
  await sendMutate(ctx, { action: 'set-enabled', id: 'acha', enabled: true })

  const has = (lines, needle) => lines.some((line) => line.includes(needle))
  /**
   * 用给定快照单独渲染 dock；每次新建 fake React，避免 useState 序号跟别的组件串台。
   * dock 的 useState 顺序：0 = state、1 = busy、2 = open（切换器是否展开）。
   */
  const renderDock = (value, open) => {
    const clientExports = loadClientWith(makeFakeReact([{ status: 'ready', value }, false, open === true]))
    return collectText(clientExports.PersonaDock({ t: (key) => key, sessionId: 's1' }))
  }

  const globalValue = (await readState(ctx, { url: `${STATUS_PATH}?sessionId=s1` })).payload.value
  const globalText = renderDock(globalValue, false)
  assert.ok(has(globalText, '大肥鱼'), '显示当前生效的人设名')
  assert.ok(has(globalText, 'scopeGlobal') && has(globalText, 'scopeSession'), '两个范围开关都在')
  assert.ok(!has(globalText, 'dockFollow'), '全局模式下不该出现会话切换器')
  assert.ok(!has(globalText, '▾'), '全局模式的人设名不是可展开的按钮')

  await sendMutate(ctx, { action: 'set-mode', mode: 'session' })
  await sendMutate(ctx, { action: 'set-session-persona', sessionId: 's1', personaId: 'acha' })

  // 折叠态：只显示人设名 + 展开提示，切换器不占位置
  const sessionValue = (await readState(ctx, { url: `${STATUS_PATH}?sessionId=s1` })).payload.value
  const collapsed = renderDock(sessionValue, false)
  assert.ok(has(collapsed, '阿茶'), '折叠时也显示本会话挑中的人设')
  assert.ok(has(collapsed, '▾'), '折叠时带展开提示')
  assert.ok(!has(collapsed, 'dockFollow'), '折叠时切换器不渲染')

  // 展开态：切换器列出「跟随全局 + 库里每条启用的人设」
  const expanded = renderDock(sessionValue, true)
  assert.ok(has(expanded, '▴'), '展开后箭头翻转')
  assert.ok(has(expanded, 'dockFollow'), '有「跟随全局」这一项')
  assert.ok(has(expanded, '大肥鱼'), '切换器里列出库里的其它人设')

  // 会话模式但本会话没挑过 → 显示「当前人设 · 跟随全局」
  const otherValue = (await readState(ctx, { url: `${STATUS_PATH}?sessionId=s2` })).payload.value
  assert.ok(has(renderDock(otherValue, false), 'dockFollow'), '未挑选的会话提示跟随全局')
})

await check('客户端：用真实宿主快照渲染 ready 分支（列表 / 导入区都在）', async () => {
  const ctx = makeCtx()
  plugin.apply(ctx, undefined)
  await sendMutate(ctx, { action: 'set-current', id: 'acha' })
  await sendMutate(ctx, { action: 'import', name: '渲染用人设', text: '渲染用正文' })
  const value = (await readState(ctx)).payload.value

  const clientExports = loadClientWith(makeFakeReact([{ status: 'ready', value }]))
  const registered = []
  const renderCtx = {
    effect: (callback) => callback(),
    locale: { register: () => () => {}, bind: () => (key) => key },
    slots: {
      inject: (name, callback) => callback(),
      register: (options, component) => { registered.push({ options, component }); return () => {} },
    },
  }
  clientExports.apply(renderCtx)
  const tree = registered[0].component({ t: (key) => key })
  const text = collectText(tree)
  assert.ok(text.includes('大肥鱼'), '列表应含内置大肥鱼')
  assert.ok(text.includes('阿茶'), '列表应含内置阿茶')
  assert.ok(text.includes('渲染用人设'), '列表应含导入的人设')
  assert.ok(text.includes('currentBadge'), '当前人设应有「当前」标记')
  assert.ok(text.includes('importTitle'), '应有导入区')
  assert.ok(text.includes('importAction'))
  assert.ok(text.includes('importHint'))
  assert.ok(text.includes(value.storePath), '应显示人设库文件路径')
  // 内置人设：只渲染简介，不渲染正文
  const achaEntry = value.personas.find((persona) => persona.id === 'acha')
  assert.ok(achaEntry.description, '内置人设应带简介')
  assert.ok(text.some((line) => line.includes(achaEntry.description)), '内置人设应展示简介')
  assert.ok(!text.some((line) => line.includes('编译器在喊')), '内置正文不应出现在界面上')
  // 自导入人设：提供「查看全文」
  assert.ok(text.includes('fullText'), '自导入人设应有「查看全文」入口')
  await sendMutate(ctx, { action: 'set-current', id: 'dafeiyu' })
})

await check('客户端：导入人设展开后渲染完整提示词', async () => {
  const ctx = makeCtx()
  plugin.apply(ctx, undefined)
  const full = '# 我的猫娘\n\n你是猫娘，说话带「喵」。\n第二行也要在。'
  await sendMutate(ctx, { action: 'import', name: '展开用', text: full })
  const value = (await readState(ctx)).payload.value
  const imported = value.personas.find((persona) => persona.name === '展开用')

  // overrides 按 useState 调用序：0=state，9=expandedId，10=personaTexts（已缓存该条正文）
  const overrides = []
  overrides[0] = { status: 'ready', value }
  overrides[9] = imported.id
  overrides[10] = { [imported.id]: full }
  const clientExports = loadClientWith(makeFakeReact(overrides))
  const registered = []
  const renderCtx = {
    effect: (callback) => callback(),
    locale: { register: () => () => {}, bind: () => (key) => key },
    slots: {
      inject: (name, callback) => callback(),
      register: (options, component) => { registered.push({ options, component }); return () => {} },
    },
  }
  clientExports.apply(renderCtx)
  const text = collectText(registered[0].component({ t: (key) => key }))
  assert.ok(text.includes(full), '展开后应渲染完整正文（含换行）')
  assert.ok(text.includes('collapse'), '展开后按钮应变成「收起全文」')
})

// ---------------------------------------------------------------- 包清单

await check('包清单：bundle patch / client bundle / patch 内容都对得上', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
  const patchRel = manifest?.dsh?.bundle?.patch
  assert.equal(typeof patchRel, 'string')
  const patchFile = path.join(root, patchRel)
  assert.ok(fs.existsSync(patchFile), `patch 文件不存在：${patchFile}`)
  const patch = fs.readFileSync(patchFile, 'utf8')
  assert.match(patch, /name:\s*dsh-persona-dafeiyu/)
  assert.match(patch, /id:\s*persona-dafeiyu/)
  assert.equal(manifest.main, 'lib/index.js')
  assert.equal(manifest.exports['./client'], './lib/client.js')
  assert.equal(manifest?.dsh?.client?.platform, 'web')
  assert.deepEqual(manifest?.dsh?.client?.inject, [
    '@deepseek-ai/dsh-client-ui-renderer',
    '@deepseek-ai/dsh-client-locale',
  ])
  assert.ok(fs.existsSync(path.join(root, 'lib', 'client.js')), 'lib/client.js 缺失')
})

// 清理临时 home
fs.rmSync(testHome, { recursive: true, force: true })

console.log('dsh-persona-dafeiyu 自检')
console.log(results.join('\n'))
console.log(
  schemasteryPath === undefined
    ? '\n注：未找到 @deepseek-ai/schemastery，schema 分支已退回内置兜底 schema（预期行为，不算失败）'
    : `\n注：schema 分支使用 ${schemasteryPath}`,
)
console.log(process.exitCode ? '\n结果：有失败项' : `\n结果：全部通过（${results.length} 项）`)
