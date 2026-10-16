import { App, Notice, TFile } from "obsidian";
import { copyOutlookPayload } from "./clipboard";
import { noteToOutlookHtml } from "./htmlExport";

export async function exportNoteToClipboard(
	app: App,
	file: TFile,
): Promise<void> {
	if (file.extension !== "md") {
		new Notice("Xport: alleen markdown-notities kunnen worden geëxporteerd.");
		return;
	}

	const raw = await app.vault.read(file);
	const { htmlDocument, plainText } = await noteToOutlookHtml(
		app,
		raw,
		file.path,
	);

	await copyOutlookPayload(htmlDocument, plainText);
	new Notice(`Xport: "${file.basename}" staat op het klembord (Outlook).`);
}

export function getActiveMarkdownFile(app: App): TFile | null {
	const file = app.workspace.getActiveFile();
	if (file instanceof TFile && file.extension === "md") {
		return file;
	}
	return null;
}
