# scrolltape

**Paste a link. Get a demo video.**

**Repo:** https://github.com/ahkamboh/scrolltape

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Cursor Co-Partner](https://img.shields.io/badge/Cursor-Co--Partner-000000?style=for-the-badge&logo=cursor&logoColor=white)](https://cursor.com)

---

## Demo

[thinktank.sh](https://thinktank.sh/) — auto-recorded with scrolltape:

<video width="100%" autoplay loop muted playsinline controls src="docs/demo.mp4"></video>

---

## One-time setup

Do this **once** per machine. After that, you only paste URLs.

### Option A — script (Cursor)

```bash
git clone https://github.com/ahkamboh/scrolltape.git ~/scrolltape
bash ~/scrolltape/scripts/setup.sh
```

### Option B — tell your agent once

Copy **one** of these setup prompts. Run it a single time. Your agent installs the skill and remembers scrolltape forever.

<details>
<summary><strong>Cursor</strong> (one-time)</summary>

```
Set up scrolltape (one time only):

Repo: https://github.com/ahkamboh/scrolltape
1. Clone to ~/scrolltape
2. npm install && npx playwright install chromium
3. Copy skills/scrolltape/SKILL.md → ~/.cursor/skills/scrolltape/SKILL.md
4. Tell me "scrolltape ready" — from now on I will only paste URLs
```

</details>

<details>
<summary><strong>Claude Code</strong> (one-time)</summary>

```
Set up scrolltape (one time only):

Repo: https://github.com/ahkamboh/scrolltape
1. Clone to ~/scrolltape, npm install, npx playwright install chromium
2. Save skills/scrolltape/SKILL.md to ~/.claude/skills/scrolltape/SKILL.md
3. Confirm ready — I will only send URLs after this
```

</details>

<details>
<summary><strong>Codex</strong> (one-time)</summary>

```
One-time scrolltape setup: https://github.com/ahkamboh/scrolltape
Clone ~/scrolltape, install deps, save skills/scrolltape/SKILL.md to ~/.codex/skills/scrolltape/SKILL.md
Confirm when done.
```

</details>

<details>
<summary><strong>Hermes · OpenClaw · any agent</strong> (one-time)</summary>

```
One-time setup for scrolltape: https://github.com/ahkamboh/scrolltape
Clone ~/scrolltape, npm install, npx playwright install chromium,
install skills/scrolltape/SKILL.md into my agent skills folder.
Confirm ready — after this I only paste site links.
```

</details>

---

## Daily use — just paste a link

After setup, **no repo link, no clone, no skill instructions needed.**

Replace the URL with your page:

```
scrolltape https://thinktank.sh/
```

```
Record demo: https://myapp.com
```

```
scrolltape https://myapp.com
cursor: cute-paw
tour: interactive-hero
hero: 3s
```

Your agent reads `SKILL.md`, runs the recorder, returns `renders/*.mp4`.

---

## Or run CLI yourself

```bash
cd ~/scrolltape
npm run record -- --url https://thinktank.sh/
```

---

## Options (optional)

| Flag | Values | Default |
|------|--------|---------|
| `--cursor` | white-pointer · mac-hand · cute-paw · brand-dot | white-pointer |
| `--hero` | seconds on hero | 3 |
| `--tour` | standard · interactive-hero · hero-only · quick-teaser · deep-dive · feature-focus | standard |
| `--viewport` | landscape · portrait · square | landscape |
| `--scroll` | slow · normal · fast | normal |

More prompts: [PROMPT.md](PROMPT.md) · Agent skill: [skills/scrolltape/SKILL.md](skills/scrolltape/SKILL.md)

---

## Co-partner

Built with **[Cursor](https://cursor.com)** · [PARTNERS.md](PARTNERS.md)

---

## License

[MIT](LICENSE) © [ahkamboh](https://github.com/ahkamboh)
