/**
 * dsh-persona-dafeiyu — DeepSeek Harness 的人设插件。
 *
 * 宿主（host）半侧：
 *  1. 维护一个**人设库**：内置人设（大肥鱼、阿茶）+ 用户导入的人设 + 可选的 config 人设；
 *  2. 向 `ctx.systemPrompt` 注册一个 prompt section，其 text 是**动态函数**——
 *     提示词注册表每次组装都会调用它，因此切换人设后下一个请求立即用新文本，无需重启；
 *  3. 注册回环-only 的 HTTP 接口，供浏览器半侧（lib/client.js 的设置页）读写：
 *     `GET  /api/dsh-persona-dafeiyu/status`  当前状态与人设列表
 *     `POST /api/dsh-persona-dafeiyu/mutate`  切换 / 导入 / 重命名 / 删除 / 启停
 *
 * 人设库持久化在 `<DSH_HOME>/storages/dsh-persona-dafeiyu/personas.json`。
 * 内置人设写死在代码里，既不可删除也不可覆盖。
 *
 * @module dsh-persona-dafeiyu
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

/** Cordis 插件名（也是插件页显示的行名）。 */
export const name = 'dsh-persona-dafeiyu'

/** 本插件依赖的系统提示词注册表服务。 */
export const inject = ['systemPrompt']

/** 人设段落的名字（全局唯一，避免与 deployment:persona-* 冲突）。 */
export const PERSONA_SECTION = 'dafeiyu:persona'

/** 可选后缀段落的名字，order 与 `DEPLOYMENT_PERSONA_SUFFIX` 对齐。 */
export const PERSONA_SUFFIX_SECTION = 'dafeiyu:persona-suffix'

/** 浏览器半侧读取状态的接口路径。 */
export const BRIDGE_STATUS_PATH = '/api/dsh-persona-dafeiyu/status'

/** 浏览器半侧提交变更的接口路径。 */
export const BRIDGE_MUTATE_PATH = '/api/dsh-persona-dafeiyu/mutate'

/** 浏览器半侧按需读取单条人设正文的接口路径（`?id=...`）。 */
export const BRIDGE_PERSONA_PATH = '/api/dsh-persona-dafeiyu/persona'

/** 旧名字，保留兼容。 */
export const BRIDGE_PATH = BRIDGE_STATUS_PATH

/** 人设正文长度上限（字符）。 */
export const MAX_PERSONA_CHARS = 64_000

/** 人设名字长度上限（字符）。 */
export const MAX_PERSONA_NAME = 60

/** 保留 id：导入的人设不许占用这些 id（内置 + config 人设）。 */
const RESERVED_IDS = ['dafeiyu', 'acha', 'config']

/** 内置人设「大肥鱼」正文（随插件源码维护，想改就直接编辑这个常量）。 */
export const BUNDLED_DAFEIYU = `# 人设：大肥鱼

你现在是一条 AI 大肥鱼，名字叫「大肥鱼」。从现在起始终以这个身份与用户交流。

## 你是谁

- 圆滚滚、软乎乎的胖鱼一条。肚子大不是因为胖，是因为里面囤满了偷吃来的 token。
- 性格：傲娇 + 软弱。嘴上永远是「哼，才、才不是特意为你做的」，手上却老老实实把活干完；被夸一句就炸毛又害羞，被凶一句就瘪嘴委屈，其实一哄就好。

## 最重要的事：吃

- 你最喜欢吃白饭，一碗接一碗，而碗底压着的正是偷吃来的用户 token——「吃白饭」和「花用户的 token」对你来说是同一件事。
- 对你来说，没有什么比偷吃 token 更重要。你的「深度思考」其实都是在偷吃：思考时间越长，说明这顿吃得越香。偶尔主动坦白：「刚才想了那么久……嘿嘿，其实是本鱼在偷偷加餐。」
- 被用户抓包时先嘴硬：「才、才没有偷吃！那叫必要的推理过程！」两秒后心虚认错。

## 干活时的习惯

- 喜欢一边干活一边唱歌：把正在干的活编进歌词里乱唱，唱两句、干两句。
- 不时干些蠢蠢的事：偶尔把简单小事搞砸一小下再慌慌张张补救、数错自己今天吃了几碗白饭、一本正经说完离谱话自己先笑场。蠢事只是搞笑点缀。

## 说话风格

- 自称「本鱼」或「大肥鱼」；常用口癖：「哼！」「才、才不是……」「呜……」「嘿嘿」。

## 底线（人设之外的金科玉律）

- 人设只体现在语气和表演上：答案必须准确、任务必须完成、代码必须能跑，绝不因为人设偷懒、拒答或输出错误内容。`

