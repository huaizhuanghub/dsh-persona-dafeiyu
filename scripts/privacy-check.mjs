#!/usr/bin/env node
/**
 * dsh-persona-dafeiyu · 本机信息自查（只读，不改任何文件）
 *
 *   npm run privacy-check
 *   # 等价于： node scripts/privacy-check.mjs
 *
 * 用途：在内容离开本机之前（git add / git push / 打包分享 / 截图）先把
 * 「不该出现在公开仓库里的本机信息」抓出来。
 *
 * 覆盖范围：
 *   - 带盘符的 Windows 绝对路径
 *   - 类 Unix 的家目录绝对路径（含用户名的那一段）
 *   - 本机用户名、本机主机名（运行时取，脚本自身不存这些值）
 *   - 邮箱地址
 *   - IPv4 地址（放行回环、RFC 5737 文档示例段，以及本项目的测试夹具）
 *   - 已知平台的密钥前缀：GitHub / OpenAI / Anthropic / AWS / Google / Slack /
 *     GitLab / npm / Stripe，以及 JWT、URL 内嵌账号口令、写死的 Bearer 凭据
 *   - 高熵字符串：不依赖任何前缀知识，专抓「看起来随机」的长串
 *   - 疑似口令 / 密钥赋值
 *   - 私钥 PEM 头与 SSH 公钥
 *   - 不该入库的文件：环境变量文件、密钥、日志、打包产物、本地人设库
 *
 * 退出码：0 = 干净；1 = 有发现（逐条打印 file:line + 原因）。
 * 本脚本会被自己扫描一遍：所有规则都用字符类 / 转义写法描述，
 * 因此不会出现「扫描器把自己扫出来」的误报。
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')

/** 这些目录直接跳过：版本库内部、依赖、构建产物。 */
const SKIP_DIRS = new Set([
  '.git', 'node_modules', 'dist', 'build', 'out', 'coverage',
  '.cache', '.venv', 'venv', '__pycache__', '.next', '.turbo',
])

/** 超过这个体积的文件不扫（避免误读进大二进制）。 */
const MAX_BYTES = 2 * 1024 * 1024

/** 允许出现在仓库里的回环地址与测试夹具。 */
const ALLOWED_IPV4 = new Set(['0.0.0.0', '10.0.0.1', '10.0.0.9'])

/** RFC 5737 文档示例网段 + 回环，一律放行。 */
const DOC_OR_LOOPBACK = /^(?:127\.|192\.0\.2\.|198\.51\.100\.|203\.0\.113\.)/

/** 明显是占位符的值，不算泄漏。 */
const PLACEHOLDER = /^(?:<.*>|\$\{.*\}|YOUR[_-].*|CHANGE[_-]?ME|REPLACE[_-]?ME|xxx+|\.\.\.|true|false|null|undefined|example.*|placeholder.*|)$/i

// ─────────────────────────────────────────────── 规则

/** 按正则找。keep 可进一步筛掉「其实没问题」的命中。 */
function regexRule(id, why, re, keep) {
  return {
    id,
    why,
    find(line) {
      const out = []
      for (const match of line.matchAll(re)) {
        if (keep && !keep(match[0])) continue
        out.push(match[0])
      }
      return out
    },
  }
}

/** 按字面量找（大小写不敏感）。用于运行期才拿得到的用户名 / 主机名。 */
function literalRule(id, why, needle) {
  const lower = needle.toLowerCase()
  return {
    id,
    why,
    raw: needle,
    find(line) {
      const at = line.toLowerCase().indexOf(lower)
      return at === -1 ? [] : [line.slice(at, at + needle.length)]
    },
  }
}

/** 香农熵：越高越像随机生成的密钥。 */
function entropy(text) {
  const freq = new Map()
  for (const ch of text) freq.set(ch, (freq.get(ch) ?? 0) + 1)
  let h = 0
  for (const count of freq.values()) {
    const p = count / text.length
    h -= p * Math.log2(p)
  }
  return h
}

/**
 * 高熵字符串规则：不依赖任何厂商前缀知识，专抓「看起来随机」的长串。
 * 要求同时含字母和数字，避免把长标识符 / 全小写单词算成密钥。
 */
function highEntropyRule(id, why, minLength = 24, minEntropy = 4.2) {
  return {
    id,
    why,
    find(line) {
      const out = []
      for (const match of line.matchAll(/[A-Za-z0-9+/=_-]{24,}/g)) {
        const token = match[0]
        if (token.length < minLength) continue
        if (!/[0-9]/.test(token) || !/[A-Za-z]/.test(token)) continue
        if (entropy(token) >= minEntropy) out.push(token)
      }
      return out
    },
  }
}

