# 贡献指南

## 环境要求

- Node.js ≥ 20（见 `package.json` 的 `engines`）。
- **不需要 `npm install`**：本包没有运行时依赖，`package.json` 里的
  `@deepseek-ai/*` 全是 `optional` peer，由 DSH 运行时提供。
  全新克隆下来直接就能跑自检。

## 动手之前先跑一遍

```powershell
npm test               # 21 项自检
npm run privacy-check  # 本机信息自查
```

两条都必须绿。自检把人设库隔离到临时 `DSH_HOME`，**不会碰**你真实的人设库。

## 目录分工

| 路径 | 作用 |
|---|---|
| `lib/index.js` | 宿主半侧：人设库（读 / 写 / 校验）、动态提示词段落、三条回环 HTTP 接口 |
| `lib/client.js` | 浏览器半侧：设置页「大肥鱼」小节的 bundle（手写，不经打包器） |
| `cordis.patch.yml` | 组合包 patch：把本插件的行插进 profile |
| `test/verify.mjs` | 自检：用假的宿主 ctx 与假的 React 跑通两侧逻辑，不需要装 DSH |
| `scripts/privacy-check.mjs` | 本机信息自查，CI 与推送前都跑 |

## 几条硬约定

1. **内置人设不可删改**：`BUILTIN_PERSONAS` 里的条目既不能删也不能覆盖，
   `readStore()` 还会丢掉磁盘上伪造的同 id 条目，这层保护有测试盯着，别绕开。
2. **不要往仓库里写本机信息**：绝对路径、用户名、主机名、邮箱、内网 IP、密钥一律不许出现。
   路径请走 `os.homedir()` / `process.env.DSH_HOME` 动态求值，文档里用 `<占位符>`。
   推之前跑 `npm run privacy-check`，CI 也会跑。
3. **改内置人设正文后必须重跑自检**：其中两条断言依赖正文片段
   （大肥鱼、阿茶各一条），用来保证内置正文不会从状态接口泄漏出去。
4. **接口只服务回环**：三条 HTTP 路由都必须先过 `isLoopbackRequest()`，
   非回环返回 403。新增路由请照抄这个模式。
5. **界面不展示内置人设正文**：内置只给 `description` 简介；
   自导入 / config 人设才提供「查看全文」，且正文按需拉取，不随 `/status` 批量下发。

## 提交与 PR

- 提交信息用一句话说清「改了什么、为什么」，中英文都行，别只写 "update"。
- PR 描述里请附上 `npm test` 与 `npm run privacy-check` 的输出结论。
- 新增行为请补 `test/verify.mjs` 里的对应用例；新增规则请补进自检的 `check(...)` 列表。
