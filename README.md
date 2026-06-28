# scrolltape

**Paste a link. Get a demo video.**

scrolltape is an AI-agent tool that records any site or landing page as a screen-recording demo — custom cursor, smooth scroll, MP4 out. No OBS. No manual editing.

**Repo:** https://github.com/ahkamboh/scrolltape

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Cursor Co-Partner](https://img.shields.io/badge/Cursor-Co--Partner-000000?style=for-the-badge&logo=cursor&logoColor=white)](https://cursor.com)

---

## Demo

[thinktank.sh](https://thinktank.sh/) — auto-recorded with scrolltape:

<video width="100%" autoplay loop muted playsinline controls src="docs/demo.mp4"></video>

---

## How to use (simple)

**1.** Paste a prompt below into your AI agent  
**2.** Replace `YOUR_SITE_URL` with the page you want  
**3.** Agent clones scrolltape, records, gives you `renders/*.mp4`

That's it.

---

## Copy-paste prompts

Replace `YOUR_SITE_URL` with your link (e.g. `https://thinktank.sh/`).

### Cursor

```
Record a demo video for YOUR_SITE_URL using scrolltape.

Repo: https://github.com/ahkamboh/scrolltape
Clone it, npm install, npx playwright install chromium, run the recorder, and give me the MP4 path.

Defaults: white pointer cursor, 3s hero hold, smooth scroll tour.
Trim blank load screen. Deliver renders/*.mp4
```

### Claude Code

```
Make a site demo video for YOUR_SITE_URL.

Use scrolltape: https://github.com/ahkamboh/scrolltape
git clone, npm install, npx playwright install chromium
Run: node bin/scrolltape.mjs record --url YOUR_SITE_URL
Return the MP4 file path when done.
```

### Codex

```
Record YOUR_SITE_URL as an MP4 demo using the scrolltape project.

https://github.com/ahkamboh/scrolltape

Steps:
1. clone + npm install + npx playwright install chromium
2. node bin/scrolltape.mjs record --url YOUR_SITE_URL
3. return renders/*.mp4 path
```

### Hermes

```
I need a landing page demo video for YOUR_SITE_URL.

Tool: scrolltape (https://github.com/ahkamboh/scrolltape)
Clone the repo, install deps, record the URL, export MP4 from renders/ folder.
Use white-pointer cursor, 3 second hero hold, standard scroll tour.
```

### OpenClaw

```
Create a screen-recording demo of YOUR_SITE_URL.

Project: https://github.com/ahkamboh/scrolltape
Clone → npm install → npx playwright install chromium → record URL → send me the MP4.
```

### With options (any agent)

```
Record YOUR_SITE_URL — scrolltape https://github.com/ahkamboh/scrolltape

cursor: cute-paw
hero: 3s
tour: interactive-hero
viewport: landscape
scroll: normal

Clone repo, run recorder, deliver MP4.
```

---

## Or run it yourself

```bash
git clone https://github.com/ahkamboh/scrolltape.git
cd scrolltape
npm install
npx playwright install chromium

npm run record -- --url https://thinktank.sh/
```

Output: `renders/<site>-scrolltape.mp4`

---

## Options (optional)

| Flag | Values | Default |
|------|--------|---------|
| `--cursor` | white-pointer · mac-hand · cute-paw · brand-dot | white-pointer |
| `--hero` | seconds on hero | 3 |
| `--tour` | standard · interactive-hero · hero-only · quick-teaser · deep-dive · feature-focus | standard |
| `--viewport` | landscape · portrait · square | landscape |
| `--scroll` | slow · normal · fast | normal |

```bash
scrolltape record -u https://example.com --cursor cute-paw --tour interactive-hero
```

---

## Co-partner

Built with **[Cursor](https://cursor.com)** — the AI code editor. See [PARTNERS.md](PARTNERS.md).

---

## License

[MIT](LICENSE) © [ahkamboh](https://github.com/ahkamboh)
