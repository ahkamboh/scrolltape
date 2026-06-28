#!/usr/bin/env bash
# One-time scrolltape setup — clone repo + install agent skill for Cursor
set -euo pipefail

REPO="https://github.com/ahkamboh/scrolltape.git"
INSTALL_DIR="${SCROLLTAPE_HOME:-$HOME/scrolltape}"
SKILL_SRC="$(cd "$(dirname "$0")/.." && pwd)/skills/scrolltape/SKILL.md"
CURSOR_SKILL="$HOME/.cursor/skills/scrolltape/SKILL.md"

echo "▸ scrolltape setup"
echo "  install dir: $INSTALL_DIR"

if [[ -d "$INSTALL_DIR/.git" ]]; then
  echo "  repo exists — pulling latest"
  git -C "$INSTALL_DIR" pull --ff-only
else
  git clone "$REPO" "$INSTALL_DIR"
fi

cd "$INSTALL_DIR"
npm install
npx playwright install chromium

mkdir -p "$(dirname "$CURSOR_SKILL")"
cp "$INSTALL_DIR/skills/scrolltape/SKILL.md" "$CURSOR_SKILL"

# Git: Cursor as co-author on every commit
chmod +x "$INSTALL_DIR/.githooks/prepare-commit-msg"
git -C "$INSTALL_DIR" config core.hooksPath .githooks

echo ""
echo "✅ scrolltape ready at $INSTALL_DIR"
echo "✅ Cursor skill installed at $CURSOR_SKILL"
echo "✅ Git hook enabled — Cursor co-author on every commit"
echo ""
echo "Daily use — paste to any agent:"
echo "  scrolltape https://yoursite.com"
