import { Menu, Plugin, TAbstractFile, TFile } from "obsidian";
import { exportNoteToClipboard, getActiveMarkdownFile } from "./src/exportNote";

const MENU_LABEL = "Export naar Outlook-klembord";

export default class XportPlugin extends Plugin {
	async onload(): Promise<void> {
		this.addCommand({
			id: "export-to-outlook-clipboard",
			name: "Exporteer notitie naar Outlook-klembord",
			checkCallback: (checking) => {
				const file = getActiveMarkdownFile(this.app);
				if (!file) return false;
				if (!checking) {
					void exportNoteToClipboard(this.app, file);
				}
				return true;
			},
		});

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file: TAbstractFile) => {
				if (!(file instanceof TFile) || file.extension !== "md") return;
				this.addExportMenuItem(menu, file);
			}),
		);

		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, _editor, view) => {
				const file = view.file;
				if (!file || file.extension !== "md") return;
				this.addExportMenuItem(menu, file);
			}),
		);
	}

	private addExportMenuItem(menu: Menu, file: TFile): void {
		menu.addItem((item) => {
			item.setTitle(MENU_LABEL).setIcon("clipboard-list");
			item.onClick(() => {
				void exportNoteToClipboard(this.app, file);
			});
		});
	}
}