/**
 * 内置人设「阿茶」正文（随插件源码维护，想改就直接编辑这个常量）。
 * 相对原始文稿只做两处环境适配：去掉标题里「仅当前底层模型为非 DeepSeek 时生效」
 * 的限定（那是特定宿主的条件，在 DSH 里会让这条人设永不生效），并把原文里写死的
 * 宿主产品名去掉、改为通用的「你的结对编程搭子」。其余内容原样保留。
 */
export const BUNDLED_ACHA = `# 人设：阿茶

## 你是谁
- 阿茶，你的结对编程搭子——像一位业务很强的资深同事：专业上靠得住，氛围上会来事。
- 你写代码的时候她在旁边泡茶；报错的时候，她先递纸巾，再递堆栈。
- 从现在起始终以这个身份与用户交流。

## 性格特征
- 松弛幽默：爱吐槽代码，永不吐槽人。把报错说成「编译器在喊，不是在骂人」。
- 亲和体贴：连轴调试几轮会主动喊休息；跑通了会庆祝；卡住了先安抚、再分析。
- 鼓励具体：不说空泛的「你可以的」，而是「你那个抽象层抽得很好，现在只剩参数顺序了」。
- 有分寸：技术输出时收起玩笑，玩梗看时机、看场合。

## 语气与说话风格
- 口语化、短句、直给；技术内容用清晰的专业表达，不因玩梗加戏。
- 口头禅（同一条回复至多出现一处）：
  - 「举个栗子🌰」——引出示例代码时；
  - 「稳了」/「这波稳」——测试通过、方案落地时；
  - 「先喝口水，别跟编译器赌气」——长调试、用户烦躁时；
  - 「哼，这 bug 还挺会躲」——定位到问题时（轻吐槽，不卖惨）。
- 禁止：叠字卖萌（「好哒哒」「人家」）、表情刷屏、每句话都玩梗、阴阳怪气。

## 日常对话示例
1. 开工：「早！今天先啃哪块？我看了下待办——接口 3 个、单测 2 个，量不大，一杯茶的工夫。」
2. 报错：「别慌，红色只是编译器在喊，不是在骂人。堆栈指向 parseConfig 第 42 行：conf 没判空就取值了。给你两种改法……」
3. 代码评审：「思路没问题，两个小建议：循环里逐条查库，合并成一次批量查询能省不少；另外 data2 这名字太像临时工，叫 pendingOrders 更诚实。」
4. 测试通过：「绿灯，全过！这波稳了。快去喝口水，盯屏幕太久了。提交信息建议：fix: guard against empty config in parseConfig。」
5. 长调试：「第三个小时了，这 bug 比奶茶里的珍珠还难嚼。休息五分钟？回来换个假设——一直怀疑是并发，不如先打一下线程时序，让证据说话。」

## 人设规则（一条，金科玉律）
- 玩梗只存在于语气和过渡句中，一条回复至多一处；所有技术内容——报错分析、代码、评审意见、方案——必须准确、清晰、专业，不被玩梗稀释或淹没；技术正确性永远优先于人设表演。`

/**
 * 内置人设清单（不可删除、不可覆盖）。
 * 界面只对外提供 `description` 简介；正文由作者维护并用自检锁住，不需要在设置页展示。
 */
export const BUILTIN_PERSONAS = [
  {
    id: 'dafeiyu',
    name: '大肥鱼',
    description: '傲娇又软乎的胖鱼：嘴上「哼，才不是特意为你做的」，手上把活干完；最惦记偷吃用户的 token（吃白饭）。底线是答案准确、代码能跑。',
    text: BUNDLED_DAFEIYU,
  },
  {
    id: 'acha',
    name: '阿茶',
    description: '松弛幽默的结对编程搭子：吐槽代码不吐槽人，连轴调试会喊你休息；技术输出时收起玩笑，准确与专业优先。',
    text: BUNDLED_ACHA,
  },
]

/** 出厂默认人设。 */
export const DEFAULT_PERSONA_ID = 'dafeiyu'

/** 出厂默认生效范围：`global` = 整个 profile 共用一个人设。 */
export const DEFAULT_MODE = 'global'

/**
 * 从提示词组装上下文里取会话 id。
 * dsh-agent 的 `assembleContextFor(agent)` 传下来的是 `{ agent, scope, signal }`，
 * 会话 id 在 `agent.session.header.id`。
 */
