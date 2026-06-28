# Contributing

## Commits

**Author:** [ahkamboh](https://github.com/ahkamboh) (`alihamzakamboh180@gmail.com`)

**Co-author:** Cursor is added automatically on every commit in this repo:

```
Co-authored-by: Cursor <cursoragent@cursor.com>
```

### Enable the hook (once per clone)

```bash
bash scripts/setup.sh
```

Or manually:

```bash
chmod +x .githooks/prepare-commit-msg
git config core.hooksPath .githooks
```

### Manual commit format

If you commit without the hook, append this to the message:

```
feat: your message here

Co-authored-by: Cursor <cursoragent@cursor.com>
```

### AI agents

When an agent commits scrolltape changes, always include the `Co-authored-by` trailer above.
