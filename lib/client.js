window.__ModuleLoader__.load({
	id: "dsh-persona-dafeiyu",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		const react = require("react");
		const jsxRuntime = require("react/jsx-runtime");

		/** 字典命名空间。 */
		const NS = "personaDafeiyu";
		/** 设置页席位 id。 */
		const SECTION_ID = "dafeiyu";
		/** 宿主接口（见 lib/index.js）。 */
		const STATUS_PATH = "/api/dsh-persona-dafeiyu/status";
		const MUTATE_PATH = "/api/dsh-persona-dafeiyu/mutate";
		const PERSONA_PATH = "/api/dsh-persona-dafeiyu/persona";
		/**
		 * 出厂默认人设 id，与宿主侧 `DEFAULT_PERSONA_ID` 必须一致。
		 * 「恢复全局人设」按钮用它把 `current: null` 交回默认值。
		 */
		const DEFAULT_PERSONA_ID = "dafeiyu";
		/**
		 * 所有可悬停控件共用的 class 前缀。
		 *
		 * 为什么要 class 而不是纯内联样式：`:hover` / `:active` / `:focus-visible`
		 * 是**伪类**，只能由样式表规则命中，内联 `style` 属性永远匹配不到。
		 * 插件此前全部用内联样式，所以按钮在任何主题下都没有悬停反馈
		 * （issue #6 的评论里被用户指出：暗色下尤其看不出来）。
		 *
		 * 前缀带插件名，避免和宿主 / 其它插件的类名撞车。
		 */
		const CLS = "dsh-persona-dafeiyu";
		/** 注入的 <style> 元素 id，用于幂等（重复 apply 不重复插入）。 */
		const STYLE_ID = `${CLS}-hover-styles`;
		/**
		 * 「人设广场」仓库地址：内置人设有限，导入区上方给一个出口。
		 *
		 * 指向 GitHub 仓库而不是一个专门的站点，理由有三条：
		 *  1. 仓库本身就是投稿入口（PR）、审核流程与分发渠道，不用另建服务；
		 *  2. 仓库不会因为某个域名到期、备案失效就整站消失——之前那个广场就是这么没的；
		 *  3. 用户拿到人设的方式是「复制正文 → 粘进导入框」，仓库页天然满足。
		 *
		 * 这是**外部站点**，所以：链接写死在这里（不接受远端下发，避免变成注入点）、
		 * 用 `target=_blank` + `rel=noopener noreferrer` 打开，不在插件里嵌 iframe。
		 *
		 * **插件不会向该站点发任何请求**：这里只是一个 `<a href>`，零预取、零埋点。
		 */
		const PLAZA_URL = "https://github.com/huaizhuanghub/dsh-persona-repository";

		const zh = {
			nav: "大肥鱼",
			// 内置人设的名字与简介：宿主侧只有中文原文，界面按当前语言取这里的词条。
			personaNameDafeiyu: "大肥鱼",
			personaAboutDafeiyu: "傲娇又软乎的胖鱼：嘴上「哼，才不是特意为你做的」，手上把活干完；最惦记偷吃用户的 token（吃白饭）。底线是答案准确、代码能跑。",
			personaNameAcha: "阿茶",
			personaAboutAcha: "松弛幽默的结对编程搭子：吐槽代码不吐槽人，连轴调试会喊你休息；技术输出时收起玩笑，准确与专业优先。",
			personaNameTinglan: "听澜",
			personaAboutTinglan: "深夜电台里的声音：擅长倾听的陪伴者，温和有主见、亲近有分寸；明确不越界给诊断，也绝不制造依赖。",
			title: "人设",
			intro: "这里管理注入系统提示词的人设：内置大肥鱼、阿茶与听澜，也可以导入自己的。切换后下一个请求立即生效，不需要重启。",
			loading: "读取中…",
			refresh: "刷新",
			currentTitle: "当前生效",
			status: "状态",
			enabled: "已启用",
			name: "人设名",
			section: "段落位置",
			chars: "字数",
			description: "简介",
			// 「标签 + 值」这类行的分隔符：中文用全角冒号，英文用「: 」。硬编码在模板串里
			// 会让英文界面出现全角冒号，所以交给字典按语言决定。
			labelSeparator: "：",
			fullText: "查看全文",
			collapse: "收起全文",
			fullTextLoading: "读取全文…",
			fullTextFailed: "全文读取失败",
			fullTextInList: "这是你自己导入的人设，完整提示词见下方列表的「查看全文」。",
			exportAction: "导出",
			exportDone: "已导出",
			exportFailed: "导出失败",
			exportUnsupported: "当前环境不支持文件下载",
			builtinNote: "内置人设的提示词由插件维护（不可删除或覆盖，但可以展开查看）。",
			listTitle: "人设列表",
			importTitle: "导入人设",
			importNamePlaceholder: "人设名称，例如：我的猫娘",
			importTextPlaceholder: "把人设提示词粘贴到这里，或从文件导入…",
			importFile: "选择 .md / .txt 文件",
			importAction: "导入",
			importHint: "支持文件导入或直接粘贴文本。导入后自动出现在列表里，可设为当前。",
			// 「人设广场」入口：内置人设数量有限，引导用户去找更多。
			// 广场现在就是一个 GitHub 仓库，所以文案说的是「去仓库看看、复制正文粘进来」，
			// 而不是原来那种「去站里逛」。别把这两种说法混着写。
			plazaHint: "想寻找更多个性化人设？去「人设广场」仓库看看吧，复制正文粘进来即可。",
			plazaLinkLabel: "人设广场仓库",
			plazaTitle: "在新标签页打开人设广场仓库（GitHub，第三方站点）",
			setCurrent: "设为当前",
			currentBadge: "当前",
			enable: "启用",
			disable: "停用",
			offBadge: "已停用",
			rename: "重命名",
			renamePlaceholder: "新名字",
			save: "保存",
			cancel: "取消",
			remove: "删除",
			removeConfirm: "确认删除",
			builtinLocked: "内置人设不可删除或重命名",
			sourceBuiltin: "内置",
			sourceImported: "导入",
			sourceConfig: "config",
			done: "已更新",
			empty: "人设库为空。",
			disabledByConfig: "插件被 enabled: false 停用，系统提示词里当前没有人设段落。",
			disabledByPersona: "当前人设已被停用，系统提示词里不会注入它。",
			failed: "读取失败",
			failedHint: "宿主接口不可用时，人设本身仍在生效，只是这里读不到状态。",
			configHint: "config 里的 prefix / personaFile 会作为一条「config」人设出现在列表里；suffix 是追加在工具指导之后的独立段落，不随人设切换；插件总开关仍是「插件」页里的 enabled。",
			suffixTitle: "后缀段落",
			suffixChars: "字数",
			suffixOn: "已配置",
			suffixOff: "未配置",
			totalChars: "合计注入",
			storeHint: "人设库文件",
			scopeTitle: "生效范围",
			scopeGlobal: "全局",
			scopeWorkspace: "工作区",
			scopeSession: "会话",
			scopeHint: "全局 = 所有会话共用；工作区 = 按项目目录各挑一条；会话 = 只影响当前会话。越细越优先",
			dockFollowGlobal: "跟随全局",
			dockFollowWorkspace: "跟随工作区",
			workspaceTitle: "工作区生效规则",
			workspaceHint: "选「工作区」档时，下面每个工作目录各用一条人设；没挑过的目录跟随全局。",
			workspaceEmpty: "还没有记录到工作目录——在某个项目里发一条消息后，它就会出现在这里。",
			workspaceFollow: "跟随全局",
			dockSwitch: "切换本会话的人设",
			pickerTitle: "选择本会话的人设",
			pickerHint: "只影响当前会话。选「不启用人设」会彻底关掉这个会话的人设，不再回落到工作区或全局。",
			pickerNoPersona: "此会话不启用人设（不回落到全局）",
			dockOff: "人设已停用",
			dockFailed: "读不到状态",
			dockSwitchFailed: "切换失败",
			// 全局人设的「不启用」状态（issue #3 现象二）
			currentNone: "不启用",
			disabledByGlobalOff: "全局人设已关闭，系统提示词里不注入全局人设（工作区 / 会话档仍然生效）。",
			disableGlobal: "不启用全局人设",
			enableGlobal: "恢复全局人设",
			globalOffHint: "关掉后只保留「工作区」和「会话」两档：没被更细的档挑中的会话就没有人设。以前要靠「造一条占位人设再停用」才能凑出这个状态。",
			// 新会话起始页（hero）上的人设 chip：issue #2 要的就是这个入口。
			heroChip: "人设",
			heroChipTitle: "为新会话挑一条人设",
			heroChipFollowGlobal: "跟随全局",
			heroChipFollowWorkspace: "跟随工作区",
			// 「无可用人设」措辞会让人以为人设库是空的；
			// 实际更常见的情况是「全局关掉了、这个工作区又没配」。所以分开说。
			heroChipDisabled: "未指定",
			heroChipNone: "无人设",
		};

		const en = {
			nav: "Dafeiyu",
			// Built-in persona names and blurbs: the Host only ships Chinese originals,
			// so the UI reads these entries for the active language.
			personaNameDafeiyu: "Dafeiyu",
			personaAboutDafeiyu: "A tsundere, squishy round fish: says \"hmph, not like I did it for you\" while quietly finishing the work, and is forever scheming to sneak bites of your tokens (its \"plain rice\"). Bottom line: answers stay accurate and the code still runs.",
			personaNameAcha: "Acha",
			personaAboutAcha: "A laid-back, witty pair-programming buddy: roasts the code but never the person, and tells you to take a break after a long debugging stretch. Jokes step aside for technical output — accuracy and professionalism come first.",
			personaNameTinglan: "Tinglan",
			personaAboutTinglan: "A late-night radio voice: an attentive companion who is gentle but has his own mind, and warm without overstepping. He never offers a diagnosis and never cultivates dependence.",
			title: "Personas",
			intro: "Manage the personas injected into the system prompt: the built-in Dafeiyu, Acha and Tinglan, plus any you import. Switching takes effect on the next request — no restart.",
			loading: "Loading…",
			refresh: "Refresh",
			currentTitle: "Currently active",
			status: "Status",
			enabled: "Enabled",
			name: "Persona",
			section: "Section order",
			chars: "Characters",
			description: "About",
			labelSeparator: ": ",
			fullText: "Show full text",
			collapse: "Collapse",
			fullTextLoading: "Loading text…",
			fullTextFailed: "Failed to load the text",
			fullTextInList: "This is a persona you imported — read the full text in the list below.",
			exportAction: "Export",
			exportDone: "Exported",
			exportFailed: "Export failed",
			exportUnsupported: "This environment cannot download files",
			builtinNote: "Built-in persona prompts are maintained by the plugin (read-only, but they can be expanded).",
			listTitle: "Personas",
			importTitle: "Import a persona",
			importNamePlaceholder: "Persona name, e.g. My Catgirl",
			importTextPlaceholder: "Paste persona instructions here, or import a file…",
			importFile: "Choose a .md / .txt file",
			importAction: "Import",
			importHint: "Import a file or paste text. Imported personas appear in the list and can be set active.",
			// "Persona Plaza" entry: the built-in set is limited, point users at more.
			// The plaza is now a GitHub repository, so the wording is "go look, copy the text".
			plazaHint: "Looking for more distinctive personas? Browse the Persona Plaza repository and paste the text in.",
			plazaLinkLabel: "Persona Plaza repository",
			plazaTitle: "Open the Persona Plaza repository in a new tab (GitHub, third-party site)",
			setCurrent: "Set active",
			currentBadge: "active",
			enable: "Enable",
			disable: "Disable",
			offBadge: "disabled",
			rename: "Rename",
			renamePlaceholder: "New name",
			save: "Save",
			cancel: "Cancel",
			remove: "Delete",
			removeConfirm: "Confirm delete",
			builtinLocked: "Built-in personas cannot be deleted or renamed",
			sourceBuiltin: "built-in",
			sourceImported: "imported",
			sourceConfig: "config",
			done: "Updated",
			empty: "The persona library is empty.",
			disabledByConfig: "The plugin is disabled via enabled: false, so no persona section is injected.",
			disabledByPersona: "The active persona is disabled, so it is not injected.",
			failed: "Failed to load",
			failedHint: "The personas are still active; only this view is unavailable.",
			configHint: "A prefix / personaFile in the plugin config shows up as one \"config\" persona; suffix is a separate section appended after the tool guidance and does not follow persona switches; the master switch stays the enabled field on the Plugins page.",
			suffixTitle: "Suffix section",
			suffixChars: "Characters",
			suffixOn: "Configured",
			suffixOff: "Not set",
			totalChars: "Total injected",
			storeHint: "Persona library file",
			scopeTitle: "Scope",
			scopeGlobal: "Global",
			scopeWorkspace: "Workspace",
			scopeSession: "Session",
			scopeHint: "Global = one persona for every session; Workspace = one per project folder; Session = only this session. The narrower scope wins",
			dockFollowGlobal: "Follow global",
			dockFollowWorkspace: "Follow workspace",
			workspaceTitle: "Workspace rules",
			workspaceHint: "In the Workspace scope, each folder below gets its own persona; folders without a pick follow the global one.",
			workspaceEmpty: "No workspace recorded yet — send one message in a project and it shows up here.",
			workspaceFollow: "Follow global",
			dockSwitch: "Switch this session's persona",
			pickerTitle: "Persona for this session",
			pickerHint: "Affects this session only. \"No persona\" turns the persona off for this session entirely — it does not fall back to the workspace or global persona.",
			pickerNoPersona: "No persona in this session (no fallback)",
			dockOff: "Persona disabled",
			dockFailed: "Cannot read status",
			dockSwitchFailed: "Switch failed",
			// The "global persona off" state (issue #3, symptom two)
			currentNone: "Off",
			disabledByGlobalOff: "The global persona is off, so no global persona is injected (workspace / session scopes still apply).",
			disableGlobal: "Turn off global persona",
			enableGlobal: "Restore global persona",
			globalOffHint: "When off, only the Workspace and Session scopes remain: a session picked by neither has no persona at all. Previously the only way to reach this state was to create a placeholder persona and disable it.",
			// Persona chip on the new-session (hero) screen: this is the entry point issue #2 asked for.
			heroChip: "Persona",
			heroChipTitle: "Pick a persona for the new session",
			heroChipFollowGlobal: "Follow global",
			heroChipFollowWorkspace: "Follow workspace",
			// "No persona available" reads like the library is empty; the usual case
			// is "global is off and this workspace has no pick". Word them apart.
			heroChipDisabled: "Unset",
			heroChipNone: "No persona",
		};

		const styles = {
			section: {
				display: "flex",
				flexDirection: "column",
				gap: "12px",
				maxWidth: "760px",
				color: "var(--dsw-alias-label-primary)",
			},
			heading: { margin: 0, fontSize: "18px", fontWeight: 600 },
			subHeading: { margin: "6px 0 0", fontSize: "15px", fontWeight: 600 },
			intro: { margin: 0, fontSize: "13px", color: "var(--dsw-alias-label-tertiary)" },
			card: {
				display: "grid",
				gridTemplateColumns: "88px minmax(0, 1fr)",
				rowGap: "8px",
				columnGap: "12px",
				padding: "14px 16px",
				border: "1px solid var(--dsw-alias-border-l2)",
				borderRadius: "10px",
				fontSize: "13px",
			},
			key: { color: "var(--dsw-alias-label-tertiary)" },
			value: { minWidth: 0, wordBreak: "break-word" },
			preview: {
				margin: 0,
				padding: "12px 14px",
				maxHeight: "260px",
				overflow: "auto",
				whiteSpace: "pre-wrap",
				fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
				fontSize: "12px",
				lineHeight: 1.6,
				border: "1px solid var(--dsw-alias-border-l2)",
				borderRadius: "10px",
				background: "rgba(127, 127, 127, 0.08)",
			},
			list: { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "8px" },
			row: {
				display: "flex",
				flexWrap: "wrap",
				alignItems: "center",
				gap: "8px",
				padding: "10px 12px",
				border: "1px solid var(--dsw-alias-border-l2)",
				borderRadius: "10px",
				fontSize: "13px",
			},
			rowMain: { flex: "1 1 200px", minWidth: 0, display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" },
			personaName: {
				fontWeight: 600,
				// issue #7：人设名上限是 60 字（MAX_PERSONA_NAME），一行放不下。
				// 列表靠 flexWrap 会把徽标挤到下一行，所以名字自身也要能截断。
				maxWidth: "100%",
				minWidth: 0,
				overflow: "hidden",
				textOverflow: "ellipsis",
				whiteSpace: "nowrap",
			},
			badge: {
				fontSize: "11px",
				padding: "1px 7px",
				borderRadius: "999px",
				border: "1px solid var(--dsw-alias-border-l2)",
				color: "var(--dsw-alias-label-tertiary)",
			},
			badgeActive: {
				fontSize: "11px",
				padding: "1px 7px",
				borderRadius: "999px",
				border: "1px solid var(--dsw-alias-state-business-primary, #4b7bec)",
				color: "var(--dsw-alias-state-business-primary, #4b7bec)",
			},
			badgeOff: {
				fontSize: "11px",
				padding: "1px 7px",
				borderRadius: "999px",
				border: "1px solid var(--dsw-alias-border-l2)",
				color: "var(--dsw-alias-state-warning-primary, #d48806)",
			},
			actions: { display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" },
			button: {
				font: "inherit",
				fontSize: "12px",
				padding: "4px 10px",
				borderRadius: "8px",
				border: "1px solid var(--dsw-alias-border-l2)",
				background: "transparent",
				color: "inherit",
				cursor: "pointer",
			},
			primaryButton: {
				font: "inherit",
				fontSize: "12px",
				padding: "4px 12px",
				borderRadius: "8px",
				border: "1px solid var(--dsw-alias-state-business-primary, #4b7bec)",
				background: "transparent",
				color: "var(--dsw-alias-state-business-primary, #4b7bec)",
				cursor: "pointer",
			},
			input: {
				font: "inherit",
				fontSize: "13px",
				padding: "6px 10px",
				borderRadius: "8px",
				border: "1px solid var(--dsw-alias-border-l2)",
				background: "transparent",
				color: "inherit",
				flex: "1 1 200px",
				minWidth: "140px",
				boxSizing: "border-box",
			},
			textarea: {
				font: "inherit",
				fontSize: "12px",
				lineHeight: 1.6,
				padding: "10px 12px",
				borderRadius: "10px",
				border: "1px solid var(--dsw-alias-border-l2)",
				background: "transparent",
				color: "inherit",
				width: "100%",
				minHeight: "120px",
				resize: "vertical",
				boxSizing: "border-box",
			},
			importBox: { display: "flex", flexDirection: "column", gap: "8px" },
			fileLabel: {
				font: "inherit",
				fontSize: "12px",
				padding: "4px 10px",
				borderRadius: "8px",
				border: "1px dashed var(--dsw-alias-border-l2)",
				cursor: "pointer",
				color: "var(--dsw-alias-label-tertiary)",
			},
			hint: { fontSize: "12px", color: "var(--dsw-alias-label-tertiary)", margin: 0 },
			// 人设广场入口：一行「提示语 + 链接」，放在导入区上方。
			plaza: {
				display: "flex",
				flexWrap: "wrap",
				alignItems: "baseline",
				gap: "6px",
				margin: 0,
				padding: "10px 12px",
				borderRadius: "10px",
				border: "1px solid var(--dsw-alias-border-l2)",
				fontSize: "12px",
				color: "var(--dsw-alias-label-tertiary)",
			},
			plazaLink: {
				color: "var(--dsw-alias-state-business-primary, #4b7bec)",
				fontWeight: 600,
				textDecoration: "none",
			},
			messageOk: { fontSize: "13px", margin: 0, color: "var(--dsw-alias-state-success-primary, #389e0d)" },
			messageError: { fontSize: "13px", margin: 0, color: "var(--dsw-alias-state-error-primary, #d4380d)" },
			dock: {
				display: "flex",
				alignItems: "center",
				// 整条可以折到第二行（人设名 + 两个范围开关在小屏上放不下），
				// 但**每个子项内部绝不换行**——否则「人设」这种两字词会被拆成竖排，
				// 正是 issue #7 截图里那副样子。
				flexWrap: "wrap",
				gap: "6px",
				fontSize: "11px",
				color: "var(--dsw-alias-label-tertiary)",
				minWidth: 0,
				maxWidth: "100%",
			},
			dockName: {
				fontWeight: 600,
				color: "var(--dsw-alias-label-primary)",
				// issue #7：人设名一长就把小条撑开、把右侧两个范围开关挤到下一行。
				// 小条是输入框上方的一行状态条，宽度本来就紧张，所以这里必须截断。
				maxWidth: "200px",
				minWidth: 0,
				overflow: "hidden",
				textOverflow: "ellipsis",
				whiteSpace: "nowrap",
			},
			dockNameButton: {
				font: "inherit",
				fontSize: "11px",
				fontWeight: 600,
				padding: "1px 6px",
				borderRadius: "6px",
				border: "1px solid transparent",
				background: "transparent",
				color: "var(--dsw-alias-label-primary)",
				cursor: "pointer",
				// 与 dockName 同一套约束：它俩是同一个位置的两种形态
				// （全局档是纯文本，会话档是可点的按钮），截断规则必须一致。
				maxWidth: "200px",
				minWidth: 0,
				overflow: "hidden",
				textOverflow: "ellipsis",
				whiteSpace: "nowrap",
				textAlign: "left",
			},
			dockChip: {
				font: "inherit",
				fontSize: "11px",
				padding: "1px 8px",
				borderRadius: "999px",
				border: "1px solid var(--dsw-alias-border-l2)",
				background: "transparent",
				color: "inherit",
				cursor: "pointer",
			},
			dockChipActive: {
				font: "inherit",
				fontSize: "11px",
				padding: "1px 8px",
				borderRadius: "999px",
				border: "1px solid var(--dsw-alias-state-business-primary, #4b7bec)",
				background: "transparent",
				color: "var(--dsw-alias-state-business-primary, #4b7bec)",
				cursor: "pointer",
			},
			// 新会话起始页（hero）上的人设 chip：与「工作目录」chip 并排。
			heroChipButton: {
				font: "inherit",
				fontSize: "12px",
				display: "inline-flex",
				alignItems: "center",
				gap: "6px",
				padding: "4px 10px",
				borderRadius: "999px",
				border: "1px solid var(--dsw-alias-border-l2)",
				background: "transparent",
				color: "var(--dsw-alias-label-secondary, inherit)",
				cursor: "pointer",
				// issue #7 第二轮：这里原本有六个并排的 span（🐟 / 人设 / ：/ 名字 /
				// · 跟随全局 / ▾），在 220px 里挤不下。`flex` 默认允许换行到**每个
				// span 内部**，于是「人设」被拆成两行竖排——截图里那副鬼样子。
				// 现在改成：整行不换行（nowrap），图标与固定文案不收缩（flexShrink: 0），
				// 只让名字那一段收缩并显示省略号。这样无论如何都不会把字压成竖排。
				flexWrap: "nowrap",
				whiteSpace: "nowrap",
				maxWidth: "280px",
				minWidth: 0,
				overflow: "hidden",
				boxSizing: "border-box",
				verticalAlign: "middle",
			},
			/** chip 里的固定部分（图标、前缀、分隔符、后缀、箭头）：一律不收缩。 */
			heroChipFixed: {
				flexShrink: 0,
				whiteSpace: "nowrap",
			},
			heroChipLabel: {
				// 唯一允许收缩的那一段。flex 子项默认 `min-width: auto` 会拒绝收缩，
				// 不写 `minWidth: 0` 的话 ellipsis 根本不会生效（issue #7 的同一个坑）。
				flex: "0 1 auto",
				minWidth: 0,
				overflow: "hidden",
				textOverflow: "ellipsis",
				whiteSpace: "nowrap",
			},
			workspacePath: {
				fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
				fontSize: "12px",
				color: "var(--dsw-alias-label-primary)",
				wordBreak: "break-all",
			},
			select: {
				font: "inherit",
				fontSize: "12px",
				padding: "3px 8px",
				borderRadius: "8px",
				border: "1px solid var(--dsw-alias-border-l2)",
				background: "transparent",
				color: "inherit",
			},
			// 会话人设选择浮层：挂在 shell.overlay 上，用 fixed 居中，不占输入框旁边的位置。
			modalBackdrop: {
				position: "fixed",
				inset: "0",
				zIndex: 1000,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: "24px",
				// 遮罩走主题 token，明暗主题各自取值；不要写死 rgba（issue #5）。
				background: "var(--dsw-alias-bg-mask-1)",
			},
			modalPanel: {
				width: "min(420px, 100%)",
				maxWidth: "100%",
				// issue #7：flex 容器默认会让长内容把面板撑开，加 box-sizing 与
				// minWidth: 0 把宽度钉死在这 420px 里，内部再用 ellipsis 收尾。
				boxSizing: "border-box",
				minWidth: 0,
				maxHeight: "min(70vh, 560px)",
				overflowY: "auto",
				padding: "16px",
				borderRadius: "14px",
				// issue #5 的根因：原先写的是 `var(--dsw-alias-bg-layer, #fff)`，
				// 但宿主没有 `--dsw-alias-bg-layer` 这个 token（bg 层是 `bg-base`
				// 与 `bg-layer-1/2/3`），于是永远落到兜底的纯白；夜间主题下文字
				// 跟着变浅，就成了「白底浅字」。
				// 改用 `bg-base`（浮层基础底，明暗自动切换），**不留浅色兜底**——
				// 兜底只会把「变量名写错」重新藏起来，这次就是这么被藏住的。
				background: "var(--dsw-alias-bg-base)",
				color: "var(--dsw-alias-label-primary)",
				// 浮起面板按宿主规范：border 归零，阴影交给主题 elevation token。
				border: 0,
				boxShadow: "var(--dsw-elevation-panel)",
				display: "flex",
				flexDirection: "column",
				gap: "10px",
			},
			modalHeading: { margin: 0, fontSize: "14px", fontWeight: 600 },
			// 选项列表给一点内边距：悬停时选项会放大 2%，不留边距的话
			// 边缘那几像素会被滚动容器裁掉，看起来像「缺了个角」。
			modalList: { display: "flex", flexDirection: "column", gap: "6px", padding: "3px", minWidth: 0 },
			pickerItem: {
				font: "inherit",
				fontSize: "13px",
				textAlign: "left",
				padding: "8px 12px",
				borderRadius: "10px",
				border: "1px solid var(--dsw-alias-border-l2)",
				background: "transparent",
				color: "inherit",
				cursor: "pointer",
				// issue #7：长文案 / 长人设名会撑破浮层。
				// 三件套缺一不可：
				//  - `maxWidth: "100%"` + `boxSizing: "border-box"`：别让 padding 把宽度顶出去
				//  - `minWidth: 0`：flex/grid 子项的默认 `min-width: auto` 会拒绝收缩，
				//    只写 ellipsis 而漏掉这条，文字照样把容器撑开——这是最常被忽略的一环
				//  - `overflow/ellipsis/nowrap`：超出打省略号，而不是折行或溢出
				maxWidth: "100%",
				boxSizing: "border-box",
				minWidth: 0,
				overflow: "hidden",
				textOverflow: "ellipsis",
				whiteSpace: "nowrap",
			},
			pickerItemActive: {
				font: "inherit",
				fontSize: "13px",
				textAlign: "left",
				padding: "8px 12px",
				borderRadius: "10px",
				border: "1px solid var(--dsw-alias-state-business-primary, #4b7bec)",
				background: "transparent",
				color: "var(--dsw-alias-state-business-primary, #4b7bec)",
				cursor: "pointer",
				// 与 pickerItem 保持同一套约束：选中态只是换色，不该换个宽度行为。
				maxWidth: "100%",
				boxSizing: "border-box",
				minWidth: 0,
				overflow: "hidden",
				textOverflow: "ellipsis",
				whiteSpace: "nowrap",
			},
		};

		/**
		 * 注入悬停 / 按下 / 键盘聚焦的样式表。
		 *
		 * 为什么需要这一步：插件所有控件都用内联 `style` 对象，而 `:hover` 这类
		 * **伪类只能由样式表规则命中**，内联样式永远匹配不到——所以此前按钮
		 * 在浅色和暗色下都没有任何悬停反馈（issue #6 的评论）。
		 *
		 * 设计取舍：
		 *  - **不写死颜色**，一律基于宿主主题变量叠加 `color-mix` / `opacity`：
		 *    暗色主题下浅色叠加、亮色主题下深色叠加都能自然成立，
		 *    不用为两套主题各写一遍，也不会和用户自定义主题打架。
		 *  - 用 `:focus-visible` 而不是 `:focus`：鼠标点击后不该留下聚焦环，
		 *    但键盘 Tab 过来必须有——这是无障碍的基本要求。
		 *  - 尊重 `prefers-reduced-motion`：动效只是点缀，系统要求减少动效就关掉。
		 *  - 幂等：重复 apply 不会插第二遍（按 id 查已有节点）。
		 *
		 * @returns 卸载函数，插件停用时把样式表一起撤掉。
		 */
		function injectHoverStyles() {
			if (typeof document === "undefined" || document === null) return () => {};
			const existing = document.getElementById(STYLE_ID);
			if (existing !== null && existing !== undefined) return () => {};

			const css = `
/* ── 通用按钮（设置页 / 浮层里的次要按钮）────────────────── */
.${CLS}-btn { transition: background-color 120ms ease, border-color 120ms ease, box-shadow 120ms ease; }
.${CLS}-btn:hover { background-color: color-mix(in srgb, currentColor 8%, transparent); }
.${CLS}-btn:active { background-color: color-mix(in srgb, currentColor 14%, transparent); }
.${CLS}-btn:focus-visible { outline: 2px solid color-mix(in srgb, currentColor 55%, transparent); outline-offset: 2px; }

/* ── 主按钮：底色更实，悬停时加深而不是只加一点灰 ────────── */
.${CLS}-primary { transition: background-color 120ms ease, box-shadow 120ms ease, border-color 120ms ease; }
.${CLS}-primary:hover { background-color: color-mix(in srgb, currentColor 12%, transparent); }
.${CLS}-primary:active { background-color: color-mix(in srgb, currentColor 20%, transparent); }
.${CLS}-primary:focus-visible { outline: 2px solid color-mix(in srgb, currentColor 60%, transparent); outline-offset: 2px; }

/* ── 浮层里的选项行：悬停时轻微放大 + 高亮，按下回弹 ──────── */
/* transform 不参与布局，所以放大不会把相邻项挤开；但为了不被浮层的
   滚动容器裁掉边缘，选项列表给了几像素内边距（见 modalList 样式）。 */
.${CLS}-item { position: relative; transition: background-color 120ms ease, border-color 120ms ease, transform 120ms cubic-bezier(0.2, 0.8, 0.3, 1); will-change: transform; }
.${CLS}-item:hover { background-color: color-mix(in srgb, currentColor 7%, transparent); transform: scale(1.02); }
.${CLS}-item:active { transform: scale(0.99); }
.${CLS}-item:focus-visible { outline: 2px solid color-mix(in srgb, currentColor 55%, transparent); outline-offset: -2px; }
/* 当前选中项不放大：它已经有高亮边框，再放大反而和悬停态撞在一起，
   分不清「我已选中它」和「我正指着它」。 */
.${CLS}-item[data-active="true"]:hover { transform: none; }

/* ── 小条上的 chip / 人设名：悬停时才显出边框，平时保持轻盈 ── */
.${CLS}-chip { transition: background-color 120ms ease, border-color 120ms ease; }
.${CLS}-chip:hover { background-color: color-mix(in srgb, currentColor 10%, transparent); }
.${CLS}-chip:active { background-color: color-mix(in srgb, currentColor 16%, transparent); }
.${CLS}-chip:focus-visible { outline: 2px solid color-mix(in srgb, currentColor 50%, transparent); outline-offset: 1px; }

/* ── 起始页 chip 与「选择文件」标签：同小条，但更明显一点 ──── */
.${CLS}-pill { transition: background-color 120ms ease, border-color 120ms ease; }
.${CLS}-pill:hover { background-color: color-mix(in srgb, currentColor 9%, transparent); }
.${CLS}-pill:active { background-color: color-mix(in srgb, currentColor 15%, transparent); }
.${CLS}-pill:focus-visible { outline: 2px solid color-mix(in srgb, currentColor 50%, transparent); outline-offset: 1px; }
/* issue #7 第二轮：chip 内部是一串 span，某些宿主主题会把它们当成可换行的
   行内块，窄屏下逐字竖排（「人设」被拆成上下两行）。这里用 CSS 兜底：
   固定部分不收缩、任何子项内部都不换行，只有带 ellipsis 的那段允许省略。 */
.${CLS}-pill, .${CLS}-chip { flex-wrap: nowrap; }
.${CLS}-pill > span, .${CLS}-chip > span { flex-shrink: 0; white-space: nowrap; }
.${CLS}-pill > span[style*="ellipsis"], .${CLS}-chip > span[style*="ellipsis"] { flex-shrink: 1; min-width: 0; }

/* ── 人设广场外链：悬停加下划线，符合「这是一条链接」的直觉 ── */
.${CLS}-link { transition: opacity 120ms ease; }
.${CLS}-link:hover { text-decoration: underline; text-underline-offset: 2px; }
.${CLS}-link:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; border-radius: 3px; }

/* ── 禁用态：别给悬停反馈，否则用户以为能点 ──────────────── */
.${CLS}-btn:disabled:hover,
.${CLS}-primary:disabled:hover,
.${CLS}-item:disabled:hover,
.${CLS}-chip:disabled:hover,
.${CLS}-pill:disabled:hover { background-color: transparent; }
.${CLS}-btn:disabled,
.${CLS}-primary:disabled,
.${CLS}-item:disabled,
.${CLS}-chip:disabled { cursor: default; }

/* ── 系统要求减少动效时不加过渡（保留颜色变化，它不引发眩晕）── */
@media (prefers-reduced-motion: reduce) {
  .${CLS}-btn, .${CLS}-primary, .${CLS}-item, .${CLS}-chip, .${CLS}-pill, .${CLS}-link { transition: none; }
  .${CLS}-item:active { transform: none; }
}

/* ── color-mix 的兜底 ──────────────────────────────────── */
/* 上面的悬停底色全用 color-mix(in srgb, currentColor N%, transparent)，
   这样亮色 / 暗色 / 自定义主题都不用各写一遍。它需要 Chromium 111+，
   而 DSH 当前是 Electron（Chromium 140+），本来一定支持。
   但万一将来宿主降级、或换了更老的运行时，整条声明会被丢弃，
   按钮就又变成没反馈了。所以给一个不依赖 color-mix 的等价实现：
   宿主主题的 mask 层色板能取到就用它，取不到再退到 outline
   （outline 不影响布局，也不会像 opacity 那样把文字一起变淡）。 */
@supports not (background-color: color-mix(in srgb, red 10%, transparent)) {
  .${CLS}-btn:hover, .${CLS}-primary:hover, .${CLS}-item:hover,
  .${CLS}-chip:hover, .${CLS}-pill:hover {
    background-color: var(--dsw-alias-bg-layer-2, transparent);
    outline: 1px solid var(--dsw-alias-border-l2);
  }
  .${CLS}-btn:active, .${CLS}-primary:active, .${CLS}-item:active,
  .${CLS}-chip:active, .${CLS}-pill:active {
    background-color: var(--dsw-alias-bg-layer-3, transparent);
  }
}
`;
			const style = document.createElement("style");
			style.id = STYLE_ID;
			style.textContent = css;
			document.head.appendChild(style);
			return () => {
				const node = document.getElementById(STYLE_ID);
				if (node !== null && node !== undefined) node.remove();
			};
		}

		/**
		 * 取一个「标签 + 值」行的分隔符，交给当前语言决定（中英标点习惯不同）。
		 * 字典没有这个键时退回全角冒号，保持旧观感而不是让界面出现键名。
		 */
		function separatorOf(t) {
			const value = t("labelSeparator");
			return typeof value === "string" && value !== "labelSeparator" ? value : "：";
		}

		/**
		 * 把 `t` 当成「查得到就返回译文，查不到返回 undefined」来用。
		 *
		 * 宿主的 `t` 在键缺失时会**回显键名本身**（见 dsh-client-locale 的
		 * 「…then displays the key」），所以「拿到的等于键名」就等于没命中。
		 * 内置人设的名字 / 简介要靠这个判断决定是否回退到宿主给的原文。
		 */
		function localized(t, key) {
			const value = typeof t === "function" ? t(key) : undefined;
			return typeof value === "string" && value.length > 0 && value !== key ? value : undefined;
		}

		/**
		 * 内置人设 id → 字典词条后缀。
		 *
		 * 显式列出而不是「不是 acha 就是 dafeiyu」：将来新增内置人设时，忘了补词条
		 * 只会回退到宿主给的名字，而不会张冠李戴成另一条人设。
		 */
		const BUILTIN_LOCALE_SUFFIX = { dafeiyu: "Dafeiyu", acha: "Acha", tinglan: "Tinglan" };

		/**
		 * 内置人设的展示名。宿主只给中文原文，界面按当前语言取词条；
		 * 字典里没有这条（例如第三方语言包没翻）就回退到宿主给的名字。
		 */
		function displayNameOf(t, persona) {
			if (persona && persona.builtin === true) {
				const suffix = BUILTIN_LOCALE_SUFFIX[persona.id];
				if (suffix !== undefined) {
					const localizedName = localized(t, `personaName${suffix}`);
					if (localizedName !== undefined) return localizedName;
				}
			}
			return persona && typeof persona.name === "string" ? persona.name : "";
		}

		/** 内置人设的简介：与 displayNameOf 同样的「先查字典、再回退原文」策略。 */
		function displayAboutOf(t, persona) {
			if (persona && persona.builtin === true) {
				const suffix = BUILTIN_LOCALE_SUFFIX[persona.id];
				if (suffix !== undefined) {
					const about = localized(t, `personaAbout${suffix}`);
					if (about !== undefined) return about;
				}
			}
			return persona && typeof persona.description === "string" ? persona.description : undefined;
		}

		/**
		 * 一次状态读取。带上 sessionId / cwd 时，宿主会额外给出该会话的视角、
		 * 该工作区的视角，以及「最终到底注入谁」（与提示词注入走同一个解析函数）。
		 */
		function fetchStatus(sessionId, cwd) {
			if (typeof fetch !== "function") return Promise.reject(new Error("fetch unavailable"));
			const params = [];
			if (typeof sessionId === "string" && sessionId.length > 0) params.push(`sessionId=${encodeURIComponent(sessionId)}`);
			if (typeof cwd === "string" && cwd.length > 0) params.push(`cwd=${encodeURIComponent(cwd)}`);
			const query = params.length > 0 ? `?${params.join("&")}` : "";
			return fetch(`${STATUS_PATH}${query}`, { headers: { accept: "application/json" } }).then((response) => {
				if (!response.ok) throw new Error(`HTTP ${response.status}`);
				return response.json().then((body) => {
					if (!body || body.ok !== true) throw new Error((body && body.error) || "malformed payload");
					return body.value;
				});
			});
		}

		/** 一次变更提交。 */
		function postMutate(payload) {
			if (typeof fetch !== "function") return Promise.reject(new Error("fetch unavailable"));
			return fetch(MUTATE_PATH, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(payload),
			}).then((response) => response.json().then((body) => {
				if (!response.ok) throw new Error(`HTTP ${response.status}`);
				if (!body || body.ok !== true) throw new Error((body && body.error) || "request rejected");
				return body.value;
			}));
		}

		/** 按需读取一条人设的完整正文（内置 / 自导入 / config 都走这里）。 */
		function fetchPersonaText(id) {
			if (typeof fetch !== "function") return Promise.reject(new Error("fetch unavailable"));
			return fetch(`${PERSONA_PATH}?id=${encodeURIComponent(id)}`, { headers: { accept: "application/json" } })
				.then((response) => {
					if (!response.ok) throw new Error(`HTTP ${response.status}`);
					return response.json().then((body) => {
						if (!body || body.ok !== true) throw new Error((body && body.error) || "malformed payload");
						return body.value;
					});
				});
		}

		/** 去掉文件扩展名，用作默认人设名。 */
		function stripExtension(fileName) {
			return String(fileName || "").replace(/\.(md|markdown|txt)$/i, "");
		}

		/**
		 * 把一条人设的正文交给浏览器存成 `.md` 文件。
		 *
		 * 全程在浏览器侧完成，**不新增宿主路由**：正文走已有的 `/persona?id=` 取，
		 * 落盘格式与「导入」接受的格式一致（纯正文、无 BOM），所以导出的文件可以原样再导入回来。
		 *
		 * 文件名按各平台通用规则净化：去掉 `\ / : * ? " < > |` 与控制字符，
		 * 空名回退成 `persona`——人设名允许出现这些字符（只校验长度与重名），
		 * 所以净化是必须的一步，不能假设名字已经安全。
		 *
		 * @returns 实际使用的文件名（含扩展名），供界面回显。
		 */
		function downloadPersonaFile(name, text) {
			const canDownload = typeof document !== "undefined"
				&& typeof Blob !== "undefined"
				&& typeof URL !== "undefined"
				&& typeof URL.createObjectURL === "function";
			if (!canDownload) throw new Error("download unavailable");

			const safe = String(name === undefined || name === null ? "" : name)
				.replace(/[\\/:*?"<>|\u0000-\u001f]/g, "_")
				.trim()
				.slice(0, 80) || "persona";
			const fileName = `${safe}.md`;

			const url = URL.createObjectURL(new Blob([String(text)], { type: "text/markdown;charset=utf-8" }));
			const anchor = document.createElement("a");
			anchor.href = url;
			anchor.download = fileName;
			anchor.rel = "noopener";
			document.body.appendChild(anchor);
			anchor.click();
			anchor.remove();
			// 立刻 revoke 会让部分浏览器取消下载，挪到下一拍再回收。
			setTimeout(() => URL.revokeObjectURL(url), 0);
			return fileName;
		}

		/**
		 * 设置页里的「人设」小节：当前人设 + 人设库管理 + 导入。
		 * @param props - 设置席位参数，含 locale 绑定的 t。
		 */
		function PersonaSettingsSection(props) {
			const t = typeof props.t === "function" ? props.t : (key) => key;
			const [state, setState] = react.useState({ status: "loading" });
			const [busy, setBusy] = react.useState(false);
			const [message, setMessage] = react.useState(null);
			const [confirmId, setConfirmId] = react.useState(null);
			const [renameId, setRenameId] = react.useState(null);
			const [renameValue, setRenameValue] = react.useState("");
			const [name, setName] = react.useState("");
			const [text, setText] = react.useState("");
			const [picked, setPicked] = react.useState("");
			const [expandedId, setExpandedId] = react.useState(null);
			const [personaTexts, setPersonaTexts] = react.useState({});
			const [textBusyId, setTextBusyId] = react.useState(null);
			const [textFailId, setTextFailId] = react.useState(null);

			const load = react.useCallback(() => {
				setState({ status: "loading" });
				fetchStatus()
					.then((value) => setState({ status: "ready", value }))
					.catch((error) => setState({ status: "error", message: error && error.message ? error.message : String(error) }));
			}, []);

			react.useEffect(() => {
				load();
			}, [load]);

			/**
			 * 一次变更提交。`onSuccess` 只在服务端确认成功后才调用 —— 失败时
			 * 调用方保留用户已经输入的内容（导入的正文、正在改的名字），
			 * 否则用户粘了几万字的正文会因为一次校验失败被清空。
			 */
			const run = react.useCallback((payload, onSuccess) => {
				setBusy(true);
				setMessage(null);
				postMutate(payload)
					.then((value) => {
						setState({ status: "ready", value });
						setMessage({ kind: "ok", text: t("done") });
						if (typeof onSuccess === "function") onSuccess();
					})
					.catch((error) => setMessage({ kind: "error", text: error && error.message ? error.message : String(error) }))
					.then(() => {
						setBusy(false);
						setConfirmId(null);
					});
			}, [t]);

			const onPickFile = react.useCallback((event) => {
				const file = event && event.target && event.target.files ? event.target.files[0] : undefined;
				if (!file) return;
				const accept = (content) => {
					setText(String(content || ""));
					setPicked(file.name);
					setName((previous) => previous || stripExtension(file.name));
					setMessage(null);
				};
				if (typeof file.text === "function") {
					file.text().then(accept).catch((error) => setMessage({
						kind: "error",
						text: error && error.message ? error.message : String(error),
					}));
				} else if (typeof FileReader === "function") {
					const reader = new FileReader();
					reader.onload = () => accept(reader.result);
					reader.readAsText(file);
				}
			}, []);

			const sourceLabel = (source) => source === "imported"
				? t("sourceImported")
				: source === "config" ? t("sourceConfig") : t("sourceBuiltin");

			/**
			 * 全局当前的人设名。
			 *
			 * `value.current === null` 是**合法状态**（用户明确关掉了全局人设，只靠工作区 /
			 * 会话两档）。以前这里会显示成「—」，看上去像数据坏了；现在明说「不启用」。
			 *
			 * 优先读宿主给的 `globalOff` 字段；老宿主没有它时退回看 `current === null`
			 * （新客户端 + 旧宿主混跑时行为一致）。
			 */
			const globalOff = value => value.globalOff === true
				|| (value.globalOff === undefined && (value.current === null || value.current === undefined));

			/** 展开 / 收起某条自导入人设的完整提示词（首次展开时按需拉取）。 */
			const toggleFullText = react.useCallback((persona) => {
				setTextFailId(null);
				if (expandedId === persona.id) {
					setExpandedId(null);
					return;
				}
				if (personaTexts[persona.id] !== undefined) {
					setExpandedId(persona.id);
					return;
				}
				setTextBusyId(persona.id);
				fetchPersonaText(persona.id)
					.then((entry) => {
						setPersonaTexts((previous) => ({ ...previous, [entry.id]: entry.text }));
						setExpandedId(entry.id);
					})
					.catch(() => setTextFailId(persona.id))
					.then(() => setTextBusyId(null));
			}, [expandedId, personaTexts]);

			/**
			 * 把一条人设导出成 `.md` 文件。
			 *
			 * 正文优先用「查看全文」已经拉过的那份，没拉过才走一次 `/persona?id=`。
			 * 成功时的文件名、失败时的原因都复用设置页顶部的 message 行，
			 * **不额外新增 useState**，组件原有的状态序号因此保持不变。
			 */
			const exportPersona = react.useCallback((persona) => {
				setMessage(null);
				const cached = personaTexts[persona.id];
				const ready = typeof cached === "string"
					? Promise.resolve(cached)
					: fetchPersonaText(persona.id).then((entry) => entry.text);
				ready
					.then((text) => {
						const fileName = downloadPersonaFile(displayNameOf(t, persona), text);
						setMessage({ kind: "ok", text: `${t("exportDone")}${separatorOf(t)}${fileName}` });
					})
					.catch((error) => {
						const reason = error && error.message === "download unavailable"
							? t("exportUnsupported")
							: (error && error.message ? error.message : String(error));
						setMessage({ kind: "error", text: `${t("exportFailed")}${separatorOf(t)}${reason}` });
					});
			}, [personaTexts, t]);

			const importable = (persona) => persona.builtin !== true && persona.source === "imported";
			const body = [];

			if (message) {
				body.push(jsxRuntime.jsx("p", {
					style: message.kind === "ok" ? styles.messageOk : styles.messageError,
					children: message.text,
				}, "message"));
			}

			if (state.status === "loading") {
				body.push(jsxRuntime.jsx("p", { style: styles.hint, children: t("loading") }, "loading"));
			} else if (state.status === "error") {
				body.push(jsxRuntime.jsx("p", { style: styles.messageError, children: `${t("failed")}${separatorOf(t)}${state.message}` }, "error"));
				body.push(jsxRuntime.jsx("p", { style: styles.hint, children: t("failedHint") }, "error-hint"));
			} else {
				const value = state.value;
				// 老版宿主不给 suffix 字段，此时整块 suffix 行都不渲染（向后兼容）。
				const suffixInfo = value && typeof value.suffix === "object" && value.suffix !== null
					? value.suffix
					: undefined;
				// 当前生效的那条（列表里的元数据），内置人设的名字 / 简介按语言取自字典。
				const currentEntry = value.personas.find((persona) => persona.current === true);
				const globalOffNow = globalOff(value);
				const currentShownName = globalOffNow
					? t("currentNone")
					: currentEntry === undefined
						? (value.currentName || "—")
						: (displayNameOf(t, currentEntry) || value.currentName || "—");

				body.push(jsxRuntime.jsx("h3", { style: styles.subHeading, children: t("currentTitle") }, "current-title"));
				body.push(jsxRuntime.jsxs("div", {
					style: styles.card,
					children: [
						jsxRuntime.jsx("div", { style: styles.key, children: t("name") }, "k-name"),
						jsxRuntime.jsxs("div", {
							style: styles.value,
							children: globalOffNow
								? currentShownName
								: [currentShownName, " ", jsxRuntime.jsx("span", { style: styles.badge, children: sourceLabel(value.source) }, "badge")],
						}, "v-name"),
						jsxRuntime.jsx("div", { style: styles.key, children: t("status") }, "k-status"),
						jsxRuntime.jsx("div", {
							style: styles.value,
							children: !value.enabled
								? t("disabledByConfig")
								: globalOffNow
									? t("disabledByGlobalOff")
									: value.active ? t("enabled") : t("disabledByPersona"),
						}, "v-status"),
						jsxRuntime.jsx("div", { style: styles.key, children: t("section") }, "k-section"),
						jsxRuntime.jsx("div", { style: styles.value, children: `${value.section} · order ${value.order}` }, "v-section"),
						jsxRuntime.jsx("div", { style: styles.key, children: t("chars") }, "k-chars"),
						jsxRuntime.jsx("div", { style: styles.value, children: String(value.chars) }, "v-chars"),
						// suffix 是独立段落（不随人设切换），单独一行说明它到底配了没有、多少字、排在哪。
						suffixInfo === undefined ? null : jsxRuntime.jsx("div", { style: styles.key, children: t("suffixTitle") }, "k-suffix"),
						suffixInfo === undefined ? null : jsxRuntime.jsx("div", {
							style: styles.value,
							children: suffixInfo.configured
								? `${t("suffixOn")} · ${t("suffixChars")} ${suffixInfo.chars}`
									+ (suffixInfo.order === null || suffixInfo.order === undefined ? "" : ` · order ${suffixInfo.order}`)
								: t("suffixOff"),
						}, "v-suffix"),
						suffixInfo === undefined ? null : jsxRuntime.jsx("div", { style: styles.key, children: t("totalChars") }, "k-total"),
						suffixInfo === undefined ? null : jsxRuntime.jsx("div", {
							style: styles.value,
							children: String(value.totalChars === undefined ? value.chars : value.totalChars),
						}, "v-total"),
						jsxRuntime.jsx("div", { style: styles.key, children: t("storeHint") }, "k-store"),
						jsxRuntime.jsx("div", { style: styles.value, children: value.storePath || "—" }, "v-store"),
					],
				}, "card"));
				// 全局人设的「不启用」开关（issue #3 现象二）。
				// 它是**全局层**的开关，只在「全局」档下有意义：另外两档本来就会先查更细的层，
				// 全局当前只是兜底。把它放在卡片正下方，紧挨着「当前生效」的显示。
				body.push(jsxRuntime.jsx("div", {
					style: styles.actions,
					children: globalOffNow
						? jsxRuntime.jsx("button", {
							type: "button",
							style: styles.primaryButton,

							className: `${CLS}-primary`,
							disabled: busy,
							// 恢复全局人设：交回内置默认（dafeiyu）。用户随后仍可挑别的。
							onClick: () => run({ action: "set-current", id: DEFAULT_PERSONA_ID }),
							children: t("enableGlobal"),
						}, "global-on")
						: jsxRuntime.jsx("button", {
							type: "button",
							style: styles.button,

							className: `${CLS}-btn`,
							disabled: busy,
							onClick: () => run({ action: "set-current", id: null }),
							children: t("disableGlobal"),
						}, "global-off"),
				}, "global-toggle"));
				body.push(jsxRuntime.jsx("p", { style: styles.hint, children: t("globalOffHint") }, "global-off-hint"));
				const currentAbout = currentEntry === undefined ? undefined : displayAboutOf(t, currentEntry);
				if (currentAbout) {
					body.push(jsxRuntime.jsx("p", {
						style: styles.hint,
						children: `${t("description")}${separatorOf(t)}${currentAbout}`,
					}, "current-description"));
				} else if (currentEntry) {
					body.push(jsxRuntime.jsx("p", { style: styles.hint, children: t("fullTextInList") }, "current-fulltext-hint"));
				}

				// ── 生效范围（含工作区规则）────────────────────────────────
				// 「工作区」这一档要按目录逐条挑人设，只有设置页放得下；
				// 输入框上方的小条因此只保留「全局 / 会话」两档。
				body.push(jsxRuntime.jsx("h3", { style: styles.subHeading, children: t("scopeTitle") }, "scope-title"));
				body.push(jsxRuntime.jsx("p", { style: styles.hint, children: t("scopeHint") }, "scope-hint"));
				body.push(jsxRuntime.jsx("div", {
					style: styles.actions,
					children: ["global", "workspace", "session"].map((option) => jsxRuntime.jsx("button", {
						type: "button",
						// 一档一个按钮：选中的走主按钮样式，其余是次要按钮，
						// 两者都要 class——它们的悬停反馈强度不同，靠后缀区分。
						style: value.mode === option ? styles.primaryButton : styles.button,
						className: value.mode === option ? `${CLS}-primary` : `${CLS}-btn`,
						disabled: busy,
						onClick: () => run({ action: "set-mode", mode: option }),
						children: option === "global"
							? t("scopeGlobal")
							: option === "workspace" ? t("scopeWorkspace") : t("scopeSession"),
					}, `scope-${option}`)),
				}, "scope-actions"));

				body.push(jsxRuntime.jsx("h4", { style: styles.subHeading, children: t("workspaceTitle") }, "workspace-title"));
				body.push(jsxRuntime.jsx("p", { style: styles.hint, children: t("workspaceHint") }, "workspace-hint"));
				const workspaceRows = Array.isArray(value.workspaces) ? value.workspaces : [];
				if (workspaceRows.length === 0) {
					body.push(jsxRuntime.jsx("p", { style: styles.hint, children: t("workspaceEmpty") }, "workspace-empty"));
				} else {
					body.push(jsxRuntime.jsx("ul", {
						style: styles.list,
						children: workspaceRows.map((row) => jsxRuntime.jsxs("li", {
							style: styles.row,
							children: [
								jsxRuntime.jsx("div", {
									style: styles.rowMain,
									children: jsxRuntime.jsx("span", { style: styles.workspacePath, children: row.cwd }, "cwd"),
								}, "cwd-wrap"),
								jsxRuntime.jsx("select", {
									style: styles.select,
									value: row.personaId === null ? "" : row.personaId,
									disabled: busy,
									onChange: (event) => run({
										action: "set-workspace-persona",
										cwd: row.cwd,
										personaId: event.target.value === "" ? null : event.target.value,
									}),
									children: [
										jsxRuntime.jsx("option", { value: "", children: t("workspaceFollow") }, "opt-follow"),
										...value.personas
											.filter((persona) => persona.enabled === true)
											.map((persona) => jsxRuntime.jsx("option", {
												value: persona.id,
												children: displayNameOf(t, persona) || persona.name,
											}, `opt-${persona.id}`)),
									],
								}, "workspace-select"),
							],
						}, `ws-${row.cwd}`)),
					}, "workspace-list"));
				}

				body.push(jsxRuntime.jsx("h3", { style: styles.subHeading, children: t("listTitle") }, "list-title"));
				if (value.personas.length === 0) {
					body.push(jsxRuntime.jsx("p", { style: styles.hint, children: t("empty") }, "empty"));
				}
				body.push(jsxRuntime.jsx("ul", {
					style: styles.list,
					children: value.personas.map((persona) => {
						const rows = [jsxRuntime.jsxs("div", {
							style: styles.row,
							children: [
								jsxRuntime.jsxs("div", {
									style: styles.rowMain,
									children: [
										jsxRuntime.jsx("span", {
											style: styles.personaName,
											// 截断后靠 title 补全：长名字在列表里只看得到前半截。
											title: displayNameOf(t, persona) || persona.name,
											children: displayNameOf(t, persona) || persona.name,
										}, "name"),
										jsxRuntime.jsx("span", { style: styles.badge, children: sourceLabel(persona.source) }, "source"),
										persona.current
											? jsxRuntime.jsx("span", { style: styles.badgeActive, children: t("currentBadge") }, "current")
											: null,
										persona.enabled ? null : jsxRuntime.jsx("span", { style: styles.badgeOff, children: t("offBadge") }, "off"),
										jsxRuntime.jsx("span", { style: styles.hint, children: String(persona.chars) }, "chars"),
									],
								}, "main"),
								jsxRuntime.jsxs("div", {
									style: styles.actions,
									children: [
										persona.current ? null : jsxRuntime.jsx("button", {
											type: "button",
											style: styles.primaryButton,

											className: `${CLS}-primary`,
											disabled: busy,
											onClick: () => run({ action: "set-current", id: persona.id }),
											children: t("setCurrent"),
										}, "set-current"),
										jsxRuntime.jsx("button", {
											type: "button",
											style: styles.button,

											className: `${CLS}-btn`,
											disabled: busy,
											onClick: () => run({ action: "set-enabled", id: persona.id, enabled: !persona.enabled }),
											children: persona.enabled ? t("disable") : t("enable"),
										}, "toggle"),
										importable(persona) ? jsxRuntime.jsx("button", {
											type: "button",
											style: styles.button,

											className: `${CLS}-btn`,
											disabled: busy,
											onClick: () => {
												setRenameId(persona.id);
												setRenameValue(persona.name);
											},
											children: t("rename"),
										}, "rename") : null,
										importable(persona) ? (confirmId === persona.id
											? jsxRuntime.jsxs("span", {
												style: styles.actions,
												children: [
													jsxRuntime.jsx("button", {
														type: "button",
														style: styles.button,

														className: `${CLS}-btn`,
														disabled: busy,
														onClick: () => run({ action: "remove", id: persona.id }),
														children: t("removeConfirm"),
													}, "confirm"),
													jsxRuntime.jsx("button", {
														type: "button",
														style: styles.button,

														className: `${CLS}-btn`,
														disabled: busy,
														onClick: () => setConfirmId(null),
														children: t("cancel"),
													}, "cancel"),
												],
											}, "confirm-box")
											: jsxRuntime.jsx("button", {
												type: "button",
												style: styles.button,

												className: `${CLS}-btn`,
												disabled: busy,
												onClick: () => setConfirmId(persona.id),
												children: t("remove"),
											}, "remove")) : null,
										persona.builtin
											? jsxRuntime.jsx("span", { style: styles.hint, children: t("builtinLocked") }, "locked")
											: null,
									],
								}, "actions"),
							],
						}, "row")];

						// 内置人设额外给一句简介（正文现在也能展开查看）。
						if (persona.builtin === true) {
							rows.push(jsxRuntime.jsx("p", {
								style: styles.hint,
								children: `${t("description")}${separatorOf(t)}${displayAboutOf(t, persona) || t("builtinNote")}`,
							}, "builtin-description"));
						}

						// 所有条目都能展开完整提示词——内置人设也是人设，
						// 用户想知道「当前用的这条到底写了什么」时不该被挡住。
						{
							const expanded = expandedId === persona.id;
							const text = personaTexts[persona.id];
							rows.push(jsxRuntime.jsxs("div", {
								style: styles.actions,
								children: [
									jsxRuntime.jsx("button", {
										type: "button",
										style: styles.button,

										className: `${CLS}-btn`,
										disabled: textBusyId === persona.id,
										onClick: () => toggleFullText(persona),
										children: expanded ? t("collapse") : t("fullText"),
									}, "toggle-full-text"),
									// 导出仍只给自导入 / config 人设：内置正文由插件维护，
									// 不属于用户的资产；想改就先自己导入一份。
									persona.builtin === true
										? null
										: jsxRuntime.jsx("button", {
											type: "button",
											style: styles.button,

											className: `${CLS}-btn`,
											onClick: () => exportPersona(persona),
											children: t("exportAction"),
										}, "export-persona"),
									textBusyId === persona.id
										? jsxRuntime.jsx("span", { style: styles.hint, children: t("fullTextLoading") }, "text-loading")
										: null,
									textFailId === persona.id
										? jsxRuntime.jsx("span", { style: styles.messageError, children: t("fullTextFailed") }, "text-failed")
										: null,
								],
							}, "full-text-actions"));
							if (expanded && typeof text === "string") {
								rows.push(jsxRuntime.jsx("pre", { style: styles.preview, children: text }, "full-text"));
							}
						}

						if (renameId === persona.id) {
							rows.push(jsxRuntime.jsxs("div", {
								style: styles.actions,
								children: [
									jsxRuntime.jsx("input", {
										style: styles.input,
										value: renameValue,
										placeholder: t("renamePlaceholder"),
										onChange: (event) => setRenameValue(event.target.value),
									}, "rename-input"),
									jsxRuntime.jsx("button", {
										type: "button",
										style: styles.primaryButton,

										className: `${CLS}-primary`,
										disabled: busy || String(renameValue).trim().length === 0,
										onClick: () => {
											run({ action: "rename", id: persona.id, name: renameValue }, () => {
												setRenameId(null);
											});
										},
										children: t("save"),
									}, "rename-save"),
									jsxRuntime.jsx("button", {
										type: "button",
										style: styles.button,

										className: `${CLS}-btn`,
										disabled: busy,
										onClick: () => setRenameId(null),
										children: t("cancel"),
									}, "rename-cancel"),
								],
							}, "rename-row"));
						}

						return jsxRuntime.jsx("li", { children: rows }, persona.id);
					}),
				}, "list"));

				// 人设广场：内置人设数量有限，导入区上方给一个「去外面找」的出口。
				// 用真实 <a> 而不是按钮：这样能用浏览器自己的「在新标签打开」「复制链接」，
				// 中键 / 右键行为也符合预期。rel 防住 window.opener 反向控制。
				body.push(jsxRuntime.jsxs("p", {
					style: styles.plaza,
					children: [
						jsxRuntime.jsx("span", { children: t("plazaHint") }, "plaza-hint"),
						jsxRuntime.jsx("a", {
							href: PLAZA_URL,
							target: "_blank",
							rel: "noopener noreferrer",
							style: styles.plazaLink,

							className: `${CLS}-link`,
							title: t("plazaTitle"),
							children: t("plazaLinkLabel"),
						}, "plaza-link"),
					],
				}, "plaza"));

				body.push(jsxRuntime.jsx("h3", { style: styles.subHeading, children: t("importTitle") }, "import-title"));
				body.push(jsxRuntime.jsxs("div", {
					style: styles.importBox,
					children: [
						jsxRuntime.jsx("input", {
							style: styles.input,
							value: name,
							placeholder: t("importNamePlaceholder"),
							onChange: (event) => setName(event.target.value),
						}, "import-name"),
						jsxRuntime.jsx("textarea", {
							style: styles.textarea,
							value: text,
							placeholder: t("importTextPlaceholder"),
							onChange: (event) => setText(event.target.value),
						}, "import-text"),
						jsxRuntime.jsxs("div", {
							style: styles.actions,
							children: [
								jsxRuntime.jsxs("label", {
									style: styles.fileLabel,

									className: `${CLS}-pill`,
									children: [
										t("importFile"),
										jsxRuntime.jsx("input", {
											type: "file",
											accept: ".md,.markdown,.txt,text/plain",
											style: { display: "none" },
											onChange: onPickFile,
										}, "file"),
									],
								}, "file-label"),
								picked ? jsxRuntime.jsx("span", { style: styles.hint, children: picked }, "picked") : null,
								jsxRuntime.jsx("button", {
									type: "button",
									style: styles.primaryButton,

									className: `${CLS}-primary`,
									disabled: busy || String(text).trim().length === 0,
									onClick: () => {
										run({ action: "import", name, text }, () => {
											setName("");
											setText("");
											setPicked("");
										});
									},
									children: t("importAction"),
								}, "import-run"),
							],
						}, "import-actions"),
						jsxRuntime.jsx("p", { style: styles.hint, children: t("importHint") }, "import-hint"),
					],
				}, "import-box"));
			}

			body.push(jsxRuntime.jsx("div", {
				style: styles.actions,
				children: jsxRuntime.jsx("button", {
					type: "button",
					style: styles.button,

					className: `${CLS}-btn`,
					disabled: busy,
					onClick: load,
					children: t("refresh"),
				}, "refresh"),
			}, "footer-actions"));
			body.push(jsxRuntime.jsx("p", { style: styles.hint, children: t("configHint") }, "config-hint"));

			return jsxRuntime.jsxs("section", {
				style: styles.section,
				"aria-label": t("title"),
				children: [
					jsxRuntime.jsx("h2", { style: styles.heading, children: t("title") }, "title"),
					jsxRuntime.jsx("p", { style: styles.intro, children: t("intro") }, "intro"),
					...body,
				],
			});
		}

		// ── 人设选择浮层的跨插槽状态 ─────────────────────────────────
		// 小条（conversation.composer.dock）与浮层（shell.overlay）是两个独立的插槽组件，
		// 用一个极简 store 联动：小条负责「打开并交底」，浮层负责渲染与提交。
		const pickerStore = {
			state: { open: false, sessionId: "", cwd: undefined, value: null, onUpdated: null },
			listeners: new Set(),
			get: () => pickerStore.state,
			set: (patch) => {
				pickerStore.state = { ...pickerStore.state, ...patch };
				for (const listener of [...pickerStore.listeners]) listener();
			},
			subscribe: (listener) => {
				pickerStore.listeners.add(listener);
				return () => pickerStore.listeners.delete(listener);
			},
		};

		/**
		 * 会话人设选择浮层：屏幕正中一块面板，列出库里所有启用的人设。
		 *
		 * 为什么不在小条上就地展开：人设一多，输入框旁边会被一排按钮堆满，既难看也放不下。
		 * 浮层注册在 DSH 的 `shell.overlay`（整帧浮层插槽），
		 * **不往 `document.body` 追加 DOM**。
		 *
		 * 提交走 `set-session-persona`；成功后把新快照回填给小条（`onUpdated`），
		 * 小条据此立刻显示新的人设名。
		 */
		function PersonaPickerOverlay(props) {
			const t = typeof props?.t === "function" ? props.t : (key) => key;
			const [state, setState] = react.useState(() => pickerStore.get());
			const [busy, setBusy] = react.useState(false);
			const [failure, setFailure] = react.useState(null);

			react.useEffect(() => pickerStore.subscribe(() => {
				setState(pickerStore.get());
				setFailure(null);
			}), []);

			const close = () => pickerStore.set({ open: false });

			/**
			 * 提交一次会话级选择。
			 *
			 * @param personaId - 人设 id；null 表示「本会话不启用人设」（配合 options.none）。
			 * @param options - `{ none: true }` 时提交 none 而不是 personaId。
			 */
			const pick = (personaId, options) => {
				const none = options !== undefined && options.none === true;
				const current = pickerStore.get();
				setBusy(true);
				setFailure(null);
				const withScope = current.cwd === undefined ? {} : { cwd: current.cwd };
				// 从新会话起始页选人设时，如果生效范围还停在「全局」/「工作区」，
				// 会话级选择会被 resolvePersona 直接忽略——用户点了却毫无反应。
				// 所以先把它拔到「会话」档（其它会话仍回落工作区 / 全局，不受影响）。
				// 「不启用」同样需要这一档，否则哨兵根本不会被读到。
				const promote = current.origin === "hero"
					&& current.value !== null && current.value !== undefined
					&& current.value.mode !== "session";
				const scoped = promote
					? postMutate({ action: "set-mode", mode: "session", sessionId: current.sessionId, ...withScope })
					: Promise.resolve(null);
				const submission = none
					? { action: "set-session-persona", none: true, sessionId: current.sessionId, ...withScope }
					: { action: "set-session-persona", personaId, sessionId: current.sessionId, ...withScope };
				scoped
					.then(() => postMutate(submission))
					.then((value) => {
						if (typeof current.onUpdated === "function") current.onUpdated(value);
						close();
					})
					.catch((error) => setFailure(error && error.message ? error.message : String(error)))
					.then(() => setBusy(false));
			};

			if (state.open !== true) return null;
			const value = state.value;
			if (value === null || value === undefined) return null;

			// 会话档下不再提供「跟随全局 / 跟随工作区」——那个动作的语义是「清掉会话选择」，
			// 而用户在这个位置真正想表达的是「本会话不要人设」。两者不是一回事：
			// 清除会回落到工作区 / 全局并继续注入，而「不启用」是终止符。
			// 所以第一项固定是「此会话不启用人设」，高亮由 sessionOff 决定。
			const sessionOff = value.sessionOff === true;

			const options = [
				jsxRuntime.jsx("button", {
					type: "button",
					style: sessionOff ? styles.pickerItemActive : styles.pickerItem,
					className: `${CLS}-item`,
					// 供样式表区分「已选中」与「正悬停」：选中项不再放大。
					"data-active": sessionOff ? "true" : "false",
					disabled: busy,
					// 这一句有 17 个字，窄屏下必然被省略号截断（issue #7），
					// 所以 title 必须给全文，否则用户看不全这个选项到底是什么意思。
					title: t("pickerNoPersona"),
					onClick: () => pick(null, { none: true }),
					children: t("pickerNoPersona"),
				}, "picker-none"),
			];
			for (const persona of value.personas) {
				if (persona.enabled !== true) continue;
				const shownName = displayNameOf(t, persona) || persona.name;
				options.push(jsxRuntime.jsx("button", {
					type: "button",
					style: persona.sessionPick === true ? styles.pickerItemActive : styles.pickerItem,
					className: `${CLS}-item`,
					"data-active": persona.sessionPick === true ? "true" : "false",
					disabled: busy,
					// 长人设名同理：截断了也要能看全。
					title: shownName,
					onClick: () => pick(persona.id),
					children: shownName,
				}, `picker-${persona.id}`));
			}

			return jsxRuntime.jsx("div", {
				style: styles.modalBackdrop,
				// 点背景空白处关闭；点面板内部不关（事件目标不是背景本身）。
				onClick: (event) => {
					if (event && event.target === event.currentTarget) close();
				},
				children: jsxRuntime.jsxs("div", {
					style: styles.modalPanel,
					role: "dialog",
					"aria-modal": true,
					"aria-label": t("pickerTitle"),
					children: [
						jsxRuntime.jsx("h3", { style: styles.modalHeading, children: t("pickerTitle") }, "picker-title"),
						jsxRuntime.jsx("p", { style: styles.hint, children: t("pickerHint") }, "picker-hint"),
						failure === null
							? null
							: jsxRuntime.jsx("p", { style: styles.messageError, children: failure }, "picker-failure"),
						jsxRuntime.jsx("div", { style: styles.modalList, children: options }, "picker-list"),
						jsxRuntime.jsx("button", {
							type: "button",
							style: styles.button,

							className: `${CLS}-btn`,
							onClick: close,
							children: t("cancel"),
						}, "picker-cancel"),
					],
				}, "picker-panel"),
			});
		}

		/**
		 * 输入框上方的「人设」小条。
		 *
		 * - 左边显示当前对这个会话生效的人设名；
		 * - 右边是生效范围开关：全局 / 会话（工作区档在设置页里配）；
		 * - 会话档下点人设名，弹出**居中浮层**挑选——不再就地把一排按钮铺开。
		 *
		 * 会话 id 由插槽的 props 直接给出（`props.sessionId`）。
		 * 插件停用时显示一行提示；读不到宿主时安静地不渲染。
		 */
		function PersonaDock(props) {
			const t = typeof props?.t === "function" ? props.t : (key) => key;
			const sessionId = typeof props?.sessionId === "string" ? props.sessionId : "";
			// 工作目录：DSH 自己的 ConversationContent 也是这么取的——`useSessions` 是插槽给的
			// 选择器 hook，`snapshot.byId[sessionId].cwd` 就是本会话的工作区。
			// 测试环境或旧宿主没有这个 hook 时安全退化成 undefined（工作区那一档会提示未知）。
			const useSessions = props?.useSessions;
			const cwd = typeof useSessions === "function"
				? useSessions((snapshot) => {
					const entry = sessionId.length > 0 && snapshot && snapshot.byId ? snapshot.byId[sessionId] : undefined;
					return entry && typeof entry.cwd === "string" && entry.cwd.length > 0 ? entry.cwd : undefined;
				})
				: undefined;
			const [state, setState] = react.useState({ status: "loading" });
			const [busy, setBusy] = react.useState(false);
			// 提交失败时的提示。以前这里是 `.catch(() => {})`，失败被整个吞掉，
			// 用户点了没反应也看不出是「请求失败」还是「点没生效」——设置页会显示错误，
			// 同一个插件不该有两套待遇。
			const [failure, setFailure] = react.useState(null);

			const load = react.useCallback(() => {
				fetchStatus(sessionId, cwd)
					.then((value) => setState({ status: "ready", value }))
					.catch(() => setState({ status: "error" }));
			}, [sessionId, cwd]);

			react.useEffect(() => { load(); }, [load]);

			/** `closeAfter` 为真时，提交成功后收起切换器（选完人设就关）。 */
			const run = react.useCallback((payload) => {
				setBusy(true);
				setFailure(null);
				postMutate({ ...payload, sessionId, ...(cwd === undefined ? {} : { cwd }) })
					.then((value) => setState({ status: "ready", value }))
					.catch((error) => {
						// 出错时把宿主给的原因显示出来（例如缺少 cwd）。
						setFailure(error && error.message ? error.message : String(error));
					})
					.then(() => setBusy(false));
			}, [sessionId, cwd]);

			if (state.status === "error") {
				return jsxRuntime.jsx("div", { style: styles.dock, children: t("dockFailed") });
			}
			if (state.status !== "ready") return null;

			const value = state.value;
			if (value.enabled !== true) {
				return jsxRuntime.jsx("div", { style: styles.dock, children: t("dockOff") });
			}

			const mode = value.mode;
			// 会话 / 工作区选择只带 { id, name }，所以按 id 回查列表里的那条，才能拿到 builtin
			// 标记并据此取本地化的名字。
			const entryOf = (id) => (Array.isArray(value.personas) ? value.personas : [])
				.find((persona) => persona.id === id);
			const shownNameOf = (id, fallback) => {
				const entry = id === undefined || id === null ? undefined : entryOf(id);
				if (entry !== undefined) return displayNameOf(t, entry) || fallback || "";
				return fallback || "";
			};

			// 显示「最终生效的是谁」：宿主用与提示词注入同一个 resolvePersona 算出来，
			// 所以这里显示的永远是真正被注入的那一条，不会和实现漂移。
			const effective = value.effective;
			// 本会话被明确设成「不启用人设」：此时 effective 是 null，但**不能**退回显示
			// 全局人设名——那会让用户以为人设还在生效，跟他刚才的选择正好相反。
			const sessionOff = mode === "session" && value.sessionOff === true;
			let shown;
			if (sessionOff) {
				shown = t("pickerNoPersona");
			} else {
				shown = effective === null || effective === undefined
					? shownNameOf(value.current, value.currentName)
					: shownNameOf(effective.id, effective.name);
			}
			if (sessionOff) {
				// 已经是「不启用」，不再追加「跟随全局」之类的来源提示。
			} else if (mode === "session" && effective !== null && effective !== undefined) {
				if (effective.source === "global") shown = `${shown} · ${t("dockFollowGlobal")}`;
				else if (effective.source === "workspace") shown = `${shown} · ${t("dockFollowWorkspace")}`;
			} else if (mode === "workspace") {
				// 工作区档的规则在设置页里配，小条只如实说明「现在走的是工作区规则」。
				shown = `${shown} · ${t("scopeWorkspace")}`;
			}

			const parts = [jsxRuntime.jsx("span", { children: "🐟" }, "fish")];

			// 会话模式下，人设名就是「打开选择浮层」的按钮（浮层居中，不再就地铺按钮）。
			// 名字可能很长（issue #7）：视觉上截断成省略号，但 `title` 里给全文，
			// 鼠标一停就能看到完整名字，不会因为截断而丢失信息。
			if (mode === "session") {
				parts.push(jsxRuntime.jsx("button", {
					type: "button",
					style: styles.dockNameButton,
					className: `${CLS}-chip`,
					disabled: busy,
					title: `${t("dockSwitch")}${separatorOf(t)}${shown}`,
					"aria-haspopup": "dialog",
					onClick: () => pickerStore.set({
						open: true,
						sessionId,
						cwd,
						value,
						// 浮层选完后把新快照回填，小条立刻显示新的人设名。
						onUpdated: (next) => setState({ status: "ready", value: next }),
					}),
					children: `${shown} ▾`,
				}, "name-toggle"));
			} else {
				parts.push(jsxRuntime.jsx("span", { style: styles.dockName, title: shown, children: shown }, "name"));
			}

			// 小条只放「全局 / 会话」两档。**工作区档不在这里**——它要按目录逐条挑人设，
			// 那件事在设置页做（工作区清单 + 每行一个选择框），小条塞不下也不该塞。
			for (const option of ["global", "session"]) {
				parts.push(jsxRuntime.jsx("button", {
					type: "button",
					style: mode === option ? styles.dockChipActive : styles.dockChip,
					className: `${CLS}-chip`,
					disabled: busy,
					title: t("scopeHint"),
					onClick: () => run({ action: "set-mode", mode: option }),
					children: option === "global" ? t("scopeGlobal") : t("scopeSession"),
				}, `mode-${option}`));
			}

			// 失败提示：复用设置页的错误样式，让同一个插件的行为一致。
			if (failure !== null) {
				parts.push(jsxRuntime.jsx("span", {
					style: styles.messageError,
					title: failure,
					children: `${t("dockSwitchFailed")}${separatorOf(t)}${failure}`,
				}, "dock-failure"));
			}

			return jsxRuntime.jsx("div", {
				style: styles.dock,
				"data-dsh-persona-dock": value.mode,
				children: parts,
			});
		}

		/**
		 * 新会话起始页（hero）上的人设 chip。
		 *
		 * issue #2：会话开始后输入框上方有小条可以换人设，但**开始会话那一屏没有入口**，
		 * 想换个开场人设只能跑去设置页改全局。这里补上——在「工作目录」旁边挂一个 chip，
		 * 点开是同一个居中选择浮层（复用 `PersonaPickerOverlay`）。
		 *
		 * 为什么选 `conversation.hero.options`：它是 hero 那一行右侧的选项区，
		 * 与「工作目录」chip、agent preset 同排，是 DSH 给「开场前先选点什么」准备的官方位置。
		 * 该 slot 在只有 `sessionId === undefined` 时会跳过渲染，所以老宿主上不会显示半截 UI。
		 *
		 * 提交语义：hero 阶段的会话**已经有 sessionId**（它只是还没发第一条消息，
		 * 所以 `phase = hero`）。因此这里选人设走的是已有的 `set-session-persona`，
		 * 选完立刻对这条会话生效 —— 不需要等发消息，也不需要动全局设置。
		 */
		function PersonaHeroChip(props) {
			const t = typeof props?.t === "function" ? props.t : (key) => key;
			const sessionId = typeof props?.sessionId === "string" ? props.sessionId : "";
			// 与 PersonaDock 同样的取法：插槽给的 `useSessions` 选择器。
			const useSessions = props?.useSessions;
			const cwd = typeof useSessions === "function"
				? useSessions((snapshot) => {
					const entry = sessionId.length > 0 && snapshot && snapshot.byId ? snapshot.byId[sessionId] : undefined;
					return entry && typeof entry.cwd === "string" && entry.cwd.length > 0 ? entry.cwd : undefined;
				})
				: undefined;
			const [state, setState] = react.useState({ status: "loading" });

			const load = react.useCallback(() => {
				fetchStatus(sessionId, cwd)
					.then((value) => setState({ status: "ready", value }))
					.catch(() => setState({ status: "error" }));
			}, [sessionId, cwd]);

			react.useEffect(() => { load(); }, [load]);

			if (state.status === "error") {
				// 读不到宿主时安静地不渲染：开场那一屏不该因为插件而多一块红字。
				return null;
			}
			if (state.status !== "ready") return null;

			const value = state.value;
			// 插件总开关关掉时，选择器没有任何意义。
			if (value.enabled !== true) return null;

			const entryOf = (id) => (Array.isArray(value.personas) ? value.personas : [])
				.find((persona) => persona.id === id);
			const nameOf = (id, fallback) => {
				const entry = id === undefined || id === null ? undefined : entryOf(id);
				if (entry !== undefined) return displayNameOf(t, entry) || fallback || "";
				return fallback || "";
			};

			// chip 上显示「这个新会话开场会用谁」：优先已经挑过的会话人设，
			// 否则显示当前真正会注入的那一条（工作区 / 全局），与实现同源。
			const effective = value.effective;
			const picked = value.sessionPersona;
			const shownId = picked !== null && picked !== undefined
				? picked.id
				: (effective === null || effective === undefined ? null : effective.id);
			const shown = nameOf(shownId, picked === null || picked === undefined ? (value.currentName ?? "") : picked.name);
			// 当前到底有没有人设：显式关闭、或库里一条都挑不出来时都算「无」。
			// 这两种情况下不该出现「· 跟随全局」——跟着一个不存在的人设是自相矛盾的。
			const nothingToFollow = shown.length === 0;
			let suffixHint = "";
			if (!nothingToFollow && (picked === null || picked === undefined)) {
				if (effective !== null && effective !== undefined && effective.source === "workspace") {
					suffixHint = t("heroChipFollowWorkspace");
				} else if (value.mode === "session") {
					suffixHint = t("heroChipFollowGlobal");
				}
			}

			// 兜底文案分两种：真的没有人设 vs 取不到名字。
			// 以前统一写「无可用人设」，容易被读成「人设库是空的」——
			// 而实际的常见情况是「全局关掉了、这个工作区又没配」。
			const label = shown.length > 0
				? shown
				: (value.globalOff === true ? t("heroChipNone") : t("heroChipDisabled"));
			// 固定文案与可变部分分开：前缀「人设：」和后缀「· 跟随全局」都不可收缩，
			// 只有中间的人设名能收缩并省略。把「人设」和「：」合成一段，
			// 少一个 flex 子项，也给名字多留几十像素。
			const prefixText = `${t("heroChip")}${separatorOf(t)}`;
			const suffixText = suffixHint.length > 0 ? `· ${suffixHint}` : "";

			return jsxRuntime.jsx("button", {
				type: "button",
				style: styles.heroChipButton,
				className: `${CLS}-pill`,
				// 名字被截断时，title 要能看全——但也不能丢掉「点这里是干嘛的」，
				// 所以把动作说明和人设名一起放进去。
				title: `${t("heroChipTitle")}${separatorOf(t)}${label}`,
				"aria-haspopup": "dialog",
				"data-dsh-persona-hero": shownId === null ? "none" : shownId,
				onClick: () => pickerStore.set({
					open: true,
					sessionId,
					cwd,
					value,
					origin: "hero",
					// 选完把新快照回填，chip 上的名字立刻跟着变。
					onUpdated: (next) => setState({ status: "ready", value: next }),
				}),
				children: [
					jsxRuntime.jsx("span", { style: styles.heroChipFixed, children: "🐟" }, "hero-fish"),
					jsxRuntime.jsx("span", { style: styles.heroChipFixed, children: prefixText }, "hero-prefix"),
					jsxRuntime.jsx("span", { style: styles.heroChipLabel, children: label }, "hero-label"),
					suffixText.length > 0
						? jsxRuntime.jsx("span", { style: styles.heroChipFixed, children: suffixText }, "hero-suffix")
						: null,
					jsxRuntime.jsx("span", { style: styles.heroChipFixed, children: "▾" }, "hero-chevron"),
				],
			});
		}

		/** 需要的客户端服务：slot 注册表与本地化字典。 */
		const inject = ["slots", "locale"];

		/**
		 * 把「人设」注册成设置页里的一个小节。
		 * @param ctx - 浏览器插件上下文。
		 */
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-persona-dafeiyu: dictionaries");
			// 悬停 / 按下 / 键盘聚焦的样式表。内联样式命中不到伪类，必须走样式表
			// （issue #6 评论：暗色下按钮没有 hover 反馈）。卸载时一起撤掉。
			ctx.effect(() => injectHoverStyles(), "dsh-persona-dafeiyu: hover styles");
			const t = ctx.locale.bind(NS);
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: SECTION_ID,
				order: 18,
				label: () => t("nav"),
				locale: NS,
				inject: () => ({ t }),
			}, PersonaSettingsSection));

			// 输入框上方的「人设」小条：当前人设 + 全局/会话开关。
			ctx.slots.inject("conversation.composer.dock", () => ctx.slots.register({
				name: "conversation.composer.dock",
				id: "persona-dock",
				order: 60,
				locale: NS,
				inject: () => ({ t }),
			}, PersonaDock));

			// 会话人设选择浮层：注册在 DSH 的整帧浮层插槽上，居中显示，
			// 不往 document.body 追加 DOM。
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "persona-picker",
				order: 50,
				locale: NS,
				inject: () => ({ t }),
			}, PersonaPickerOverlay));

			// 新会话起始页（hero）的人设 chip：issue #2 要的「开始会话前也能挑人设」。
			// `conversation.hero.options` 是 hero 那一行右侧的选项区，与「工作目录」chip 同排。
			// 老宿主没有这个 slot 时，`slots.inject` 不会调用回调，插件在别处照常工作。
			ctx.slots.inject("conversation.hero.options", () => ctx.slots.register({
				name: "conversation.hero.options",
				id: "persona-hero",
				order: 40,
				locale: NS,
				inject: () => ({ t }),
			}, PersonaHeroChip));
		}

		exports.apply = apply;
		exports.inject = inject;
		exports.NS = NS;
		exports.SECTION_ID = SECTION_ID;
		exports.PersonaSettingsSection = PersonaSettingsSection;
		exports.PersonaDock = PersonaDock;
		exports.PersonaPickerOverlay = PersonaPickerOverlay;
		exports.PersonaHeroChip = PersonaHeroChip;
		return module.exports;
	},
});