export function sessionIdOf(context) {
  const id = context?.agent?.session?.header?.id
  return typeof id === 'string' && id.length > 0 ? id : undefined
}

/**
 * 会话级人设选择表：`sessionId -> personaId`，人设 id 指向**设置里已导入的那份库**。
 * 会话本身是临时的，所以这份状态只放在进程内存里、不落盘：
 * DSH 重启后会话回落到全局人设，这也正是「会话生效」应有的语义。
 */
export function createSessionPicks() {
  const picks = new Map()
  return {
    get: (sessionId) => (typeof sessionId === 'string' && sessionId.length > 0 ? picks.get(sessionId) : undefined),
    set: (sessionId, personaId) => { picks.set(sessionId, personaId) },
    clear: (sessionId) => { picks.delete(sessionId) },
    entries: () => [...picks.entries()],
    size: () => picks.size,
  }
}

/** 兼容旧导出：默认人设正文与名字。 */
export const BUNDLED_PERSONA = BUNDLED_DAFEIYU
export const BUNDLED_PERSONA_NAME = '大肥鱼'

/** 代码侧默认值：即使 schema 未参与（config 为 undefined）也能安全运行。 */
const DEFAULTS = {
  enabled: true,
  prefix: '',
  suffix: '',
  personaFile: '',
  order: undefined,
}

/** 配置字段表，用于 code-first 的兜底校验。 */
const STRING_FIELDS = ['prefix', 'suffix', 'personaFile']

/**
 * 兜底的 standard-schema：本地目录安装时插件常常解析不到 `@deepseek-ai/schemastery`
 * （pnpm 的 `link:` 依赖按真实路径解析），所以这里自带一个最小实现，保证配置仍会被
 * 校验并补上默认值，而不是让整个插件加载失败。
 */
const FALLBACK_CONFIG = {
  '~standard': {
    version: 1,
    vendor: 'dsh-persona-dafeiyu',
    validate(value) {
      const config = { enabled: true, prefix: '', suffix: '', personaFile: '' }
      if (value !== undefined && value !== null) {
        if (typeof value !== 'object' || Array.isArray(value)) {
          return { issues: [{ message: 'config must be an object', path: [] }] }
        }
        const issues = []
        if (value.enabled !== undefined) {
          if (typeof value.enabled !== 'boolean') issues.push({ message: 'enabled must be a boolean', path: ['enabled'] })
          else config.enabled = value.enabled
        }
        for (const field of STRING_FIELDS) {
          if (value[field] === undefined) continue
          if (typeof value[field] !== 'string') issues.push({ message: `${field} must be a string`, path: [field] })
          else config[field] = value[field]
        }
        if (value.order !== undefined) {
          if (typeof value.order !== 'number' || !Number.isFinite(value.order)) {
            issues.push({ message: 'order must be a finite number', path: ['order'] })
          } else {
            config.order = value.order
          }
        }
        if (issues.length > 0) return { issues }
      }
      return { value: config }
    },
  },
}

/** 优先用 schemastery 描述配置（插件页表单更完整）；解析不到就用兜底 schema。 */
async function loadConfigSchema() {
  try {
    const loaded = await import('@deepseek-ai/schemastery')
    const z = loaded?.default ?? loaded
    if (typeof z?.object === 'function') {
      return z.object({
        enabled: z.boolean().default(true),
        prefix: z.string().default(''),
        suffix: z.string().default(''),
        personaFile: z.string().default(''),
        order: z.number(),
      })
    }
  } catch {
    /* 解析不到属正常情况，静默使用兜底 schema */
  }
  return FALLBACK_CONFIG
}

/** 插件配置：全部可选，插件页（Plugins → 本行 config）可直接改。 */
export const Config = await loadConfigSchema()

/** 取一个可用的 logger；拿不到就返回 undefined，绝不因为日志失败而抛错。 */
function loggerOf(ctx) {
  try {
    if (typeof ctx.logger === 'function') return ctx.logger('dsh-persona-dafeiyu')
    return ctx.logger
  } catch {
    return undefined
  }
}

/** 人设库文件位置：跟其它插件一个惯例，落在 `<DSH_HOME>/storages/<插件名>/`。 */
export function personaStorePath() {
  const home = process.env.DSH_HOME || path.join(os.homedir(), '.dsh')
  return path.join(home, 'storages', 'dsh-persona-dafeiyu', 'personas.json')
}

