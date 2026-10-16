/**
 * Zet Obsidian-specifieke markdown om naar gewone markdown voor export:
 * wikilinks, @-verwijzingen en interne links worden platte tekst.
 */

const WIKILINK_EMBED = /!\[\[([^\]|#]+)(?:#([^\]|]+))?(?:\|([^\]]+))?\]\]/g;
const WIKILINK = /\[\[([^\]|#]+)(?:#([^\]|]+))?(?:\|([^\]]+))?\]\]/g;
const MARKDOWN_LINK = /(?<!!)\[([^\]]*)\]\(([^)]+)\)/g;

function wikilinkDisplayText(
	path: string,
	heading: string | undefined,
	alias: string | undefined,
): string {
	if (alias) return alias;
	if (heading) return heading.replace(/-/g, " ");
	const base = path.split("/").pop() ?? path;
	return base;
}

function isInternalOrObsidianUrl(url: string): boolean {
	const trimmed = url.trim();
	if (trimmed.startsWith("#")) return true;
	if (/^obsidian:/i.test(trimmed)) return true;
	if (/^app:/i.test(trimmed)) return true;
	// Geen scheme: vaak een vault-pad of anker in de notitie.
	if (!/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return true;
	return false;
}

/** Verwijder block-ref suffix (^id) uit zichtbare tekst. */
function stripBlockRef(text: string): string {
	return text.replace(/\s*\^[a-zA-Z0-9-]+\s*$/g, "").trim();
}

export function transformMarkdownForExport(source: string): string {
	let md = source;

	md = md.replace(WIKILINK_EMBED, (_match, path, heading, alias) => {
		const label = wikilinkDisplayText(path, heading, alias);
		return stripBlockRef(label);
	});

	md = md.replace(WIKILINK, (_match, path, heading, alias) => {
		const label = wikilinkDisplayText(path, heading, alias);
		return stripBlockRef(label);
	});

	md = md.replace(MARKDOWN_LINK, (match, text: string, url: string) => {
		if (isInternalOrObsidianUrl(url)) {
			return text || url;
		}
		return match;
	});

	return md;
}
