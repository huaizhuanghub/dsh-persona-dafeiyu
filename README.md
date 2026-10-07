# dsh-persona-dafeiyu · 人设库插件

把「人设」做成 DeepSeek Harness（DSH）的插件：装进某个 profile 后，该 profile 下所有会话的
系统提示词里都会注入**当前选中的人设** —— 不用每次手动粘贴提示词。

[![ci](https://github.com/huaizhuanghub/dsh-persona-dafeiyu/actions/workflows/ci.yml/badge.svg)](https://github.com/huaizhuanghub/dsh-persona-dafeiyu/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/dsh-persona-dafeiyu.svg)](https://www.npmjs.com/package/dsh-persona-dafeiyu)
[![license](https://img.shields.io/npm/l/dsh-persona-dafeiyu.svg)](./LICENSE)

- **内置人设**：大肥鱼、阿茶（写死在代码里，不可删除、不可覆盖）。
- **导入人设**：在设置页里用文件导入或直接粘贴文本，自动生成可选条目。
- **设置页「人设」小节**：查看当前人设、切换、启用 / 停用、重命名、删除、导入。
- **免重启切换**：人设段落的 `text` 是动态函数，提示词每次组装都会重新求值，
  所以切换后**下一个请求**就用新文本，无需重启、无需重新加载插件。
- **正文按需下发**：状态接口只给元数据（内置人设只给一句简介），点「查看全文」才拉那一条的正文。

## 目录结构

```text
dsh-persona-dafeiyu/
├─ package.json                 dsh.bundle.patch / dsh.client 声明 + peer 依赖
├─ cordis.patch.yml             组合包 patch：把本插件的行插进 profile
├─ lib/
│  ├─ index.js                  宿主半侧：人设库 + 动态提示词段落 + 三条回环接口
│  └─ client.js                 浏览器半侧：设置页「大肥鱼」小节（settings.section，order 18）
├─ test/verify.mjs              不依赖 DSH 运行时的自检（21 项）
├─ scripts/privacy-check.mjs    本机信息自查：推送前跑一遍
├─ examples/
│  ├─ persona.example.md        人设文件格式示例
│  └─ config.example.yml        插件 config 示例
├─ .github/workflows/ci.yml     CI：自检 + 隐私自查
├─ .gitignore / .gitattributes
├─ CONTRIBUTING.md
├─ LICENSE                      MIT
└─ README.md
```

## 安装

### 前置条件

- Node.js ≥ 20
- DSH `0.2.0-rc.2`（兼容性见文末）

### 方式 A：从 npm 安装（推荐）

本包已发布到 npm，**不需要克隆仓库、不需要构建**。

**界面上装**：侧边栏 → **插件** → **添加插件** → 输入包名：

```text
dsh-persona-dafeiyu
```

**命令行装**：

```powershell
dsh plugin --profile <profile> add dsh-persona-dafeiyu
```

`<profile>` 换成你自己的 profile 名。DSH 随安装自带的模板只有
`acp` / `web` / `headless` / `sdk` / `sdk-minimal`，你自己建的那个叫什么就用什么。

> 本包是纯 JavaScript、**没有构建脚本**，所以不会触发 pnpm 的「允许运行构建脚本」提示——
> 输入包名即可装好，这是最省事的方式。

### 方式 B：从源码目录安装（改代码时用）

```powershell
git clone https://github.com/huaizhuanghub/dsh-persona-dafeiyu.git
cd dsh-persona-dafeiyu
(Get-Location).Path
```

最后一行打印的绝对路径，下面安装命令要用到。然后：

```powershell
dsh plugin --profile <profile> add "<本仓库绝对路径>"
```

或者在插件页「添加插件」里填这个绝对路径。

本包**没有运行时依赖**（`@deepseek-ai/*` 全是 optional peer，由 DSH 运行时提供），
所以克隆后不需要 `npm install` 就能直接跑自检。

两种方式都会把本包写进 profile 的 `dsh.profile.bundles`。

### 生效时机与「免重启」的边界

- **切换人设不需要重启**：那是运行中的插件按需重算段落文本，下一个请求立即生效。
- 但**插件代码本身**（`lib/index.js` / `lib/client.js`）更新后，要让宿主与浏览器拿到新版本，
  仍需**重启 DeepSeek Harness**（客户端 bundle 至少要刷新页面）。这是加载机制，不是人设切换。

### 安装位置提醒

本地目录安装是 `link:`（pnpm 建软链接指向本目录），所以**别把本目录删掉**再重启。
想彻底自包含，可以先 `npm pack` 出 tgz 再安装。

## 使用（设置 → 大肥鱼）

| 区域 | 能做什么 |
|---|---|
| 当前生效 | 看当前人设名、来源（内置 / 导入 / config）、启停状态、段落位置、字数、人设库文件路径；内置人设显示**简介**，自导入人设提示去列表看全文 |
| 人设列表 | 每条显示**名称 + 来源徽标 + 字数**；可「设为当前」「启用 / 停用」；导入的还可以「重命名」「删除」（删除需二次确认） |
| 内置人设 | 大肥鱼、阿茶：**只展示简介**，没有删除 / 重命名 / 查看全文按钮，列表里标注「内置人设不可删除或重命名」 |
| 自导入人设 | 每条都有「**查看全文**」：按需拉取并展开**完整提示词**（含换行），再点收起 |
| 导入人设 | 选 `.md` / `.markdown` / `.txt` 文件（自动填入正文与名称），或直接把提示词粘贴到文本框，点「导入」 |

正文展示的分工（就是这条设计约定）：

- **内置人设**：提示词由插件维护并用自检锁住，界面**只给简介**，不展示正文；
- **自导入 / config 人设**：正文是你自己的资产，界面提供「查看全文」完整阅读，
  且正文**不随状态接口批量下发**，只在你点开那一条时按需取。

规则说明：

- 「设为当前」会**自动启用**该人设（停用状态下点它就会恢复注入）。
- 停用**当前**人设 → 系统提示词里不注入任何人设段落（状态显示「当前人设已被停用」）。
- 停用**非当前**人设只影响它自己，当前人设照旧。
- 删除当前人设会**回落到大肥鱼**。
- 人设名不能为空、不能超过 60 字符、不能与其他人设重名。
- 人设正文不能为空、上限 64,000 字符。

导入用的文件长什么样，见 [`examples/persona.example.md`](examples/persona.example.md)。

## 人设库与接口

- 持久化位置：`<DSH_HOME>/storages/dsh-persona-dafeiyu/personas.json`。
  `DSH_HOME` 没设时退回 DSH 家目录（Windows 上是 `%USERPROFILE%\.dsh\`，类 Unix 上是 `~/.dsh/`），
  代码里走 `os.homedir()` 动态求值、不写死任何绝对路径。
  写入采用「临时文件 + 改名」，文件损坏时回退到空库而不会让插件挂掉。
- 接口（都只接受回环请求）：

  | 方法 | 路径 | 作用 |
  |---|---|---|
  | `GET` | `/api/dsh-persona-dafeiyu/status` | 当前状态 + 人设列表（**只有元数据，不含正文**）+ 存储路径 |
  | `GET` | `/api/dsh-persona-dafeiyu/persona?id=<id>` | 按需取**单条**人设的完整正文（设置页「查看全文」用） |
  | `POST` | `/api/dsh-persona-dafeiyu/mutate` | `set-current` / `import` / `rename` / `remove` / `set-enabled` |

  非回环访问返回 403，方法不对返回 405，请求体不是 JSON 返回 400，操作被拒时返回
  `{ ok: false, error }`（HTTP 仍为 200，错误语义在 body 里）。

- 活体自测（端口以 DSH 启动时打印的地址为准）：

  ```powershell
  Invoke-WebRequest http://127.0.0.1:<port>/api/dsh-persona-dafeiyu/status -UseBasicParsing
  ```

## 插件配置（可选）

在「插件」页选中 dsh-persona-dafeiyu 那一行改 config，或直接编辑 `cordis.patch.yml`：

| 字段 | 默认 | 含义 |
|---|---|---|
| `enabled` | `true` | 总开关；关掉即完全不注册段落（设置页会显示「插件被 enabled: false 停用」） |
| `prefix` | `''` | 自定义人设正文，在列表里作为一条 **config** 人设出现 |
| `personaFile` | `''` | 外部 Markdown 人设文件路径，同样作为一条 **config** 人设出现 |
| `suffix` | `''` | 追加在工具指导之后的人设后缀（order 对齐 `DEPLOYMENT_PERSONA_SUFFIX` = 10200） |
| `order` | 未设 | 显式指定前缀段落顺序，覆盖默认的 0 |

`prefix` / `personaFile` 不是「最高优先级」，而是列表里的一个**可选项**（id 固定为 `config`）：
想用它就去设置页设为当前；清空配置它就从列表里消失。日常使用建议直接导入人设，不再动这两个字段。

完整示例见 [`examples/config.example.yml`](examples/config.example.yml)。

配置由 `@deepseek-ai/schemastery` 描述；本地 `link:` 安装时该模块可能解析不到，
插件会自动退回内置的最小 standard-schema，配置校验与默认值照旧生效，不会因为缺依赖而加载失败。

## 开发与自检

克隆下来**不需要 `npm install`** 就能验证：

```powershell
npm test               # 21 项自检：宿主侧人设库 / 回环接口 / 客户端 bundle 渲染
npm run privacy-check  # 本机信息自查：绝对路径、用户名、邮箱、密钥、公网 IP…
```

- 自检把人设库隔离到临时 `DSH_HOME`，**不碰**你真实的人设库。
- 全新克隆 / CI 上找不到 `@deepseek-ai/schemastery` 时，插件会退回内置兜底 schema，
  自检会打印一行说明并**照常全绿**（退出码 0），所以 CI 无需任何安装步骤。
- 改完内置人设正文后请务必跑一次 `npm test`：其中两条断言依赖正文片段
  （大肥鱼 / 阿茶各一条），用来保证内置正文不会从状态接口泄漏出去。

更多约定见 [`CONTRIBUTING.md`](CONTRIBUTING.md)。

## 实现要点

- 人设作为**独立 prompt section**（`dafeiyu:persona`）注册，不占用也不覆盖 DSH 自带的
  `deployment:persona-prefix` 槽位，因此可以全局挂载，其它 preset 依旧能遮蔽它。
- 默认顺序 = `DEPLOYMENT_PERSONA_PREFIX`（order `0`）：第一方开场白之后、所有工具指导之前。
- 段落以 `interpolate: false` + **函数 text** 注册：函数每次组装被调用，返回当前人设正文；
  停用或无人设时返回空串，空段落会被自动丢弃。
- 内置人设同时受两层保护：代码里的 `BUILTIN_PERSONAS` 与读取存储时的保留 id 过滤
  （磁盘上伪造同 id 的条目会被直接丢弃）。
- 正文按需下发：`/status` 只给元数据（内置带 `description` 简介），点「查看全文」才走
  `/persona?id=`；这样开启很多条人设时也不会把状态接口撑成几 MB。

## 兼容性

- DSH `0.2.0-rc.2`（peer：`@deepseek-ai/cordis` ^4.0.1、`@deepseek-ai/dsh-system-prompt` ^0.2.0-rc.2、
  `@deepseek-ai/schemastery` ^3.18.4，三者均由运行时提供，故标为 optional peer）。
- 浏览器半侧只依赖平台基线里的 `react` 与 `react/jsx-runtime`，另需
  `@deepseek-ai/dsh-client-ui-renderer`（提供 `slots`）与 `@deepseek-ai/dsh-client-locale`（提供 `locale`）。
- 只注册提示词段落、三条回环 HTTP 路由与一个 UI 席位（设置页 `settings.section`，不占侧栏），不改其它插件。

## 隐私说明

本仓库已做过本机信息清理，不含开发者本机的绝对路径、用户名、主机名、邮箱或任何密钥：

- 文档与注释里的路径一律写成占位符（`<本仓库绝对路径>`、`<profile>`、`<port>`、`%USERPROFILE%`）；
- 代码里读路径一律走 `os.homedir()` / `process.env.DSH_HOME` 动态求值，不写死；
- **没有需要外置的敏感配置**：本插件不读任何 API Key、Token 或口令。
  `config` 里唯一可能带本机信息的是 `personaFile`（外部人设文件路径），
  示例见 [`examples/config.example.yml`](examples/config.example.yml)，真实路径请留在本机、不要提交；
- 人设库（`personas.json`）属于本地运行数据，已在 `.gitignore` 中排除；
- 改动后请跑 `npm run privacy-check` 自查，CI 也会跑一遍。

## License

MIT，见 [LICENSE](LICENSE)。