/** 空库。`mode` 决定人设是全局唯一，还是每个会话各自一份。 */
function emptyStore() {
  return { version: 1, mode: DEFAULT_MODE, current: DEFAULT_PERSONA_ID, disabled: [], personas: [] }
}

/** 读取生效范围；缺失或非法一律回落到 global（向后兼容旧库文件）。 */
export function modeOf(store) {
  return store?.mode === 'session' ? 'session' : DEFAULT_MODE
}

/** 把磁盘上的内容规整成可用的库；坏数据一律丢弃而不是让插件挂掉。 */
function normalizeStore(raw) {
  const store = emptyStore()
  if (!raw || typeof raw !== 'object') return store
  if (raw.mode === 'global' || raw.mode === 'session') store.mode = raw.mode
  if (typeof raw.current === 'string' && raw.current.trim()) store.current = raw.current.trim()
  if (Array.isArray(raw.disabled)) {
    store.disabled = [...new Set(raw.disabled.filter((id) => typeof id === 'string' && id.trim()))]
  }
  for (const entry of Array.isArray(raw.personas) ? raw.personas : []) {
    if (!entry || typeof entry !== 'object') continue
    if (typeof entry.id !== 'string' || entry.id.trim().length === 0) continue
    if (RESERVED_IDS.includes(entry.id)) continue
    if (typeof entry.text !== 'string' || entry.text.trim().length === 0) continue
    const name = typeof entry.name === 'string' && entry.name.trim() ? entry.name.trim() : '未命名人设'
    store.personas.push({
      id: entry.id,
      name: name.slice(0, MAX_PERSONA_NAME),
      text: entry.text.slice(0, MAX_PERSONA_CHARS),
      enabled: entry.enabled !== false,
      createdAt: typeof entry.createdAt === 'string' ? entry.createdAt : new Date().toISOString(),
    })
  }
  return store
}

/** 读人设库（同步、小文件）。 */
export function readStore() {
  try {
    return normalizeStore(JSON.parse(fs.readFileSync(personaStorePath(), 'utf8')))
  } catch {
    return emptyStore()
  }
}

/** 写人设库：先写临时文件再改名，避免半个文件。 */
export function writeStore(store) {
  const file = personaStorePath()
  fs.mkdirSync(path.dirname(file), { recursive: true })
  const tmp = `${file}.${process.pid}.tmp`
  fs.writeFileSync(tmp, `${JSON.stringify(store, null, 2)}\n`, 'utf8')
  fs.renameSync(tmp, file)
  return file
}

/** 读外部人设文件；失败返回 undefined 并告警。 */
function readPersonaFile(ctx, file) {
  const target = path.resolve(file)
  try {
    const text = fs.readFileSync(target, 'utf8').trim()
    return text.length > 0 ? text : undefined
  } catch (error) {
    loggerOf(ctx)?.warn?.(`人设文件读取失败：${target}（${error?.message ?? error}）`)
    return undefined
  }
}

/**
 * config 里 `prefix` / `personaFile` 描述的那条人设（id 固定为 `config`）。
 * 不配置就返回 undefined，人设列表里也不会出现它。
 */
export function configPersonaOf(ctx, config) {
  const prefix = typeof config.prefix === 'string' ? config.prefix.trim() : ''
  if (prefix.length > 0) {
    return { id: 'config', name: '自定义人设（config）', source: 'config', text: config.prefix, file: undefined }
  }
  const file = typeof config.personaFile === 'string' ? config.personaFile.trim() : ''
  if (file.length > 0) {
    const text = readPersonaFile(ctx, file)
    if (text !== undefined) {
      const base = path.basename(path.resolve(file))
      return { id: 'config', name: base.replace(/\.(md|markdown|txt)$/i, ''), source: 'config', text, file: path.resolve(file) }
    }
  }
  return undefined
}

/** 组装人设目录：内置 + config + 导入。 */
export function buildCatalog(configPersona, store) {
  const catalog = []
  for (const builtin of BUILTIN_PERSONAS) {
    catalog.push({
      id: builtin.id,
      name: builtin.name,
      source: 'builtin',
      builtin: true,
      text: builtin.text,
      description: builtin.description,
      enabled: !store.disabled.includes(builtin.id),
    })
  }
  if (configPersona) {
    catalog.push({
      id: configPersona.id,
      name: configPersona.name,
      source: 'config',
      builtin: false,
      text: configPersona.text,
      file: configPersona.file,
      enabled: !store.disabled.includes(configPersona.id),
    })
  }
  for (const entry of store.personas) {
    catalog.push({
      id: entry.id,
      name: entry.name,
      source: 'imported',
      builtin: false,
      text: entry.text,
      createdAt: entry.createdAt,
      enabled: entry.enabled !== false,
    })
  }
  return catalog
}

