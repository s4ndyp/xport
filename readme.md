# Xport (Obsidian plugin)

Exporteer de **huidige markdown-notitie** naar het klembord, met opmaak die **Outlook** bij plakken herkent. Obsidian-verwijzingen (wikilinks, `@`-personen, locaties, `obsidian://`-links) blijven als **tekst**; de link gaat meestal niet mee. Externe `https://`-links blijven klikbaar.

## Gebruik

- **Command palette:** *Xport: Exporteer notitie naar Outlook-klembord*
- **Rechtsklik** in de editor of in het bestandsmenu op een notitie → **Export naar Outlook-klembord**
- Plak in Outlook (`Ctrl+V` / `Cmd+V`)

## Wat wordt omgezet?

| In Obsidian | Op het klembord |
|-------------|-----------------|
| `[[Persoon\|Jan]]` / `[[Notitie]]` | Alleen de zichtbare naam |
| `[@Naam](obsidian://…)` | `@Naam` |
| `[Locatie](obsidian://…)` | Locatienaam |
| `**vet**`, lijsten, koppen, tabellen | HTML via Obsidian’s renderer (Outlook-vriendelijk waar mogelijk) |
| `![[afbeelding.png]]` | Bestandsnaam als tekst (geen embed) |

## Ontwikkeling (lokaal)

```bash
npm install
npm run build
```

Kopieer `main.js`, `manifest.json` en `styles.css` naar `.obsidian/plugins/xport/` in je vault, of symlink deze map.

```bash
npm run dev   # watch mode
```

## Build via GitHub Actions

| Workflow | Wanneer | Wat |
|----------|---------|-----|
| **build.yml** | Elke push/PR naar `main` | `npm ci` + `npm run build`. Artefacten: `main.js`, manifest, CSS. |
| **release.yml** | Elke **push naar `main`** | Leest `version` uit `manifest.json`. Bestaat die release nog niet → bouwt en publiceert tag + release. |

**Nieuwe release na merge:**

1. Verhoog `version` in **`manifest.json`** en voeg dezelfde sleutel toe in **`versions.json`**.
2. Merge naar `main`.
3. GitHub Actions maakt release **`x.y.z`** als die nog niet bestaat.

`main.js` staat **niet** in git — alleen TypeScript-bron. Obsidian heeft het gebundelde `main.js` nodig; dat komt uit `npm run build` of een GitHub Release.

## Installeren met BRAT

[BRAT](https://github.com/TfTHacker/obsidian42-brat) installeert plugins rechtstreeks van GitHub.

1. Command palette → **BRAT: Add a beta plugin for testing**
2. Vul in: `s4ndyp/xport`
3. Zorg dat release **0.1.0** (of nieuwer) bestaat op GitHub.
4. **BRAT: Check for updates to all beta plugins** voor updates.

Plugin-map: `.obsidian/plugins/xport/` (id uit `manifest.json`).

## Licentie

MIT
