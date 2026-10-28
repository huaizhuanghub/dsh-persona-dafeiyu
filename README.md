# dsh-persona-dafeiyu · 人设库插件

启用后，系统提示词里会注入**当前选中的人设** —— 全局、按工作区或按会话，都不用每次手动粘贴。

[![ci](https://github.com/huaizhuanghub/dsh-persona-dafeiyu/actions/workflows/ci.yml/badge.svg)](https://github.com/huaizhuanghub/dsh-persona-dafeiyu/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/dsh-persona-dafeiyu.svg)](https://www.npmjs.com/package/dsh-persona-dafeiyu)
[![license](https://img.shields.io/npm/l/dsh-persona-dafeiyu.svg)](./LICENSE)
[![dsh.so risk](https://www.dsh.so/badge/dsh-persona-dafeiyu.svg)](https://www.dsh.so/zh/artifact/dsh-persona-dafeiyu/)
[![listed on dsh-plugin.org](https://dsh-plugin.org/badges/listed.svg)](https://dsh-plugin.org/plugins/huaizhuanghub/dsh-persona-dafeiyu)

- **内置人设**：大肥鱼、阿茶、听澜（写死在代码里，不可删除、不可覆盖；**正文可以展开查看**）。
- **导入人设**：在设置页里用文件导入或直接粘贴文本，自动生成可选条目。
- **导出人设**：自导入 / config 人设可一键存成 `.md`——格式与「导入」一致，导出的文件能原样再导入回来。
- **设置页「人设」小节**：查看当前人设、切换、启用 / 停用、重命名、删除、导入、导出。
- **中英双语界面**：设置页与输入框小条跟随 DSH 的界面语言切换（`zh` / `en`）；
  内置人设的名字与简介按当前语言显示，用户自己导入的人设名照原样显示。
- **免重启切换**：人设段落的 `text` 是动态函数，提示词每次组装都会重新求值，
  所以切换后**下一个请求**就用新文本，无需重启、无需重新加载插件。
- **正文按需下发**：状态接口只给元数据（内置人设额外带一句简介），点「查看全文」才拉那一条的正文。
- **全局 / 工作区 / 会话三档生效范围**：整个 profile 共用一个、按项目目录各用一个、
  或只给当前会话单独挑一条；越细越优先，且三档可以叠着用。
- **新会话开场就能挑人设**：还没发第一条消息的起始页上有一个 `🐟 人设` chip，
  选完立刻对这条会话生效，不用先去设置页改全局。

## 目录结构

```text
dsh-persona-dafeiyu/
├─ package.json                 dsh.bundle.patch / dsh.client 声明 + peer 依赖
├─ cordis.patch.yml             组合包 patch：把本插件的行插进 profile
├─ lib/
│  ├─ index.js                  宿主半侧：人设库 + 动态提示词段落 + 三档生效范围 + 三条回环接口
│  └─ client.js                 浏览器半侧：设置页「大肥鱼」小节 + 输入框小条 + 居中选择浮层 + 新会话起始页 chip
├─ test/verify.mjs              不依赖 DSH 运行时的自检（跑一遍会打印项数）
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
- DSH —— 已实测的版本见文末「[兼容性](#兼容性)」

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
| 生效范围 | 三档开关：**全局 / 工作区 / 会话**（越细越优先，见下一节） |
| 工作区生效规则 | 列出已知的工作目录，每个目录一个下拉框挑人设，默认「跟随全局」；在某个项目里发过消息后，该目录就会出现 |
| 人设列表 | 每条显示**名称 + 来源徽标 + 字数**；可「设为当前」「启用 / 停用」；导入的还可以「重命名」「删除」（删除需二次确认） |
| 内置人设 | 大肥鱼、阿茶、听澜：**只读**——没有删除 / 重命名按钮，列表里标注「内置人设不可删除或重命名」；**正文可以展开查看** |
| 自导入人设 | 每条都有「**查看全文**」：按需拉取并展开**完整提示词**（含换行），再点收起；另有「导出」把正文存成 `.md` |
| 人设广场 | 导入区上方一行入口：**想寻找更多个性化人设？去「人设广场」看看吧！** 点击在新标签页打开第三方站点 |
| 导入人设 | 选 `.md` / `.markdown` / `.txt` 文件（自动填入正文与名称），或直接把提示词粘贴到文本框，点「导入」 |

### 人设广场（外部链接）

内置人设只有大肥鱼、阿茶、听澜三条。想找更多风格的人设，可以去
[人设广场](https://kondius.cn/qq-agent/persona-plaza/index.html)——设置页「导入人设」上方有入口。

- 它是**第三方站点**（社区分享的人设与系统提示词），不是本项目的一部分，
  内容与可用性由对方维护；本插件不对其内容负责。
- 插件**不会**访问它：链接写死在 `lib/client.js` 的 `PLAZA_URL`，只有你主动点击才会跳转，
  没有任何后台请求或埋点。
- 用 `target="_blank"` + `rel="noopener noreferrer"` 打开：新标签页打开、且对方页面拿不到
  本页的 `window.opener`。
- 从广场拿到的人设，用上面的「导入人设」粘进来即可，全程走同一个流程。

正文展示的分工：

- **正文一律按需拉取**：`/status` 只给元数据，点「查看全文」才走 `/persona?id=` 取那一条的正文，
  内置 / 自导入 / config 一视同仁。开启很多条人设时状态接口也不会被撑成几 MB。
- **内置人设额外带一句简介**：它们是插件自带的那几条，列表里直接说明是什么性格；
  正文同样可以展开查看，但**只读**（不可删除、不可覆盖），也**不提供导出**——
  想改就先自己导入一份。

规则说明：

- 「设为当前」会**自动启用**该人设（停用状态下点它就会恢复注入）。
- 停用**当前**人设 → 系统提示词里不注入任何人设段落（状态显示「当前人设已被停用」）。
- 停用**非当前**人设只影响它自己，当前人设照旧。
- 删除当前人设会**回落到大肥鱼**。
- 人设名不能为空、不能超过 60 字符、不能与其他人设重名。
- 人设正文不能为空、上限 64,000 字符。

导入用的文件长什么样，见 [`examples/persona.example.md`](examples/persona.example.md)。

## 生效范围：全局 / 工作区 / 会话

人设可以**整个 profile 共用一个**、**按项目目录各用一个**，或**只给当前会话挑一条**。
三档**不是互斥开关**，而是越细越优先的阶梯：

```
会话档：会话选择 → 工作区选择 → 全局当前
工作区档：        工作区选择 → 全局当前
全局档：                        全局当前
```

好处：可以先给项目配好工作区人设，再按会话临时覆盖；清掉会话选择时自动落回工作区。

### 让「全局」这一档彻底不启用人设

```
当前生效
  人设        不启用
  状态        全局人设已关闭，系统提示词里不注入全局人设（工作区 / 会话档仍然生效）。
  [ 恢复全局人设 ]
```

典型场景：一个 profile 同时挂着 IM 机器人，只想让机器人那个工作区用人设，
其它会话（`$HOME`）**完全不要人设**。这就是「全局不启用 + 某一档启用」。

三档阶梯里，前三行都是「优先用更细的」，最后才落到「全局当前」；所以只要把**全局当前**关掉，
没被工作区 / 会话挑中的会话就真的什么都不注入：

```
会话档：会话选择 → 工作区选择 → 全局当前（已关 = 无人设）
工作区档：        工作区选择 → 全局当前（已关 = 无人设）
全局档：                        全局当前（已关 = 无人设）
```

- 开关在设置页「当前生效」卡片下方：`不启用全局人设` / `恢复全局人设`。
- 关闭后状态行会明说「全局人设已关闭」，而不是显示一个可疑的「—」。
- 代价是：**全局档下等于整个人设功能关掉了**，只剩工作区 / 会话两档能挑。
- 以前唯一的绕法是「造一条占位人设再把它停用」，靠启停判断把注入变成空串；
  能用，但设置页会显示「当前人设：无（全局默认）· 已停用」，语义别扭，
  而且用户一点「设为当前」就会静默把全局人设打开。

> **与「停用某条人设」的区别**：停用是「这条不要」，`disabled` 里记着它，
> 全局当前仍然指着它（重新启用就自动恢复）；关闭全局是「这一层不要」，
> 全局当前变成 `null`，跟具体是哪条人设无关。

### 新会话起始页的人设 chip

```
🐟 大肥鱼 ▾     ← 开场先挑人设：输入框上面那一行，跟「工作目录」并排
```

以前只能在**会话开始之后**从输入框上方的小条换人设；想换个开场人设就得跑去设置页改全局，
改完还会影响所有会话。现在新建会话那一屏（还没发第一条消息的空会话）就有一个 `🐟 人设` chip：

- 点开是**同一个居中选择浮层**，列出人设库里启用的人设，第一项是「此会话不启用人设」。
- 选完**立刻对这条会话生效**，从这条消息起就用它；不需要先发一句话，也不动全局设置。
- 如果当时生效范围还停在「全局」/「工作区」，选择时会**顺手拔到「会话」档**——
  否则会话级选择会被阶梯直接忽略，用户点了会像没反应一样。其它会话仍按原档位解析，不受影响。
- 读不到宿主、或插件被 `enabled: false` 停用时，这块**整块不渲染**，开场那一屏不会多出错误提示。

> 这个入口挂在 DSH 的 `conversation.hero.options` 插槽上（hero 行右侧的选项区）。
> 该插槽是 0.2.1-rc.3 起提供的；更老的宿主没有它，`slots.inject` 不会回调，
> 插件其余部分照常工作，只是不显示这个 chip。

### 输入框上方的小条（全局 / 会话）

```
🐟 大肥鱼        [全局] [会话]          ← 全局：所有会话都用「当前」那条
🐟 阿茶 ▾        [全局] [会话]          ← 会话：显示本会话的人设，点名字弹出选择浮层
🐟 阿茶 · 工作区  [全局] [会话]          ← 工作区档：只显示状态，规则在设置页里配
```

- 会话档下点人设名 → 弹出**屏幕正中的选择浮层**（注册在 DSH 的 `shell.overlay` 插槽）。
  人设再多也只是浮层里滚动，**不会把输入框旁边堆满**；选完自动关闭，点遮罩空白处也能关。
- 浮层第一项固定是**「此会话不启用人设（不回落到全局）」**。会话档里不再提供
  「跟随全局 / 跟随工作区」——那是「清除选择」，会继续往下回落并注入；而这个位置要表达的是
  「本会话谁都别注入」。两者语义相反，混在一个按钮里只会让人点错。
  选中它时小条会显示「此会话不启用人设」，而不是继续显示全局人设名。
- 工作区档下小条**不提供按钮**——按目录逐条挑人设那件事在设置页里做。
- 点 `[全局]` / `[会话]` 永远是切换生效范围本身，工作区档也能一键跳出。

### 设置页里的工作区规则

```
生效范围   [全局] [工作区] [会话]

工作区生效规则
  <项目目录>\backend     [阿茶      ▾]
  <项目目录>\frontend    [跟随全局  ▾]
```

- 清单 = **人设库里已经挑过的目录** ∪ **本次进程里见过的目录**。
  宿主在每次组装提示词时从会话上下文里收集 cwd，所以**一个目录要先在那里发过一条消息**才会出现。
- 每一行一个下拉框：选任意一条人设，或「跟随全局」。

### 通用规则

- 选项**全部来自设置页已导入的人设库**——这个功能不会为会话 / 工作区新建人设。
- 挑中的那条若被**停用**，自动往下一层回落。
- **「本会话不启用人设」是终止符**，不是「没选」：命中它就彻底不注入，**不再**往工作区 /
  全局回落。它是会话档独有的第三态，用 `none: true` 提交，内部存成一个哨兵值。
  与「清除选择」（`personaId: null`）是两件事——后者会继续往下回落并注入。
- **会话选择只活在进程内存里**（DSH 重启即回落到工作区 / 全局），符合会话本身的临时性；
  **工作区选择与人设库一起持久化**；「选哪一档」这个范围本身也是持久化的（三档都能存住）。
- **回落是临时的**：某条人设被停用 / 删掉时，解析会暂时回落到内置默认，但**不会改写**
  `current`。重新启用后自动恢复，不需要再点一次「设为当前」。
  （曾经这里会顺手改写——等于在设置页点一次「刷新」就把用户的停用选择永久抹掉了。）

对应接口：`set-mode`（`global` / `workspace` / `session`）、`set-workspace-persona`
（`cwd` + `personaId`）、`set-session-persona`（`sessionId` + `personaId`；
`personaId: null` 表示清除、`none: true` 表示本会话不启用）、`set-current`
（`id: null` 表示**关闭全局人设**）；`GET /status?sessionId=<id>&cwd=<path>` 会额外返回
该会话 / 该工作区的视角，以及**最终生效的是哪一条**（`effective`）、
「全局是否被关掉」（`globalOff`）与「本会话是否被设为不启用」（`sessionOff`）。

## 人设库与接口

- 持久化位置：`<DSH_HOME>/storages/dsh-persona-dafeiyu/personas.json`。
  `DSH_HOME` 没设时退回 DSH 家目录（Windows 上是 `%USERPROFILE%\.dsh\`，类 Unix 上是 `~/.dsh/`），
  代码里走 `os.homedir()` 动态求值、不写死任何绝对路径。
  写入采用「临时文件 + 改名」，文件损坏时回退到空库而不会让插件挂掉。
- 接口（都只接受回环请求）：

  | 方法 | 路径 | 作用 |
  |---|---|---|
  | `GET` | `/api/dsh-persona-dafeiyu/status` | 当前状态 + 人设列表（**只有元数据，不含正文**）+ 存储路径；带 `?sessionId=&cwd=` 时另给会话 / 工作区视角与 `effective` |
  | `GET` | `/api/dsh-persona-dafeiyu/persona?id=<id>` | 按需取**单条**人设的完整正文（「查看全文」用；内置 / 导入 / config 都走这里） |
  | `POST` | `/api/dsh-persona-dafeiyu/mutate` | `set-current` / `import` / `rename` / `remove` / `set-enabled` / `set-mode` / `set-workspace-persona` / `set-session-persona` |

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
npm test                     # 自检：宿主侧人设库 / 生效范围 / 回环接口 / 客户端 bundle 渲染
npm run privacy-check        # 本机信息自查：绝对路径、用户名、邮箱、密钥、公网 IP…
npm run privacy-self-test    # 自查脚本自己的自检：身份规则该报的报、不该报的不报
```

- 自检把人设库隔离到临时 `DSH_HOME`，**不碰**你真实的人设库。
- 全新克隆 / CI 上找不到 `@deepseek-ai/schemastery` 时，插件会退回内置兜底 schema，
  自检会打印一行说明并**照常全绿**（退出码 0），所以 CI 无需任何安装步骤。
- 改完内置人设正文后请务必跑一次 `npm test`：其中一组断言会给**每条**内置人设
  取一段正文指纹，用来保证内置正文不会从状态接口泄漏出去。
  新增内置人设时**不用手改这些断言**——它们是遍历 `BUILTIN_PERSONAS` 的，
  但你必须同时补上 `lib/client.js` 里对应的中英词条，否则自检会直接报出来。

### 本机用户名是通用词时（`root` / `user` / `test` …）

`privacy-check` 会用「本机用户名」做一次**大小写不敏感的裸词搜索**，而容器、VPS、
CI 里的用户名常常就是 `root` 这类普通英文单词 —— 那会把 `const root = path.resolve(…)`
这种正常代码报成「本机用户名泄漏」，退出码 1 把 CI 打红，还给出**改不对**的建议。

所以身份规则分两层：

- **够独特的名字**（带数字 / 下划线，或够长的少见串）→ 照旧裸词全仓库搜索；
- **通用词** → 跳过裸词，只保留**路径形态**匹配（用户目录路径里出现才报）。
  这时报告开头会有一行提示说明「少了一层、以及为什么」，**不会悄悄降级**。

想验证这套判定是否符合预期，跑 `npm run privacy-self-test`（11 项，不起子进程、不读磁盘）。

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
- 「当前该注入谁」由**一个** `resolvePersona()` 解析（会话 → 工作区 → 全局的阶梯）；
  提示词注入与状态接口的 `effective` 都调用它，所以界面显示与实际注入不会漂移。
- 会话人设选择器注册在 `shell.overlay`（整帧浮层插槽），用 `position: fixed` 居中；
  **不往 `document.body` 追加 DOM**。小条、起始页 chip 与浮层是三个独立插槽组件，
  用一个极简 store 联动（chip 只负责「带上 sessionId / cwd 打开」，浮层负责渲染与提交）。
- 新会话起始页的 chip 注册在 `conversation.hero.options`，只在 hero 阶段（还没发第一条消息）
  由宿主渲染；它与输入框小条共享同一套状态接口，所以两处显示的人设名永远一致。

## 界面语言（中 / 英）

界面文案走 DSH 的 locale 服务，字典命名空间是 `personaDafeiyu`，注册 `zh` 与 `en` 两份。

- **语言跟随 DSH**：在「设置 → 通用」里切换界面语言，本插件的设置页与输入框小条一起变，
  不需要重启或刷新插件。字典在挂载后注册也会被认到。
- **内置人设的名字与简介**：宿主侧只有中文原文，界面按当前语言取插件字典里的词条
  （`personaNameDafeiyu` / `personaAboutTinglan` 这一类），所以英文界面显示 `Tinglan` 而不是「听澜」。
- **回退策略**：字典里查不到某条（例如第三方语言包只翻了一半），界面**回退到宿主给的原文**，
  而不是把键名（`personaAboutTinglan`）显示出来。
- **用户数据不翻译**：你导入的人设名按原样显示——中文名在英文界面上依旧是中文名。
- **标点也随语言**：「简介」这类「标签 + 值」的行用字典里的 `labelSeparator`：
  中文是全角冒号 `：`，英文是 `: `。
- **新增内置人设时**：`lib/index.js` 的 `BUILTIN_PERSONAS`、`lib/client.js` 的
  `BUILTIN_LOCALE_SUFFIX` 与 zh / en 两份词条要一起补，自检会强制检查。

## 兼容性

### 已实测的 DSH 版本

| DSH 版本 | 状态 |
|---|---|
| `0.2.0-rc.2` | ✅ compatible（开发与自检都在这一版） |
| `0.2.1-alpha.4` | ✅ compatible |
| `0.2.1-rc.2` | ✅ compatible |
| `0.2.1-rc.3` | ✅ compatible（起始页 chip 的 `conversation.hero.options` 就是这一版引入的） |

> 起始页 chip 依赖的 `conversation.hero.options` 插槽从 `0.2.1-rc.3` 起才有。
> 更老的宿主没有它，`slots.inject` 不会回调，chip 不显示，其余功能不受影响。

同一份清单也声明在 `package.json` 的 `dsh.compatibility.dshReleases` 里，供插件目录读取。
**没列出的版本 = 没实测过**，不是"已知不兼容"——想确认可以自己跑 `npm test`。

### 依赖与席位

- peer：`@deepseek-ai/cordis` ^4.0.1、`@deepseek-ai/dsh-system-prompt` ^0.2.0-rc.2、
  `@deepseek-ai/schemastery` ^3.18.4，三者均由运行时提供，故标为 optional peer。
- 浏览器半侧只依赖平台基线里的 `react` 与 `react/jsx-runtime`，另需
  `@deepseek-ai/dsh-client-ui-renderer`（提供 `slots`）与 `@deepseek-ai/dsh-client-locale`（提供 `locale`）。
- 总共注册：一个提示词段落（+ 可选 suffix 段落）、三条回环 HTTP 路由、
  **四个 UI 席位**——设置页 `settings.section`、输入框上方 `conversation.composer.dock`、
  浮层 `shell.overlay`（会话人设选择器）、新会话起始页 `conversation.hero.options`（开场人设 chip）。
  不占侧栏，不改其它插件。

## 隐私说明

本仓库已做过本机信息清理，不含开发者本机的绝对路径、用户名、主机名、邮箱或任何密钥：

- 文档与注释里的路径一律写成占位符（`<本仓库绝对路径>`、`<profile>`、`<port>`、`%USERPROFILE%`）；
- 代码里读路径一律走 `os.homedir()` / `process.env.DSH_HOME` 动态求值，不写死；
- **没有需要外置的敏感配置**：本插件不读任何 API Key、Token 或口令。
  `config` 里唯一可能带本机信息的是 `personaFile`（外部人设文件路径），
  示例见 [`examples/config.example.yml`](examples/config.example.yml)，真实路径请留在本机、不要提交；
- 人设库（`personas.json`）属于本地运行数据，已在 `.gitignore` 中排除；
- **唯一的外部地址**是设置页里的「人设广场」链接
  （`https://kondius.cn/qq-agent/persona-plaza/index.html`）。它只是一个 `<a href>`：
  插件不向该域名发任何请求、不加载任何外部资源、不放埋点；只有你点击才会跳转，
  且以 `noopener noreferrer` 在新标签页打开。
- 改动后请跑 `npm run privacy-check` 自查，CI 也会跑一遍。

## License

MIT，见 [LICENSE](LICENSE)。
