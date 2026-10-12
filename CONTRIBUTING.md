# 贡献指南

## 环境要求

- Node.js ≥ 20（见 `package.json` 的 `engines`）。
- **不需要 `npm install`**：本包没有运行时依赖，`package.json` 里的
  `@deepseek-ai/*` 全是 `optional` peer，由 DSH 运行时提供。
  全新克隆下来直接就能跑自检。

## 动手之前先跑一遍

```powershell
npm test                    # 自检
npm run privacy-check       # 本机信息自查
npm run privacy-self-test   # 自查脚本的身份规则自检
```

三条都必须绿。自检把人设库隔离到临时 `DSH_HOME`，**不会碰**你真实的人设库。

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
3. **改内置人设正文后必须重跑自检**：有一组断言会给**每条**内置人设取一段正文指纹，
   用来保证内置正文不会从状态接口泄漏出去。这些断言遍历 `BUILTIN_PERSONAS`，
   新增条目时不用手改；但**新增内置人设必须同时补** `lib/client.js` 里的
   `BUILTIN_LOCALE_SUFFIX` 映射与 zh / en 两份名字、简介词条，否则自检会直接报出来。
4. **接口只服务回环**：三条 HTTP 路由都必须先过 `isLoopbackRequest()`，
   非回环返回 403。新增路由请照抄这个模式。
5. **界面不展示内置人设正文**：内置只给 `description` 简介；
   自导入 / config 人设才提供「查看全文」，且正文按需拉取，不随 `/status` 批量下发。
6. **界面文案一律走 locale 字典**：不要在 JSX 里写死用户可见的中文或英文，
   也不要写死全角标点（中英标点习惯不同，用 `labelSeparator` 这类键区分）。
   新增文案要同时补 `zh` 与 `en` 两份，自检会检查两份键是否对齐、
   以及 `en` 的值里有没有夹中文。
7. **改 `privacy-check.mjs` 的身份规则时要跑 `npm run privacy-self-test`**：
   本机用户名在容器 / CI 里常是 `root`、`user` 这类通用词，裸词搜索会把
   `const root = …` 这种普通标识符报成泄漏、把 CI 打红。自检把「该报 / 不该报」
   两类都钉住了，改动后别让它变红。
   另外**该脚本会被它自己扫描一遍**，所以文件里（含注释和自检用例文本）
   **不要写完整的家目录路径字面量、或带盘符的真实路径字样** —— 用字符串拼接，
   注释里用「盘符:\Users\<名字>」这类占位写法。
8. **改 `privacy-check.mjs` 后还要跑一次 `npm run privacy-check` 确认它是 PASS**：
   脚本改动很容易不小心写进一条会被自己命中的样例。

## 提交与 PR

- 提交信息用一句话说清「改了什么、为什么」，中英文都行，别只写 "update"。
- PR 描述里请附上 `npm test` 与 `npm run privacy-check` 的输出结论。
- 新增行为请补 `test/verify.mjs` 里的对应用例；新增规则请补进自检的 `check(...)` 列表。
