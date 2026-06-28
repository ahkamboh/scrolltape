# Agent prompts

Repo: **https://github.com/ahkamboh/scrolltape**

Replace `YOUR_SITE_URL` with your page.

---

## Universal (any agent)

```
Record a demo video for YOUR_SITE_URL using scrolltape.

Repo: https://github.com/ahkamboh/scrolltape
Clone, npm install, npx playwright install chromium, record the URL, give me the MP4.
```

---

## Cursor

```
Record a demo video for YOUR_SITE_URL using scrolltape.

Repo: https://github.com/ahkamboh/scrolltape
Clone it, npm install, npx playwright install chromium, run the recorder, and give me the MP4 path.

Defaults: white pointer cursor, 3s hero hold, smooth scroll tour.
Trim blank load screen. Deliver renders/*.mp4
```

---

## Claude Code

```
Make a site demo video for YOUR_SITE_URL.

Use scrolltape: https://github.com/ahkamboh/scrolltape
git clone, npm install, npx playwright install chromium
Run: node bin/scrolltape.mjs record --url YOUR_SITE_URL
Return the MP4 file path when done.
```

---

## Codex

```
Record YOUR_SITE_URL as an MP4 demo using the scrolltape project.

https://github.com/ahkamboh/scrolltape

Steps:
1. clone + npm install + npx playwright install chromium
2. node bin/scrolltape.mjs record --url YOUR_SITE_URL
3. return renders/*.mp4 path
```

---

## Hermes

```
I need a landing page demo video for YOUR_SITE_URL.

Tool: scrolltape (https://github.com/ahkamboh/scrolltape)
Clone the repo, install deps, record the URL, export MP4 from renders/ folder.
Use white-pointer cursor, 3 second hero hold, standard scroll tour.
```

---

## OpenClaw

```
Create a screen-recording demo of YOUR_SITE_URL.

Project: https://github.com/ahkamboh/scrolltape
Clone → npm install → npx playwright install chromium → record URL → send me the MP4.
```

---

## With custom options

```
Record YOUR_SITE_URL — scrolltape https://github.com/ahkamboh/scrolltape

cursor: cute-paw
hero: 3s
tour: interactive-hero
viewport: portrait
scroll: fast

Clone repo, run recorder, deliver MP4.
```
