# Prompts

Repo: https://github.com/ahkamboh/scrolltape

---

## One-time setup (run once per agent)

After this, skip to **Daily use** — only paste URLs.

### Cursor

```
Set up scrolltape (one time only):

Repo: https://github.com/ahkamboh/scrolltape
1. Clone to ~/scrolltape
2. npm install && npx playwright install chromium
3. Copy skills/scrolltape/SKILL.md → ~/.cursor/skills/scrolltape/SKILL.md
4. Tell me "scrolltape ready"
```

### Claude Code

```
Set up scrolltape (one time only):

Repo: https://github.com/ahkamboh/scrolltape
1. Clone to ~/scrolltape, npm install, npx playwright install chromium
2. Save skills/scrolltape/SKILL.md → ~/.claude/skills/scrolltape/SKILL.md
3. Confirm ready
```

### Codex

```
One-time scrolltape setup: https://github.com/ahkamboh/scrolltape
Clone ~/scrolltape, install deps, save skills/scrolltape/SKILL.md → ~/.codex/skills/scrolltape/SKILL.md
```

### Hermes · OpenClaw · any agent

```
One-time scrolltape setup: https://github.com/ahkamboh/scrolltape
Clone ~/scrolltape, npm install, npx playwright install chromium,
install skills/scrolltape/SKILL.md into my agent skills folder. Confirm ready.
```

---

## Daily use (every recording)

Just the link. Agent uses installed SKILL.md automatically.

### Minimal

```
scrolltape https://yoursite.com/
```

### With options

```
scrolltape https://yoursite.com/
cursor: cute-paw
tour: interactive-hero
hero: 3s
viewport: portrait
scroll: fast
```

### Natural language

```
Record a demo video for https://yoursite.com/
```