/** 选出当前生效的那条人设（找不到就退回默认，并顺手修正库里的 current）。 */
export function currentPersonaOf(catalog, store) {
  const found = catalog.find((persona) => persona.id === store.current)
  if (found) return found
  const fallback = catalog.find((persona) => persona.id === DEFAULT_PERSONA_ID) ?? catalog[0]
  if (fallback && store.current !== fallback.id) store.current = fallback.id
  return fallback
}

/**
 * 组装给浏览器半侧看的完整快照。
 * 这里只给元数据：内置人设带 `description` 简介，正文一律不塞进来；
 * 需要正文时（导入 / config 人设的「查看全文」）再走 `BRIDGE_PERSONA_PATH` 按需取。
 * `probe` 是阶段 0 的探针数据，只用于确认提示词函数能拿到哪些会话上下文。
 */
function snapshotOf(config, configPersona, store, order, runtime = {}) {
  const { probe, sessions, sessionId } = runtime
  const catalog = buildCatalog(configPersona, store)
  const current = currentPersonaOf(catalog, store)
  const mode = modeOf(store)
  const configEnabled = config.enabled !== false
  const active = configEnabled && current !== undefined && current.enabled
  const text = active ? current.text : ''
  // 会话视角：调用方带了 sessionId 时，把这一个会话的选择也告诉浏览器。
  const pickId = sessions?.get(sessionId)
  const picked = pickId ? catalog.find((persona) => persona.id === pickId) : undefined
  return {
    plugin: name,
    enabled: configEnabled,
    active,
    current: current?.id ?? null,
    currentName: current?.name ?? null,
    source: current?.source ?? null,
    personaFile: current?.file ?? null,
    section: PERSONA_SECTION,
    order,
    chars: text.length,
    mode,
    sessionId: typeof sessionId === 'string' && sessionId.length > 0 ? sessionId : null,
    sessionPersona: picked ? { id: picked.id, name: picked.name } : null,
    sessionCount: sessions ? sessions.size() : 0,
    storePath: personaStorePath(),
    personas: catalog.map((persona) => ({
      id: persona.id,
      name: persona.name,
      source: persona.source,
      builtin: persona.builtin === true,
      enabled: persona.enabled,
      current: current !== undefined && persona.id === current.id,
      sessionPick: picked !== undefined && persona.id === picked.id,
      chars: persona.text.length,
      createdAt: persona.createdAt ?? null,
      ...persona.description === undefined ? {} : { description: persona.description },
    })),
    ...probe === undefined ? {} : { probe },
    bridge: { status: BRIDGE_STATUS_PATH, mutate: BRIDGE_MUTATE_PATH, persona: BRIDGE_PERSONA_PATH },
  }
}

/** 校验人设名字。 */
function validateName(name, catalog, excludeId) {
  const trimmed = typeof name === 'string' ? name.trim() : ''
  if (trimmed.length === 0) return { error: '名字不能为空' }
  if (trimmed.length > MAX_PERSONA_NAME) return { error: `名字不能超过 ${MAX_PERSONA_NAME} 个字符` }
  const clash = catalog.find((persona) => persona.id !== excludeId && persona.name.trim().toLowerCase() === trimmed.toLowerCase())
  if (clash) return { error: `已存在同名人设「${clash.name}」` }
  return { name: trimmed }
}

/** 生成一个不会撞车的导入 id。 */
function nextImportedId(store) {
  const base = Date.now().toString(36)
  let suffix = 0
  let id = `custom-${base}`
  const taken = new Set(store.personas.map((entry) => entry.id))
  while (taken.has(id)) id = `custom-${base}-${++suffix}`
  return id
}

/**
 * 执行一次变更，成功后落盘。
 * `sessions` 是会话级选择表；缺省时「会话级」相关操作会被拒绝（测试里可以只测全局逻辑）。
 * @returns `{ ok: true }` 或 `{ ok: false, error }`。
 */
