# scrolltape — Agent prompts

Copy-paste these to any AI agent that has access to the scrolltape repo.

## Minimal

```
Record https://example.com — scrolltape
```

## Full control

```
Record https://example.com
Repo: scrolltape (github.com/ahkamboh/scrolltape)
- cursor: white-pointer
- hero: 3s
- tour: interactive-hero
- viewport: landscape
- scroll: normal
Run: scrolltape record --url ... with parsed flags. Deliver MP4 path.
```

## Cute + portrait teaser

```
Record https://example.com — scrolltape
cursor: cute-paw
tour: quick-teaser
viewport: portrait
scroll: fast
```

## Feature focus

```
Record https://example.com — scrolltape
tour: feature-focus
focus: pricing, features
cursor: mac-hand
scroll: slow
```

## Build / extend scrolltape

```
Add a new cursor preset to scrolltape: neon-ring (glowing cyan circle).
Update cursors/, lib/cursors.mjs, README cursor table, and test with thinktank.sh.
```
