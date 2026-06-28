import { readFile } from "node:fs/promises";
import path from "node:path";

export const VIEWPORTS = {
  landscape: { width: 1920, height: 1080 },
  portrait: { width: 1080, height: 1920 },
  square: { width: 1080, height: 1080 },
};

export const SCROLL_SPEEDS = {
  slow: { scrollMs: 3200, dwellMs: 2200, heroFactor: 1.3 },
  normal: { scrollMs: 2200, dwellMs: 1400, heroFactor: 1 },
  fast: { scrollMs: 1400, dwellMs: 800, heroFactor: 0.7 },
};

export const TOUR_DEFAULTS = {
  standard: { heroOnly: false, heroHoldFactor: 1, maxSections: 99, interactiveHero: false },
  "hero-only": { heroOnly: true, heroHoldFactor: 1.5, maxSections: 0, interactiveHero: true },
  "feature-focus": { heroOnly: false, heroHoldFactor: 0.8, maxSections: 99, interactiveHero: false },
  "quick-teaser": { heroOnly: false, heroHoldFactor: 0.5, maxSections: 4, interactiveHero: true },
  "deep-dive": { heroOnly: false, heroHoldFactor: 1.2, maxSections: 99, interactiveHero: false },
  "interactive-hero": { heroOnly: false, heroHoldFactor: 1, maxSections: 99, interactiveHero: true },
};

const DEFAULTS = {
  url: null,
  cursor: "white-pointer",
  customCursorSvg: null,
  heroHoldSec: 3,
  tour: "standard",
  viewport: "landscape",
  scrollSpeed: "normal",
  focusSections: [],
  sectionIds: [],
  heroSelector: "h1",
  outputDir: "renders",
  outputName: null,
};

function domainFromUrl(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").replace(/\./g, "-");
  } catch {
    return "recording";
  }
}

export function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--config" || a === "-c") args.config = argv[++i];
    else if (a === "--url" || a === "-u") args.url = argv[++i];
    else if (a === "--cursor") args.cursor = argv[++i];
    else if (a === "--hero") args.heroHoldSec = Number(argv[++i]);
    else if (a === "--tour") args.tour = argv[++i];
    else if (a === "--viewport") args.viewport = argv[++i];
    else if (a === "--scroll") args.scrollSpeed = argv[++i];
    else if (a === "--output" || a === "-o") args.outputName = argv[++i];
    else if (a === "--out-dir") args.outputDir = argv[++i];
    else if (a === "--focus") args.focusSections = argv[++i].split(",").map((s) => s.trim());
    else if (a === "--help" || a === "-h") args.help = true;
    else if (!a.startsWith("-")) args._.push(a);
  }
  // Accept a bare URL positional, e.g. `scrolltape https://site.com` or
  // `scrolltape record https://site.com`, so "paste a link" works literally.
  if (!args.url) {
    const u = args._.find((s) => /^https?:\/\//i.test(s));
    if (u) args.url = u;
  }
  return args;
}

export async function loadConfig(cliArgs) {
  let fileConfig = {};
  if (cliArgs.config) {
    const raw = await readFile(path.resolve(cliArgs.config), "utf8");
    fileConfig = JSON.parse(raw);
  }

  const merged = {
    ...DEFAULTS,
    ...fileConfig,
    ...Object.fromEntries(
      Object.entries(cliArgs).filter(([k, v]) => v != null && !["_", "help", "config"].includes(k))
    ),
  };

  if (!merged.url) {
    throw new Error("URL is required. Use --url https://example.com or --config file.json");
  }

  merged.viewportSize =
    typeof merged.viewport === "string"
      ? VIEWPORTS[merged.viewport] ?? VIEWPORTS.landscape
      : merged.viewport;

  merged.scroll = SCROLL_SPEEDS[merged.scrollSpeed] ?? SCROLL_SPEEDS.normal;
  merged.tourPreset = TOUR_DEFAULTS[merged.tour] ?? TOUR_DEFAULTS.standard;
  merged.heroHoldMs = Math.round(
    merged.heroHoldSec * 1000 * merged.tourPreset.heroHoldFactor * merged.scroll.heroFactor
  );
  merged.outputName = merged.outputName ?? `${domainFromUrl(merged.url)}-scrolltape`;

  return merged;
}

export function printHelp() {
  console.log(`
scrolltape — automated landing-page screen recordings

Usage:
  scrolltape record --url <https://...> [options]
  scrolltape record --config examples/thinktank.json

Options:
  -u, --url <url>        Site URL (required)
  -c, --config <file>    JSON config file
  --cursor <name>        white-pointer | mac-hand | cute-paw | brand-dot
  --hero <seconds>       Hero hold duration (default: 3)
  --tour <style>         standard | hero-only | feature-focus | quick-teaser | deep-dive | interactive-hero
  --viewport <preset>    landscape | portrait | square
  --scroll <speed>       slow | normal | fast
  --focus <a,b,c>        Section ids to emphasize (feature-focus)
  -o, --output <name>    Output filename base
  --out-dir <dir>        Output directory (default: renders)
  -h, --help             Show help

Examples:
  scrolltape record -u https://thinktank.sh/
  scrolltape record -u https://thinktank.sh/ --cursor cute-paw --tour interactive-hero
  scrolltape record -c examples/thinktank.json --scroll slow
`);
}
