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
			pickerHint: "只影响当前会话；清掉选择会回落到工作区或全局。",
			dockOff: "人设已停用",
			dockFailed: "读不到状态",
			dockSwitchFailed: "切换失败",
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
			pickerHint: "Affects this session only; clearing the pick falls back to the workspace or global persona.",
			dockOff: "Persona disabled",
			dockFailed: "Cannot read status",
			dockSwitchFailed: "Switch failed",
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
			personaName: { fontWeight: 600 },
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
			messageOk: { fontSize: "13px", margin: 0, color: "var(--dsw-alias-state-success-primary, #389e0d)" },
			messageError: { fontSize: "13px", margin: 0, color: "var(--dsw-alias-state-error-primary, #d4380d)" },
			dock: {
				display: "flex",
				alignItems: "center",
				flexWrap: "wrap",
				gap: "6px",
				fontSize: "11px",
				color: "var(--dsw-alias-label-tertiary)",
			},
			dockName: { fontWeight: 600, color: "var(--dsw-alias-label-primary)" },
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
				background: "rgba(0, 0, 0, 0.35)",
			},
			modalPanel: {
				width: "min(420px, 100%)",
				maxHeight: "min(70vh, 560px)",
				overflowY: "auto",
				padding: "16px",
				borderRadius: "14px",
				background: "var(--dsw-alias-bg-layer, #fff)",
				color: "var(--dsw-alias-label-primary, #111)",
				boxShadow: "0 12px 40px rgba(0, 0, 0, 0.28)",
				display: "flex",
				flexDirection: "column",
				gap: "10px",
			},
			modalHeading: { margin: 0, fontSize: "14px", fontWeight: 600 },
			modalList: { display: "flex", flexDirection: "column", gap: "6px" },
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
			},
		};

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
				const currentShownName = currentEntry === undefined
					? (value.currentName || "—")
					: (displayNameOf(t, currentEntry) || value.currentName || "—");

				body.push(jsxRuntime.jsx("h3", { style: styles.subHeading, children: t("currentTitle") }, "current-title"));
				body.push(jsxRuntime.jsxs("div", {
					style: styles.card,
					children: [
						jsxRuntime.jsx("div", { style: styles.key, children: t("name") }, "k-name"),
						jsxRuntime.jsxs("div", {
							style: styles.value,
							children: [
								currentShownName,
								" ",
								jsxRuntime.jsx("span", { style: styles.badge, children: sourceLabel(value.source) }, "badge"),
							],
						}, "v-name"),
						jsxRuntime.jsx("div", { style: styles.key, children: t("status") }, "k-status"),
						jsxRuntime.jsx("div", {
							style: styles.value,
							children: !value.enabled
								? t("disabledByConfig")
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
						style: value.mode === option ? styles.primaryButton : styles.button,
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
										jsxRuntime.jsx("span", { style: styles.personaName, children: displayNameOf(t, persona) || persona.name }, "name"),
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
											disabled: busy,
											onClick: () => run({ action: "set-current", id: persona.id }),
											children: t("setCurrent"),
										}, "set-current"),
										jsxRuntime.jsx("button", {
											type: "button",
											style: styles.button,
											disabled: busy,
											onClick: () => run({ action: "set-enabled", id: persona.id, enabled: !persona.enabled }),
											children: persona.enabled ? t("disable") : t("enable"),
										}, "toggle"),
										importable(persona) ? jsxRuntime.jsx("button", {
											type: "button",
											style: styles.button,
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
														disabled: busy,
														onClick: () => run({ action: "remove", id: persona.id }),
														children: t("removeConfirm"),
													}, "confirm"),
													jsxRuntime.jsx("button", {
														type: "button",
														style: styles.button,
														disabled: busy,
														onClick: () => setConfirmId(null),
														children: t("cancel"),
													}, "cancel"),
												],
											}, "confirm-box")
											: jsxRuntime.jsx("button", {
												type: "button",
												style: styles.button,
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

			const pick = (personaId) => {
				const current = pickerStore.get();
				setBusy(true);
				setFailure(null);
				postMutate({
					action: "set-session-persona",
					personaId,
					sessionId: current.sessionId,
					...(current.cwd === undefined ? {} : { cwd: current.cwd }),
				})
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

			// 清掉会话选择后落到哪一层，取决于这个工作区有没有自己的选择。
			const fallsBackToWorkspace = value.workspace !== null
				&& value.workspace !== undefined
				&& value.workspace.persona !== null;

			const options = [
				jsxRuntime.jsx("button", {
					type: "button",
					style: value.sessionPersona === null ? styles.pickerItemActive : styles.pickerItem,
					disabled: busy,
					onClick: () => pick(null),
					children: t(fallsBackToWorkspace ? "dockFollowWorkspace" : "dockFollowGlobal"),
				}, "picker-follow"),
			];
			for (const persona of value.personas) {
				if (persona.enabled !== true) continue;
				options.push(jsxRuntime.jsx("button", {
					type: "button",
					style: persona.sessionPick === true ? styles.pickerItemActive : styles.pickerItem,
					disabled: busy,
					onClick: () => pick(persona.id),
					children: displayNameOf(t, persona) || persona.name,
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
			let shown = effective === null || effective === undefined
				? shownNameOf(value.current, value.currentName)
				: shownNameOf(effective.id, effective.name);
			if (mode === "session" && effective !== null && effective !== undefined) {
				if (effective.source === "global") shown = `${shown} · ${t("dockFollowGlobal")}`;
				else if (effective.source === "workspace") shown = `${shown} · ${t("dockFollowWorkspace")}`;
			} else if (mode === "workspace") {
				// 工作区档的规则在设置页里配，小条只如实说明「现在走的是工作区规则」。
				shown = `${shown} · ${t("scopeWorkspace")}`;
			}

			const parts = [jsxRuntime.jsx("span", { children: "🐟" }, "fish")];

			// 会话模式下，人设名就是「打开选择浮层」的按钮（浮层居中，不再就地铺按钮）。
			if (mode === "session") {
				parts.push(jsxRuntime.jsx("button", {
					type: "button",
					style: styles.dockNameButton,
					disabled: busy,
					title: t("dockSwitch"),
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
				parts.push(jsxRuntime.jsx("span", { style: styles.dockName, children: shown }, "name"));
			}

			// 小条只放「全局 / 会话」两档。**工作区档不在这里**——它要按目录逐条挑人设，
			// 那件事在设置页做（工作区清单 + 每行一个选择框），小条塞不下也不该塞。
			for (const option of ["global", "session"]) {
				parts.push(jsxRuntime.jsx("button", {
					type: "button",
					style: mode === option ? styles.dockChipActive : styles.dockChip,
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

		/** 需要的客户端服务：slot 注册表与本地化字典。 */
		const inject = ["slots", "locale"];

		/**
		 * 把「人设」注册成设置页里的一个小节。
		 * @param ctx - 浏览器插件上下文。
		 */
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-persona-dafeiyu: dictionaries");
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
		}

		exports.apply = apply;
		exports.inject = inject;
		exports.NS = NS;
		exports.SECTION_ID = SECTION_ID;
		exports.PersonaSettingsSection = PersonaSettingsSection;
		exports.PersonaDock = PersonaDock;
		exports.PersonaPickerOverlay = PersonaPickerOverlay;
		return module.exports;
	},
});