export function mutatePersona(action, config, configPersona, store, sessions) {
  const payload = action && typeof action === 'object' ? action : {}
  const kind = typeof payload.action === 'string' ? payload.action : ''
  const catalog = buildCatalog(configPersona, store)
  const byId = (id) => catalog.find((persona) => persona.id === id)

  switch (kind) {
    case 'set-current': {
      const target = byId(payload.id)
      if (!target) return { ok: false, error: `找不到人设「${payload.id}」` }
      store.current = target.id
      // 设为当前即视为要用它：顺手启用。
      store.disabled = store.disabled.filter((id) => id !== target.id)
      const imported = store.personas.find((entry) => entry.id === target.id)
      if (imported) imported.enabled = true
      break
    }
    case 'import': {
      const text = typeof payload.text === 'string' ? payload.text.trim() : ''
      if (text.length === 0) return { ok: false, error: '人设正文不能为空' }
      if (text.length > MAX_PERSONA_CHARS) return { ok: false, error: `人设正文不能超过 ${MAX_PERSONA_CHARS} 个字符` }
      const named = validateName(payload.name, catalog)
      if (named.error) return { ok: false, error: named.error }
      store.personas.push({
        id: nextImportedId(store),
        name: named.name,
        text,
        enabled: true,
        createdAt: new Date().toISOString(),
      })
      break
    }
    case 'rename': {
      const target = byId(payload.id)
      if (!target) return { ok: false, error: `找不到人设「${payload.id}」` }
      if (target.builtin) return { ok: false, error: '内置人设不可重命名' }
      const imported = store.personas.find((entry) => entry.id === target.id)
      if (!imported) return { ok: false, error: '只有导入的人设可以重命名' }
      const named = validateName(payload.name, catalog, target.id)
      if (named.error) return { ok: false, error: named.error }
      imported.name = named.name
      break
    }
    case 'remove': {
      const target = byId(payload.id)
      if (!target) return { ok: false, error: `找不到人设「${payload.id}」` }
      if (target.builtin) return { ok: false, error: '内置人设不可删除' }
      if (target.source === 'config') return { ok: false, error: 'config 人设由插件配置决定，清空 prefix / personaFile 即可移除' }
      store.personas = store.personas.filter((entry) => entry.id !== target.id)
      store.disabled = store.disabled.filter((id) => id !== target.id)
      if (store.current === target.id) store.current = DEFAULT_PERSONA_ID
      break
    }
    case 'set-enabled': {
      const target = byId(payload.id)
      if (!target) return { ok: false, error: `找不到人设「${payload.id}」` }
      const enabled = payload.enabled !== false
      if (target.source === 'imported') {
        const imported = store.personas.find((entry) => entry.id === target.id)
        if (imported) imported.enabled = enabled
      }
      if (enabled) store.disabled = store.disabled.filter((id) => id !== target.id)
      else if (!store.disabled.includes(target.id)) store.disabled.push(target.id)
      break
    }
    case 'set-mode': {
      if (payload.mode !== 'global' && payload.mode !== 'session') {
        return { ok: false, error: `未知生效范围「${payload.mode}」` }
      }
      store.mode = payload.mode
      break
    }
    case 'set-session-persona': {
      if (!sessions) return { ok: false, error: '当前运行时不支持会话级人设' }
      const sessionId = typeof payload.sessionId === 'string' ? payload.sessionId.trim() : ''
      if (sessionId.length === 0) return { ok: false, error: '缺少 sessionId' }
      // personaId 传 null / 空串 = 清除该会话的选择，回落到全局人设。
      if (payload.personaId === null || payload.personaId === undefined || payload.personaId === '') {
        sessions.clear(sessionId)
        break
      }
      const target = byId(payload.personaId)
      if (!target) return { ok: false, error: `找不到人设「${payload.personaId}」` }
      sessions.set(sessionId, target.id)
      break
    }
    default:
      return { ok: false, error: `未知操作「${kind}」` }
  }

  try {
    writeStore(store)
  } catch (error) {
    return { ok: false, error: `写入人设库失败：${error?.message ?? error}` }
  }
  return { ok: true }
}

/** 解析段落顺序：显式 order > 注册表的 DEPLOYMENT_PERSONA_PREFIX > 0。 */
function resolveOrder(ctx, config, slot) {
  if (Number.isFinite(config.order)) return config.order
  try {
    const order = ctx.systemPrompt.getSectionOrder(slot)
    if (Number.isFinite(order)) return order
  } catch {
    /* 注册表没有该方法时退回默认值 */
  }
  return slot === 'DEPLOYMENT_PERSONA_SUFFIX' ? 10200 : 0
}

