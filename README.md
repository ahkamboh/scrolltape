# scrolltape

**Turn any landing page into a screen-recording demo — from the terminal.**

Automated site tours with a custom cursor, smooth scroll, and zero blank opening frame. Built with Playwright + ffmpeg.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-green.svg)](https://nodejs.org)
[![Playwright](https://img.shields.io/badge/playwright-automation-2EAD33.svg)](https://playwright.dev)
[![Cursor Co-Partner](https://img.shields.io/badge/Cursor-Co--Partner-000000?style=for-the-badge&logo=cursor&logoColor=white)](https://cursor.com)

---

## Co-partner

<table>
  <tr>
    <td align="center" width="200">
      <a href="https://cursor.com">
        <img src="docs/cursor-partner.svg" alt="Cursor" width="120" />
      </a>
    </td>
    <td>
      <strong><a href="https://cursor.com">Cursor</a></strong> — Co-partner<br><br>
      scrolltape was designed, built, and shipped with <strong>Cursor</strong>, the AI code editor.
      Cursor agents drive the recording workflow, skill templates, and open-source docs for this project.<br><br>
      <a href="https://cursor.com"><img src="https://img.shields.io/badge/Download-Cursor-000000?style=flat-square&logo=cursor&logoColor=white" alt="Download Cursor" /></a>
      · <a href="PARTNERS.md">Partners</a>
    </td>
  </tr>
</table>

---

## Demo

Recording of [thinktank.sh](https://thinktank.sh/) — 3s hero hold, white pointer cursor, interactive-hero tour:

<video width="100%" autoplay loop muted playsinline controls src="docs/demo.mp4"></video>

> **Download:** [docs/demo.mp4](docs/demo.mp4)

---

## Why scrolltape?

| Problem | scrolltape fix |
|---------|----------------|
| Headless recording shows no cursor | Injects a custom SVG cursor overlay |
| First seconds are a white loading screen | Waits for full paint, then **trims** blank lead-in with ffmpeg |
| Hero widgets don't react to cursor | Syncs `page.mouse.move` with the overlay |
| Manual OBS recordings aren't repeatable | One command → same tour every time |

---

## Install

```bash
git clone https://github.com/ahkamboh/scrolltape.git
cd scrolltape
npm install
npx playwright install chromium
```

**Requirements:** Node 18+, [ffmpeg](https://ffmpeg.org), Chrome (Playwright uses system Chrome on macOS)

---

## Quick start

```bash
# Record any site (defaults: white pointer, 3s hero, standard tour)
npm run record -- --url https://thinktank.sh/

# Run the bundled demo config
npm run demo
```

Output lands in `renders/`:

```
renders/
├── thinktank-scrolltape.mp4   ← share this
└── thinktank-scrolltape.webm
```

---

## Usage

### CLI

```bash
scrolltape record --url <https://...> [options]
scrolltape record --config examples/thinktank.json
```

### Examples

```bash
# Minimal
scrolltape record -u https://thinktank.sh/

# Cute cursor + interactive hero graphic
scrolltape record -u https://thinktank.sh/ \
  --cursor cute-paw \
  --tour interactive-hero \
  --hero 3

# Portrait teaser for Reels / TikTok
scrolltape record -u https://thinktank.sh/ \
  --viewport portrait \
  --tour quick-teaser \
  --scroll fast

# Focus specific sections
scrolltape record -u https://thinktank.sh/ \
  --tour feature-focus \
  --focus how,built \
  --scroll slow
```

### Config file

```json
{
  "url": "https://thinktank.sh/",
  "cursor": "white-pointer",
  "heroHoldSec": 3,
  "tour": "interactive-hero",
  "viewport": "landscape",
  "scrollSpeed": "normal",
  "sectionIds": ["hero", "proof", "why", "how", "built", "opensource", "quickstart", "cta"],
  "outputName": "thinktank-scrolltape"
}
```

See [`examples/thinktank.json`](examples/thinktank.json) and [`config.schema.json`](config.schema.json).

---

## Cursors

| Name | Preview | Best for |
|------|---------|----------|
| `white-pointer` | mac-style arrow, white + dark stroke | Light backgrounds (default) |
| `mac-hand` | Open hand | Drag / interactive demos |
| `cute-paw` | Rounded paw | Playful / brand-friendly |
| `brand-dot` | Circle + accent dot | Minimal product tours |

```bash
scrolltape record -u https://example.com --cursor cute-paw
```

---

## Tour styles

| Style | What it does |
|-------|----------------|
| `standard` | Hero hold → scroll every section → brief dwell |
| `interactive-hero` | Extra cursor time on hover widgets / hero graphics |
| `hero-only` | Hero + cursor, no scroll |
| `feature-focus` | Jump to `--focus` sections, longer dwell |
| `quick-teaser` | ~15s total, fast scroll, short hero |
| `deep-dive` | Slow scroll, long dwell on each section |

---

## All options

| Flag | Description | Default |
|------|-------------|---------|
| `-u, --url` | Site URL | required |
| `-c, --config` | JSON config file | — |
| `--cursor` | `white-pointer` · `mac-hand` · `cute-paw` · `brand-dot` | `white-pointer` |
| `--hero` | Hero hold (seconds) | `3` |
| `--tour` | Tour preset (see above) | `standard` |
| `--viewport` | `landscape` · `portrait` · `square` | `landscape` |
| `--scroll` | `slow` · `normal` · `fast` | `normal` |
| `--focus` | Comma-separated section ids | all |
| `-o, --output` | Output filename base | domain name |
| `--out-dir` | Output folder | `renders` |

**Viewports:** landscape `1920×1080` · portrait `1080×1920` · square `1080×1080`

---

## How it works

```
 URL ──► Playwright (headless Chrome + recordVideo)
              │
              ├─ waitForPageReady (h1, fonts, painted background)
              ├─ inject custom cursor (hide native cursor)
              ├─ hero hold + page.mouse.move (hover effects work)
              ├─ smooth scroll through sections
              └─ save raw WebM
                    │
                    ▼
              ffmpeg trim blank lead-in
                    │
                    ▼
              renders/*.mp4 + *.webm
```

1. **Record** starts immediately — blank frames during load are expected  
2. **Wait** until the real landing page is painted (not white)  
3. **Animate** cursor + scroll only after the page is ready  
4. **Trim** the load-time blank section from the final export  

---

## AI agents

Paste this to any coding agent:

```
Record https://example.com — use scrolltape
cursor: white-pointer
tour: interactive-hero
hero: 3s
```

More templates in [`PROMPT.md`](PROMPT.md).

---

## Project structure

```
scrolltape/
├── bin/scrolltape.mjs      CLI entry
├── lib/
│   ├── record.mjs          Recording pipeline
│   ├── config.mjs          Args + config merge
│   ├── cursors.mjs         Cursor injection
│   ├── tours.mjs           Tour presets + scroll paths
│   └── page-ready.mjs      Paint detection
├── cursors/                SVG cursor assets
├── examples/               Sample configs
└── docs/demo.mp4           README demo video
```

---

## Roadmap

- [ ] `npx scrolltape` without clone
- [ ] Custom cursor from prompt / SVG file
- [ ] Click-to-navigate steps
- [ ] Voiceover + caption track

---

## Contributing

PRs welcome. Run `npm run demo` before submitting to verify the pipeline still works.

---

## License

[MIT](LICENSE) © [ahkamboh](https://github.com/ahkamboh) · Co-partner: [Cursor](https://cursor.com)
