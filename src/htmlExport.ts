import { App, Component, MarkdownRenderer } from "obsidian";
import { transformMarkdownForExport } from "./markdownTransform";

function unwrapAnchor(anchor: HTMLAnchorElement): void {
	const parent = anchor.parentNode;
	if (!parent) return;
	while (anchor.firstChild) {
		parent.insertBefore(anchor.firstChild, anchor);
	}
	parent.removeChild(anchor);
}

function shouldUnwrapLink(href: string): boolean {
	if (!href) return true;
	if (href.startsWith("#")) return true;
	if (/^obsidian:/i.test(href)) return true;
	if (/^app:/i.test(href)) return true;
	return false;
}

function stripRemainingInternalLinks(root: HTMLElement): void {
	root.querySelectorAll("a[href]").forEach((node) => {
		const anchor = node as HTMLAnchorElement;
		if (shouldUnwrapLink(anchor.getAttribute("href") ?? "")) {
			unwrapAnchor(anchor);
		}
	});
}

/** Outlook verwacht vaak een volledig HTML-fragment met meta charset. */
export function wrapHtmlForOutlook(bodyInnerHtml: string): string {
	return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${bodyInnerHtml}</body></html>`;
}

export async function noteToOutlookHtml(
	app: App,
	rawMarkdown: string,
	sourcePath: string,
): Promise<{ htmlDocument: string; htmlFragment: string; plainText: string }> {
	const markdown = transformMarkdownForExport(rawMarkdown);
	const container = document.createElement("div");
	container.className = "xport-export-root";
	container.style.position = "absolute";
	container.style.left = "-9999px";
	document.body.appendChild(container);

	const component = new Component();
	component.load();

	try {
		await MarkdownRenderer.render(
			app,
			markdown,
			container,
			sourcePath,
			component,
		);
		stripRemainingInternalLinks(container);
		const htmlFragment = container.innerHTML;
		const plainText = container.innerText.replace(/\r\n/g, "\n");
		const htmlDocument = wrapHtmlForOutlook(htmlFragment);
		return { htmlDocument, htmlFragment, plainText };
	} finally {
		component.unload();
		container.remove();
	}
}