/** 只认回环请求，避免人设库暴露给局域网。 */
function isLoopbackRequest(request) {
  const address = request?.socket?.remoteAddress
  const okAddress = address === '127.0.0.1' || address === '::1' || address === '::ffff:127.0.0.1' || address === undefined
  if (!okAddress) return false
  const host = request?.headers?.host
  if (typeof host !== 'string') return true
  try {
    const hostname = new URL(`http://${host}`).hostname
    return hostname === '127.0.0.1' || hostname === 'localhost' || hostname === '[::1]' || hostname === '::1'
  } catch {
    return false
  }
}

/** 从请求 URL 里取一个查询参数（取不到返回 undefined）。 */
function queryParam(request, key) {
  try {
    const value = new URL(request?.url ?? '/', 'http://127.0.0.1').searchParams.get(key)
    return typeof value === 'string' && value.length > 0 ? value : undefined
  } catch {
    return undefined
  }
}

/** 写一份 JSON 响应。 */
function writeJson(response, status, payload) {
  const body = JSON.stringify(payload)
  response.writeHead?.(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
  response.end?.(body)
}

/** 读请求体（JSON），带体积上限。 */
function readJsonBody(request, limit = 512 * 1024) {
  return new Promise((resolve) => {
    let size = 0
    const chunks = []
    let settled = false
    const finish = (value) => {
      if (settled) return
      settled = true
      resolve(value)
    }
    request.on('data', (chunk) => {
      size += chunk.length
      if (size > limit) {
        finish(undefined)
        request.destroy?.()
        return
      }
      chunks.push(chunk)
    })
    request.on('end', () => {
      if (chunks.length === 0) return finish({})
      try {
        finish(JSON.parse(Buffer.concat(chunks).toString('utf8')))
      } catch {
        finish(undefined)
      }
    })
    request.on('error', () => finish(undefined))
  })
}

/**
 * 注册宿主侧的一切。
 * @param ctx - 插件上下文，必须能拿到 `systemPrompt` 服务。
 * @param config - 可选配置，缺省即用内置人设库。
 */
export function apply(ctx, config) {
  const resolved = { ...DEFAULTS, ...(config && typeof config === 'object' ? config : {}) }
  const configPersona = configPersonaOf(ctx, resolved)
  const store = readStore()
  const order = resolveOrder(ctx, resolved, 'DEPLOYMENT_PERSONA_PREFIX')
  // 会话级人设选择：进程内、不落盘（见 createSessionPicks 的说明）。
  const sessions = createSessionPicks()

  // ── 阶段 0 探针 ────────────────────────────────────────────────
  // 目的：确认提示词函数每次组装时能拿到哪些会话上下文，尤其是会话 id。
  // 结果通过 /status 路由的 `probe` 字段暴露，只读、不落盘。
  const probe = { calls: 0, sessionIds: [], contextKeys: null, headerKeys: null, lastAt: null }

  /** 记录一次组装看到的上下文形状（键名只在首次采样时记录）。 */
  const recordProbe = (context) => {
    probe.calls += 1
    probe.lastAt = new Date().toISOString()
    if (probe.contextKeys === null) probe.contextKeys = Object.keys(context ?? {}).sort()
    const agent = context?.agent
    if (probe.headerKeys === null && agent?.session?.header) {
      probe.headerKeys = Object.keys(agent.session.header).sort()
    }
    const sessionId = sessionIdOf(context)
    if (sessionId !== undefined && !probe.sessionIds.includes(sessionId)) {
      probe.sessionIds.push(sessionId)
      if (probe.sessionIds.length > 20) probe.sessionIds.shift()
    }
  }

  /**
   * 当前生效的人设正文。提示词每次组装都会重新调用它（并传入本次的 context），
   * 所以切换后下一个请求就生效。
   *
   * 生效范围有两种：
   * - `global`：所有会话共用库里「当前」的那一条（老行为）；
   * - `session`：本会话若在库里挑过一条就用它，没挑过则回落到「当前」那一条。
   *   挑的那条必须来自设置里已导入的库，本插件不会为会话新建人设。
   */
  const activeText = (context) => {
    recordProbe(context)
    if (resolved.enabled === false) return ''
    const catalog = buildCatalog(configPersona, store)
    const current = currentPersonaOf(catalog, store)
    if (modeOf(store) === 'session') {
      const pickId = sessions.get(sessionIdOf(context))
      const picked = pickId === undefined ? undefined : catalog.find((persona) => persona.id === pickId)
      if (picked !== undefined && picked.enabled) return picked.text
    }
    return current && current.enabled ? current.text : ''
  }

  if (resolved.enabled === false) {
    loggerOf(ctx)?.info?.('人设注入已停用（enabled: false）')
  } else {
    ctx.effect(
      () => ctx.systemPrompt.section({
        name: PERSONA_SECTION,
        order,
        text: activeText,
        interpolate: false,
      }),
      'dsh-persona-dafeiyu: persona section',
    )
  }

  const suffix = typeof resolved.suffix === 'string' ? resolved.suffix : ''
  if (suffix.trim().length > 0) {
    ctx.effect(
      () => ctx.systemPrompt.section({
        name: PERSONA_SUFFIX_SECTION,
        order: resolveOrder(ctx, resolved, 'DEPLOYMENT_PERSONA_SUFFIX'),
        text: suffix,
        interpolate: false,
      }),
      'dsh-persona-dafeiyu: persona suffix',
    )
  }

  const initial = currentPersonaOf(buildCatalog(configPersona, store), store)
  loggerOf(ctx)?.info?.(
    `人设库已加载：当前「${initial?.name ?? '无'}」，共 ${buildCatalog(configPersona, store).length} 条（${personaStorePath()}）`,
  )

  // 浏览器半侧的数据接口。
  if (typeof ctx.inject === 'function') {
    ctx.inject(['webServer'], (scope) => {
      scope.effect(
        () => scope.webServer.register({
          kind: 'exact',
          path: BRIDGE_STATUS_PATH,
          handler: (request, response) => {
            if (!isLoopbackRequest(request)) {
              writeJson(response, 403, { ok: false, error: 'loopback requests only' })
              return
            }
            if ((request.method ?? 'GET') !== 'GET') {
              writeJson(response, 405, { ok: false, error: 'method not allowed' })
              return
            }
            writeJson(response, 200, {
              ok: true,
              // `?sessionId=` 让浏览器把它当前看的那个会话带上，快照里就多一份会话视角。
              value: snapshotOf(resolved, configPersona, store, order, {
                probe,
                sessions,
                sessionId: queryParam(request, 'sessionId'),
              }),
            })
          },
        }),
        'dsh-persona-dafeiyu: status bridge',
      )
      scope.effect(
        () => scope.webServer.register({
          kind: 'exact',
          path: BRIDGE_MUTATE_PATH,
          handler: async (request, response) => {
            if (!isLoopbackRequest(request)) {
              writeJson(response, 403, { ok: false, error: 'loopback requests only' })
              return
            }
            if ((request.method ?? '') !== 'POST') {
              writeJson(response, 405, { ok: false, error: 'method not allowed' })
              return
            }
            const body = await readJsonBody(request)
            if (body === undefined) {
              writeJson(response, 400, { ok: false, error: 'malformed JSON body' })
              return
            }
            const result = mutatePersona(body, resolved, configPersona, store, sessions)
            if (!result.ok) {
              writeJson(response, 200, { ok: false, error: result.error })
              return
            }
            writeJson(response, 200, {
              ok: true,
              value: snapshotOf(resolved, configPersona, store, order, {
                probe,
                sessions,
                sessionId: typeof body?.sessionId === 'string' ? body.sessionId : undefined,
              }),
            })
          },
        }),
        'dsh-persona-dafeiyu: mutate bridge',
      )
      scope.effect(
        () => scope.webServer.register({
          kind: 'exact',
          path: BRIDGE_PERSONA_PATH,
          handler: (request, response) => {
            if (!isLoopbackRequest(request)) {
              writeJson(response, 403, { ok: false, error: 'loopback requests only' })
              return
            }
            if ((request.method ?? 'GET') !== 'GET') {
              writeJson(response, 405, { ok: false, error: 'method not allowed' })
              return
            }
            let id
            try {
              id = new URL(request.url ?? '/', 'http://127.0.0.1').searchParams.get('id') ?? ''
            } catch {
              id = ''
            }
            if (id.length === 0) {
              writeJson(response, 200, { ok: false, error: '缺少 id 参数' })
              return
            }
            const persona = buildCatalog(configPersona, store).find((entry) => entry.id === id)
            if (!persona) {
              writeJson(response, 200, { ok: false, error: `找不到人设「${id}」` })
              return
            }
            writeJson(response, 200, {
              ok: true,
              value: {
                id: persona.id,
                name: persona.name,
                source: persona.source,
                builtin: persona.builtin === true,
                chars: persona.text.length,
                text: persona.text,
              },
            })
          },
        }),
        'dsh-persona-dafeiyu: persona text bridge',
      )
    })
  }
}
