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
			title: "人设",
			intro: "这里管理注入系统提示词的人设：内置大肥鱼与阿茶，也可以导入自己的。切换后下一个请求立即生效，不需要重启。",
			loading: "读取中…",
			refresh: "刷新",
			currentTitle: "当前生效",
			status: "状态",
			enabled: "已启用",
			disabled: "已停用",
			name: "人设名",
			source: "来源",
			section: "段落位置",
			chars: "字数",
			description: "简介",
			fullText: "查看全文",
			collapse: "收起全文",
			fullTextLoading: "读取全文…",
			fullTextFailed: "全文读取失败",
			fullTextInList: "这是你自己导入的人设，完整提示词见下方列表的「查看全文」。",
			builtinNote: "内置人设的提示词由插件维护（正文不在此展示）。",
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
			configHint: "config 里的 prefix / personaFile 会作为一条「config」人设出现在列表里；插件总开关仍是「插件」页里的 enabled。",
			storeHint: "人设库文件",
			scopeGlobal: "全局",
			scopeSession: "会话",
			scopeHint: "全局 = 所有会话共用；会话 = 每个会话各挑一条",
			dockFollow: "跟随全局",
			dockSwitch: "切换本会话的人设",
			dockOff: "人设已停用",
			dockFailed: "读不到状态",
		};

		const en = {
			nav: "Dafeiyu",
			title: "Personas",
			intro: "Manage the personas injected into the system prompt: the built-in Dafeiyu and Acha, plus any you import. Switching takes effect on the next request — no restart.",
			loading: "Loading…",
			refresh: "Refresh",
			currentTitle: "Currently active",
			status: "Status",
			enabled: "Enabled",
			disabled: "Disabled",
			name: "Persona",
			source: "Source",
			section: "Section order",
			chars: "Characters",
			description: "About",
			fullText: "Show full text",
			collapse: "Collapse",
			fullTextLoading: "Loading text…",
			fullTextFailed: "Failed to load the text",
			fullTextInList: "This is a persona you imported — read the full text in the list below.",
			builtinNote: "Built-in persona prompts are maintained by the plugin (not shown here).",
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
			configHint: "A prefix / personaFile in the plugin config shows up as one \"config\" persona; the master switch stays the enabled field on the Plugins page.",
			storeHint: "Persona library file",
			scopeGlobal: "Global",
			scopeSession: "Session",
			scopeHint: "Global = one persona for every session; Session = pick one per session",
			dockFollow: "Follow global",
			dockSwitch: "Switch this session's persona",
			dockOff: "Persona disabled",
			dockFailed: "Cannot read status",
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
			dockPicker: {
				display: "inline-flex",
				alignItems: "center",
				flexWrap: "wrap",
				gap: "4px",
				paddingLeft: "8px",
				borderLeft: "1px solid var(--dsw-alias-border-l2)",
			},
		};

		/** 一次状态读取。带上 sessionId 时，宿主会额外给出该会话的视角。 */
		function fetchStatus(sessionId) {
			if (typeof fetch !== "function") return Promise.reject(new Error("fetch unavailable"));
			const query = typeof sessionId === "string" && sessionId.length > 0
				? `?sessionId=${encodeURIComponent(sessionId)}`
				: "";
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

		/** 按需读取一条人设的完整正文（内置人设界面不展示，但接口本身照样给）。 */
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

			const run = react.useCallback((payload) => {
				setBusy(true);
				setMessage(null);
				postMutate(payload)
					.then((value) => {
						setState({ status: "ready", value });
						setMessage({ kind: "ok", text: t("done") });
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
				body.push(jsxRuntime.jsx("p", { style: styles.messageError, children: `${t("failed")}：${state.message}` }, "error"));
				body.push(jsxRuntime.jsx("p", { style: styles.hint, children: t("failedHint") }, "error-hint"));
			} else {
				const value = state.value;

				body.push(jsxRuntime.jsx("h3", { style: styles.subHeading, children: t("currentTitle") }, "current-title"));
				body.push(jsxRuntime.jsxs("div", {
					style: styles.card,
					children: [
						jsxRuntime.jsx("div", { style: styles.key, children: t("name") }, "k-name"),
						jsxRuntime.jsxs("div", {
							style: styles.value,
							children: [
								value.currentName || "—",
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
						jsxRuntime.jsx("div", { style: styles.key, children: t("storeHint") }, "k-store"),
						jsxRuntime.jsx("div", { style: styles.value, children: value.storePath || "—" }, "v-store"),
					],
				}, "card"));
				const currentEntry = value.personas.find((persona) => persona.current === true);
				if (currentEntry && currentEntry.description) {
					body.push(jsxRuntime.jsx("p", {
						style: styles.hint,
						children: `${t("description")}：${currentEntry.description}`,
					}, "current-description"));
				} else if (currentEntry) {
					body.push(jsxRuntime.jsx("p", { style: styles.hint, children: t("fullTextInList") }, "current-fulltext-hint"));
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
										jsxRuntime.jsx("span", { style: styles.personaName, children: persona.name }, "name"),
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

						// 内置人设：只给简介（正文由插件维护，界面不展示）。
						if (persona.builtin === true) {
							rows.push(jsxRuntime.jsx("p", {
								style: styles.hint,
								children: `${t("description")}：${persona.description || t("builtinNote")}`,
							}, "builtin-description"));
						} else {
							// 自导入 / config 人设：可查看完整提示词。
							const expanded = expandedId === persona.id;
							const body = personaTexts[persona.id];
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
									textBusyId === persona.id
										? jsxRuntime.jsx("span", { style: styles.hint, children: t("fullTextLoading") }, "text-loading")
										: null,
									textFailId === persona.id
										? jsxRuntime.jsx("span", { style: styles.messageError, children: t("fullTextFailed") }, "text-failed")
										: null,
								],
							}, "full-text-actions"));
							if (expanded && typeof body === "string") {
								rows.push(jsxRuntime.jsx("pre", { style: styles.preview, children: body }, "full-text"));
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
											run({ action: "rename", id: persona.id, name: renameValue });
											setRenameId(null);
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
										run({ action: "import", name, text });
										setName("");
										setText("");
										setPicked("");
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

		/**
		 * 输入框上方的「人设」小条。
		 *
		 * - 左边显示当前对这个会话生效的人设名；
		 * - 中间是生效范围开关：全局 / 会话；
		 * - 选「会话」后，右边给出一排「本会话用哪条」——选项全部来自设置里已导入的人设库，
		 *   第一项是「跟随全局」（清除本会话的选择）。
		 *
		 * 会话 id 由插槽的 props 直接给出（`props.sessionId`）。
		 * 插件停用时显示一行提示；读不到宿主时安静地不渲染。
		 */
		function PersonaDock(props) {
			const t = typeof props?.t === "function" ? props.t : (key) => key;
			const sessionId = typeof props?.sessionId === "string" ? props.sessionId : "";
			const [state, setState] = react.useState({ status: "loading" });
			const [busy, setBusy] = react.useState(false);
			// 切换器默认收起：点一下人设名才展开，选完立刻收起。
			const [open, setOpen] = react.useState(false);

			const load = react.useCallback(() => {
				fetchStatus(sessionId)
					.then((value) => setState({ status: "ready", value }))
					.catch(() => setState({ status: "error" }));
			}, [sessionId]);

			react.useEffect(() => { load(); }, [load]);

			/** `closeAfter` 为真时，提交成功后收起切换器（选完人设就关）。 */
			const run = react.useCallback((payload, closeAfter) => {
				setBusy(true);
				postMutate({ ...payload, sessionId })
					.then((value) => {
						setState({ status: "ready", value });
						if (closeAfter === true) setOpen(false);
					})
					.catch(() => {})
					.then(() => setBusy(false));
			}, [sessionId]);

			if (state.status === "error") {
				return jsxRuntime.jsx("div", { style: styles.dock, children: t("dockFailed") });
			}
			if (state.status !== "ready") return null;

			const value = state.value;
			if (value.enabled !== true) {
				return jsxRuntime.jsx("div", { style: styles.dock, children: t("dockOff") });
			}

			const sessionMode = value.mode === "session";
			const shown = sessionMode
				? (value.sessionPersona ? value.sessionPersona.name : `${value.currentName} · ${t("dockFollow")}`)
				: value.currentName;

			const parts = [jsxRuntime.jsx("span", { children: "🐟" }, "fish")];

			// 会话模式下，人设名本身就是切换器的开关（带 ▾ 提示），默认收起。
			if (sessionMode) {
				parts.push(jsxRuntime.jsx("button", {
					type: "button",
					style: styles.dockNameButton,
					disabled: busy,
					title: t("dockSwitch"),
					"aria-expanded": open,
					onClick: () => setOpen(!open),
					children: `${shown} ${open ? "▴" : "▾"}`,
				}, "name-toggle"));
			} else {
				parts.push(jsxRuntime.jsx("span", { style: styles.dockName, children: shown }, "name"));
			}

			for (const mode of ["global", "session"]) {
				parts.push(jsxRuntime.jsx("button", {
					type: "button",
					style: value.mode === mode ? styles.dockChipActive : styles.dockChip,
					disabled: busy,
					title: t("scopeHint"),
					onClick: () => {
						setOpen(false); // 换范围时一并收起，免得残留展开态
						run({ action: "set-mode", mode });
					},
					children: mode === "global" ? t("scopeGlobal") : t("scopeSession"),
				}, `mode-${mode}`));
			}

			if (sessionMode && open) {
				const options = [
					jsxRuntime.jsx("button", {
						type: "button",
						style: value.sessionPersona === null ? styles.dockChipActive : styles.dockChip,
						disabled: busy,
						onClick: () => run({ action: "set-session-persona", personaId: null }, true),
						children: t("dockFollow"),
					}, "pick-follow"),
				];
				for (const persona of value.personas) {
					if (persona.enabled !== true) continue;
					options.push(jsxRuntime.jsx("button", {
						type: "button",
						style: persona.sessionPick === true ? styles.dockChipActive : styles.dockChip,
						disabled: busy,
						onClick: () => run({ action: "set-session-persona", personaId: persona.id }, true),
						children: persona.name,
					}, `pick-${persona.id}`));
				}
				parts.push(jsxRuntime.jsx("span", { style: styles.dockPicker, children: options }, "picker"));
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

			// 输入框上方的「人设」小条：当前人设 + 全局/会话开关，会话模式下再给切换器。
			ctx.slots.inject("conversation.composer.dock", () => ctx.slots.register({
				name: "conversation.composer.dock",
				id: "persona-dock",
				order: 60,
				locale: NS,
				inject: () => ({ t }),
			}, PersonaDock));
		}

		exports.apply = apply;
		exports.inject = inject;
		exports.NS = NS;
		exports.SECTION_ID = SECTION_ID;
		exports.PersonaSettingsSection = PersonaSettingsSection;
		exports.PersonaDock = PersonaDock;
		return module.exports;
	},
});
