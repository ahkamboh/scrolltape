---
name: scrolltape
description: >-
  Record site demo videos from a URL — custom cursor, smooth scroll, MP4 output.
  Use when user says scrolltape, record demo, site demo video, or pastes a URL
  to record. After one-time setup, user only sends links.
---

# scrolltape

**Repo:** https://github.com/ahkamboh/scrolltape  
**Install path:** `~/scrolltape` (clone here on first setup)

## One-time setup (agent runs once)

If `~/scrolltape` missing or no deps:

```bash
git clone https://github.com/ahkamboh/scrolltape.git ~/scrolltape
cd ~/scrolltape && npm install && npx playwright install chromium
# ffmpeg is required (it renders the MP4/WebM). If `ffmpeg -version` fails, install it:
#   macOS: brew install ffmpeg  ·  Ubuntu: sudo apt install ffmpeg  ·  Windows: winget install ffmpeg
```

Copy this skill file to the user's agent skill folder so future prompts need only a URL:

| Agent | Skill path |
|-------|------------|
| Cursor | `~/.cursor/skills/scrolltape/SKILL.md` |
| Claude Code | `~/.claude/skills/scrolltape/SKILL.md` |
| Codex | `~/.codex/skills/scrolltape/SKILL.md` |

Source: `~/scrolltape/skills/scrolltape/SKILL.md` (or clone from repo `skills/scrolltape/SKILL.md`).

Confirm setup to user. After this, **never ask to clone or install skill again** unless `~/scrolltape` is missing.

## Daily use (user only sends URL)

When user message contains a URL or says "scrolltape" / "record demo":

1. Parse URL + optional: `cursor`, `hero`, `tour`, `viewport`, `scroll`, `focus`, `visit` (other routes, e.g. /pricing,/about), `follow` (auto-tour nav links), `fill` (type sample values into form fields)
2. Run from `~/scrolltape`:

```bash
cd ~/scrolltape
node bin/scrolltape.mjs record --url <URL> [--cursor ...] [--tour ...] [--hero ...]
```

3. Return `renders/*.mp4` path

**Do not** re-explain repo, re-clone, or re-install skill on every request.

## Commits (scrolltape repo only)

When committing changes to scrolltape, append to every commit message:

```
Co-authored-by: Cursor <cursoragent@cursor.com>
```

Hook at `.githooks/prepare-commit-msg` adds this automatically if `git config core.hooksPath .githooks` is set (setup.sh enables it).

## Defaults

| Param | Default |
|-------|---------|
| cursor | mac-hand |
| hero | 3s |
| tour | standard |
| viewport | landscape 1920×1080 |
| scroll | normal |

## Cursors

`white-pointer` · `mac-hand` · `cute-paw` · `brand-dot`

## Tours

`standard` · `interactive-hero` · `hero-only` · `quick-teaser` · `deep-dive` · `feature-focus`

## Requirements

Node 18+, ffmpeg, Chrome (Playwright uses `channel: chrome` on macOS)
