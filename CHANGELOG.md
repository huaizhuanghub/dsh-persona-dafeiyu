# 更新日志

本文件记录本插件的所有重要变更。格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本号遵循[语义化版本](https://semver.org/lang/zh-CN/)。

> **0.x 阶段不承诺向后兼容**：次版本号（`0.x`.0）可能包含破坏性变更，升级前请先读本文件。

## [0.3.0] - 2026-10-07

### 新增

- **全局 / 会话两种生效范围**：人设可以整个 profile 共用一个，也可以**为当前会话单独挑一条**。
  切换在**输入框上方**的小条（`conversation.composer.dock`）上，不用进设置页。
- 新增两个操作：`set-mode`（`global` / `session`）与 `set-session-persona`
  （`sessionId` + `personaId`，`personaId: null` 表示清除）。
- `GET /status?sessionId=<id>` 会额外返回**该会话的视角**，供输入框上方的小条显示本会话当前用的是哪条。

### 变更

- 会话切换器默认**折叠在人设名之后**（点名字才展开），选完或切换范围时自动收起，不再常驻占位。
- 自检从 21 项扩到 26 项，覆盖会话范围、小条折叠分支与状态接口的会话视角。

### 说明

- **会话选择只活在当前进程里**：DSH 重启后回到「跟随全局」；
  而「全局 / 会话」这个**范围本身是持久化**的，重启后仍然生效。
- 选项**全部来自设置页已导入的人设库**——此功能不会为某个会话新建人设；
  想加一条请先在设置里导入。挑中的那条若被停用，本会话自动回落到全局。
- `0.2.2` 曾在本仓库里 bump 过版本号（提交 `0de547d`），但**从未发布到 npm**，
  其内容已并入本版本。npm 上没有 `0.2.2`，也没有撤回记录。

## [0.2.1] - 2026-10-07

### 变更

- README 改以 **npm 安装为推荐路径**（方式 A），源码目录安装降为「改代码时用」的方式 B。
- 顶部补上 npm 版本徽章与 license 徽章。
- 新增「怎么让别人用上这个插件」一节：说明 DSH **没有第三方插件目录**，
  第三方插件的分发方式就是发布到 npm、使用者按包名安装。

> 本版本**只改文档**：`lib/` 下的代码与 `0.2.0` 完全一致。

## [0.2.0] - 2026-10-07

首个可用版本。

### 新增

- **人设注入**：把选中的人设注册为独立 prompt section（`dafeiyu:persona`），
  以 `interpolate: false` + **函数式 `text`** 注册，每次组装提示词时重新求值 ——
  切换人设后**下一个请求**即生效，无需重启、无需重新加载插件。
- **内置人设**：大肥鱼、阿茶（写死在代码里，不可删除、不可覆盖；
  磁盘上伪造同 id 的条目会在读取时被直接丢弃）。
- **导入人设**：设置页支持从 `.md` / `.markdown` / `.txt` 文件导入（自动填入正文与名称），
  或直接把提示词粘贴到文本框。
- **设置页「大肥鱼」小节**：查看当前人设、切换、启用 / 停用、重命名、删除、导入。
- **正文按需下发**：`/status` 只返回元数据（内置人设带一句简介），
  点「查看全文」才走 `/persona?id=` 拉那一条的完整正文。
- **三条回环 HTTP 接口**：`/api/dsh-persona-dafeiyu/status`、`/persona`、`/mutate`；
  非回环访问返回 403、方法不对返回 405、请求体不是 JSON 返回 400。
- **可选 config**：`enabled` / `prefix` / `personaFile` / `suffix` / `order`。
- **持久化**：人设库落在 `<DSH_HOME>/storages/dsh-persona-dafeiyu/personas.json`，
  路径走 `os.homedir()` / `DSH_HOME` 动态求值、不写死；
  写入采用「临时文件 + 改名」，文件损坏时回退到空库而不是让插件挂掉。
- **自检**：不依赖 DSH 运行时的 21 项断言，全新克隆**无需 `npm install`** 即可跑通；
  另有 `privacy-check` 脚本做本机信息自查。

## [0.0.0-stage] - 2026-10-07

占位版本，仅为占住 npm 包名而发布，**不含任何功能代码**
（包内只有 `package.json` 与一行说明）。

---

每个版本在 GitHub 上都有对应的 [Release 与 tag](https://github.com/huaizhuanghub/dsh-persona-dafeiyu/releases)，
包页面见 [npm](https://www.npmjs.com/package/dsh-persona-dafeiyu)。

想只看两个版本之间改了什么，用仓库的 Compare 视图，把 tag 名填进去即可：

```text
https://github.com/huaizhuanghub/dsh-persona-dafeiyu/compare/<旧 tag>...<新 tag>
```
