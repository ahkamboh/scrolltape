import { chromium } from "playwright";
import { mkdir, rename, readdir } from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { getCursorMarkup, buildCursorInject } from "./cursors.mjs";
import { waitForPageReady, sleep } from "./page-ready.mjs";
import { heroPath, getSectionOffsets, buildScrollStops } from "./tours.mjs";

const execFileAsync = promisify(execFile);
const FPS = 60;

async function ensureFfmpeg() {
  try {
    await execFileAsync("ffmpeg", ["-version"]);
  } catch {
    throw new Error(
      "ffmpeg not found — scrolltape needs it to render the MP4/WebM.\n" +
        "  Install it:  macOS → brew install ffmpeg  ·  Ubuntu → sudo apt install ffmpeg  ·  Windows → winget install ffmpeg"
    );
  }
}

async function launchBrowser() {
  // Prefer the system Chrome (best codecs); fall back to Playwright's bundled
  // Chromium so `npx playwright install chromium` is enough and there's no hard
  // Google-Chrome dependency. Works cross-platform.
  const opts = { headless: true, args: ["--disable-features=DnsOverHttps"] };
  try {
    return await chromium.launch({ ...opts, channel: "chrome" });
  } catch {
    return await chromium.launch(opts);
  }
}

async function moveCursor(page, from, to, durationMs) {
  const steps = Math.max(18, Math.round((durationMs / 1000) * FPS));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; // ease-in-out cubic
    const x = from.x + (to.x - from.x) * ease;
    const y = from.y + (to.y - from.y) * ease;
    await page.mouse.move(x, y);
    await page.evaluate(({ x, y }) => window.__stMoveCursor(x, y, false), { x, y });
    await sleep(durationMs / steps);
  }
}

async function smoothScroll(page, targetY, durationMs) {
  await page.evaluate(
    async ({ targetY, durationMs }) => {
      const start = window.scrollY;
      const delta = targetY - start;
      const t0 = performance.now();
      await new Promise((resolve) => {
        function step(now) {
          const t = Math.min(1, (now - t0) / durationMs);
          const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; // ease-in-out cubic
          window.scrollTo(0, Math.round((start + delta * ease) * 100) / 100);
          if (t < 1) requestAnimationFrame(step);
          else resolve();
        }
        requestAnimationFrame(step);
      });
    },
    { targetY, durationMs }
  );
}

async function trimVideo(input, output, startSec, codec = "libx264") {
  const ss = Math.max(0, startSec - 0.05).toFixed(3);
  const args = ["-y", "-ss", ss, "-i", input, "-an"];
  if (codec === "libx264") {
    args.push("-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20");
  } else {
    args.push("-c:v", "libvpx-vp9", "-b:v", "2M");
  }
  args.push(output);
  await execFileAsync("ffmpeg", args);
}

export async function record(config) {
  await ensureFfmpeg(); // fail fast with a clear message before the long recording

  const outDir = path.resolve(config.outputDir);
  const rawDir = path.join(outDir, "_raw");
  await mkdir(rawDir, { recursive: true });
  await mkdir(outDir, { recursive: true });

  const { width: w, height: h } = config.viewportSize;
  const mp4Out = path.join(outDir, `${config.outputName}.mp4`);
  const webmOut = path.join(outDir, `${config.outputName}.webm`);

  const browser = await launchBrowser();

  const context = await browser.newContext({
    viewport: config.viewportSize,
    deviceScaleFactor: 1,
    recordVideo: { dir: rawDir, size: config.viewportSize },
    colorScheme: "light",
  });

  const page = await context.newPage();
  const recordStart = Date.now();

  await page.goto(config.url, { waitUntil: "load", timeout: 120000 });
  await page.waitForLoadState("networkidle", { timeout: 60000 }).catch(() => {});
  await waitForPageReady(page, config.heroSelector);

  const trimStartSec = (Date.now() - recordStart) / 1000;
  console.log(`scrolltape: page ready in ${trimStartSec.toFixed(2)}s`);

  const cursor = await getCursorMarkup(config);
  await page.evaluate(buildCursorInject(cursor));

  const moves = heroPath(w, h, config.tourPreset.interactiveHero);
  let pos = { x: w * 0.22, y: h * 0.32 };
  await page.mouse.move(pos.x, pos.y);
  await page.evaluate(({ x, y }) => window.__stMoveCursor(x, y), pos);

  const heroSegment = config.heroHoldMs / moves.length;
  for (const target of moves) {
    await moveCursor(page, pos, target, heroSegment);
    pos = target;
  }

  if (!config.tourPreset.heroOnly) {
    const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const sections = await getSectionOffsets(page, config.sectionIds);
    const stops = buildScrollStops(
      sections,
      docHeight,
      h,
      config.tourPreset,
      config.focusSections
    );

    const scrollMs = config.scroll.scrollMs;
    const dwellMs = config.scroll.dwellMs;

    for (let i = 0; i < stops.length; i++) {
      const targetY = Math.max(0, Math.round(stops[i]));
      const cursorEnd = {
        x: w * (0.4 + (i % 3) * 0.1),
        y: h * (0.38 + (i % 2) * 0.14),
      };

      await Promise.all([
        smoothScroll(page, targetY, scrollMs + i * 80),
        moveCursor(page, { ...pos }, cursorEnd, scrollMs + i * 80),
      ]);
      pos = cursorEnd;

      const dwell = i === stops.length - 1 ? dwellMs * 1.5 : dwellMs;
      await moveCursor(page, pos, { x: pos.x + 28, y: pos.y + 18 }, dwell * 0.5);
      await moveCursor(page, { x: pos.x + 28, y: pos.y + 18 }, pos, dwell * 0.5);
    }
  }

  await page.evaluate(({ x, y }) => window.__stMoveCursor(x, y, true), pos);
  await page.mouse.down();
  await sleep(100);
  await page.mouse.up();
  await page.evaluate(({ x, y }) => window.__stMoveCursor(x, y, false), pos);
  await sleep(500);

  const video = page.video();
  await page.close();
  await context.close();
  await browser.close();

  if (!video) {
    const files = await readdir(rawDir);
    throw new Error(`No video captured. Raw files: ${files.join(", ")}`);
  }

  const rawPath = await video.path();
  const rawFull = path.join(outDir, "_raw-full.webm");
  await rename(rawPath, rawFull);

  console.log(`scrolltape: trimming ${trimStartSec.toFixed(2)}s blank lead-in…`);
  await trimVideo(rawFull, mp4Out, trimStartSec, "libx264");
  await trimVideo(rawFull, webmOut, trimStartSec, "libvpx-vp9");

  return { mp4: mp4Out, webm: webmOut, trimStartSec };
}