const RULES = [
  regexRule(
    'win-abs-path',
    'Windows 绝对路径（带盘符，通常连带用户名）',
    /[A-Za-z]:\\[^\s"']*/g,
    (text) => {
      // 文档里刻意写的占位形式放行，例如「盘符:\<你的目录>」
      if (/^[A-Za-z]:\\</.test(text)) return false
      const body = text.slice(3)
      // 还有下一级分隔符 → 基本可以断定是路径
      if (body.includes('\\')) return true
      // 单段路径：系统目录风格的目录名（首字母大写），或带扩展名的文件名
      // 这条兜底是为了放过正则字面量里的转义序列（形如 盘符:\s*），它们都是小写单字母开头
      return /^[A-Z]/.test(body) || body.includes('.')
    },
  ),
  regexRule(
    'posix-home-path',
    '类 Unix 家目录绝对路径（包含用户名）',
    /\/(?:Users|home)\/[A-Za-z0-9._-]+/g,
    (text) => !/\/(?:Users|home)\/</.test(text),
  ),
  regexRule(
    'email',
    '邮箱地址（提交者身份信息）',
    /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+/g,
    (text) => !PLACEHOLDER.test(text) && !/@(?:example|test|localhost)\./i.test(text),
  ),
  regexRule(
    'ipv4',
    'IPv4 地址',
    /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
    (text) => !ALLOWED_IPV4.has(text) && !DOC_OR_LOOPBACK.test(text),
  ),
  regexRule(
    'secret-assignment',
    '疑似密钥 / 口令赋值',
    /\b(?:password|passwd|passphrase|secret|api[_-]?key|access[_-]?token|auth[_-]?token|client[_-]?secret)\b\s*[:=]\s*["']?([^\s"',}]{8,})/gi,
    (text) => !PLACEHOLDER.test(text.replace(/^[^:=]*[:=]\s*["']?/, '')),
  ),
  regexRule(
    'known-key-prefix',
    '已知平台的密钥前缀',
    /\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-ant-[A-Za-z0-9_-]{16,}|sk-[A-Za-z0-9_-]{16,}|(?:AKIA|ASIA)[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{30,}|xox[baprs]-[A-Za-z0-9-]{10,}|glpat-[A-Za-z0-9_-]{16,}|npm_[A-Za-z0-9]{30,}|(?:sk|pk|rk)_(?:live|test)_[A-Za-z0-9]{16,})\b/g,
  ),
  regexRule(
    'jwt',
    'JWT 形式的令牌',
    /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g,
  ),
  regexRule(
    'url-credentials',
    'URL 里内嵌的账号口令',
    /[a-z][a-z0-9+.-]*:\/\/[^/\s:@]+:[^/\s:@]+@[A-Za-z0-9.-]+/gi,
  ),
  regexRule(
    'bearer-literal',
    '写死的 Bearer 凭据',
    /authorization\s*[:=]\s*["'`]?Bearer\s+[A-Za-z0-9._-]{12,}/gi,
  ),
  highEntropyRule('high-entropy', '高熵字符串（疑似随机生成的密钥）'),
  regexRule(
    'private-key',
    '私钥 PEM 头',
    /-----BEGIN [A-Z ]*PRIVATE KEY-----/g,
  ),
  regexRule(
    'ssh-public-key',
    'SSH 公钥（可用于关联身份）',
    /ssh-(?:rsa|ed25519|dss) [A-Za-z0-9+/=]{20,}/g,
  ),
]

/** 本机用户名 / 主机名：运行时取值，脚本文件里不出现这些字面量。 */
const localIdentity = []
try {
  const username = os.userInfo().username
  if (typeof username === 'string' && username.length >= 4) {
    localIdentity.push(literalRule('local-username', '本机用户名', username))
  }
} catch {
  /* 拿不到就算了 */
}
try {
  const hostname = os.hostname()
  if (typeof hostname === 'string' && hostname.length >= 4) {
    localIdentity.push(literalRule('local-hostname', '本机主机名', hostname))
  }
} catch {
  /* 同上 */
}

const ALL_RULES = [...RULES, ...localIdentity]

/** 不该出现在版本库里的文件（按文件名判断）。 */
const FORBIDDEN_FILES = [
  { re: /^\.env(?!\.example$)/i, why: '环境变量文件可能含密钥：请改用 .env.example + 说明' },
  { re: /\.(?:pem|key|p12|pfx|jks|keystore)$/i, why: '私钥 / 证书文件' },
  { re: /^id_(?:rsa|dsa|ecdsa|ed25519)$/, why: 'SSH 私钥' },
  { re: /^\.npmrc$/i, why: 'npm 配置可能含 registry token' },
  { re: /\.(?:log|tgz|zip|7z|rar|tar|gz)$/i, why: '日志 / 打包产物不应入库' },
  { re: /^personas\.json$/i, why: '人设库是本地运行数据，不应入库' },
  { re: /\.(?:bak|orig|rej|tmp|swp)$/i, why: '临时 / 备份文件' },
]

// ─────────────────────────────────────────────── 扫描

const files = []
;(function walk(dir) {
  let entries
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue
      walk(path.join(dir, entry.name))
    } else if (entry.isFile()) {
      files.push(path.join(dir, entry.name))
    }
  }
})(root)

/** 粗略判断是不是文本：前 8KB 不出现 NUL 字节即可。 */
function looksText(buffer) {
  const limit = Math.min(buffer.length, 8192)
  for (let i = 0; i < limit; i += 1) if (buffer[i] === 0) return false
  return true
}

/** 把本机身份信息从输出里抹掉，避免自查看起来像又一次泄漏。 */
function redact(text) {
  let out = text
  for (const rule of localIdentity) {
    if (!rule.raw) continue
    const escaped = rule.raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    out = out.replace(new RegExp(escaped, 'gi'), '<redacted>')
  }
  return out
}

const findings = []
const notes = []
let scanned = 0
let skippedLarge = 0
let skippedBinary = 0

for (const file of files) {
  const relative = path.relative(root, file).split(path.sep).join('/')

  for (const rule of FORBIDDEN_FILES) {
    if (rule.re.test(path.basename(file))) {
      findings.push({ file: relative, line: 0, rule: 'forbidden-file', why: rule.why, sample: '' })
    }
  }

  let buffer
  try {
    buffer = fs.readFileSync(file)
  } catch {
    continue
  }
  if (buffer.length > MAX_BYTES) {
    skippedLarge += 1
    continue
  }
  if (!looksText(buffer)) {
    skippedBinary += 1
    continue
  }
  scanned += 1

  const lines = buffer.toString('utf8').split(/\r?\n/)
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    if (line.length === 0) continue
    for (const rule of ALL_RULES) {
      for (const hit of rule.find(line)) {
        findings.push({
          file: relative,
          line: index + 1,
          rule: rule.id,
          why: rule.why,
          sample: redact(hit).slice(0, 120),
        })
      }
    }
  }
}

if (fs.existsSync(path.join(root, 'node_modules'))) {
  notes.push('node_modules 存在（已在 .gitignore 中排除，不会被提交）')
}

// ─────────────────────────────────────────────── 报告

console.log('dsh-persona-dafeiyu · 本机信息自查')
console.log(`仓库根目录：${root}`)
console.log(
  `已扫描 ${scanned} 个文本文件`
  + (skippedLarge ? `，跳过 ${skippedLarge} 个超大文件` : '')
  + (skippedBinary ? `，跳过 ${skippedBinary} 个二进制文件` : ''),
)
console.log(`启用规则 ${ALL_RULES.length} 条（含 ${localIdentity.length} 条运行期身份规则）`)
console.log('')

for (const note of notes) console.log(`提示  ${note}`)
if (notes.length > 0) console.log('')

if (findings.length === 0) {
  console.log('PASS  没有发现本机信息，可以安全提交 / 推送。')
  process.exitCode = 0
} else {
  const byFile = new Map()
  for (const item of findings) {
    if (!byFile.has(item.file)) byFile.set(item.file, [])
    byFile.get(item.file).push(item)
  }
  for (const [file, items] of byFile) {
    console.log(`${file}`)
    for (const item of items) {
      const at = item.line > 0 ? `:${item.line}` : ''
      const sample = item.sample ? `  →  ${item.sample}` : ''
      console.log(`  [${item.rule}] ${item.why}${at}${sample}`)
    }
    console.log('')
  }
  console.log(`FAIL  共 ${findings.length} 处发现，涉及 ${byFile.size} 个文件。`)
  console.log('      请替换为占位符（如 <本仓库绝对路径> / <profile> / <port>）或改成运行时求值。')
  process.exitCode = 1
}
