declare global {
	interface Window {
		require?(module: "electron"): {
			clipboard: {
				write(data: { text?: string; html?: string; bookmark?: string }): void;
			};
		};
	}
}

export async function copyOutlookPayload(
	htmlDocument: string,
	plainText: string,
): Promise<void> {
	const electron = typeof window.require === "function" ? window.require("electron") : null;
	if (electron?.clipboard) {
		electron.clipboard.write({
			text: plainText,
			html: htmlDocument,
		});
		return;
	}

	if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
		const htmlBlob = new Blob([htmlDocument], { type: "text/html" });
		const textBlob = new Blob([plainText], { type: "text/plain" });
		await navigator.clipboard.write([
			new ClipboardItem({
				"text/html": htmlBlob,
				"text/plain": textBlob,
			}),
		]);
		return;
	}

	await navigator.clipboard.writeText(plainText);
}
