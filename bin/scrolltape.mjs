#!/usr/bin/env node
import { parseArgs, loadConfig, printHelp } from "../lib/config.mjs";
import { record } from "../lib/record.mjs";

const cli = parseArgs(process.argv.slice(2));

if (cli.help) {
  printHelp();
  process.exit(0);
}

const isRecord =
  cli._.length === 0 ||
  cli._[0] === "record" ||
  cli.url ||
  cli.config;

if (!isRecord) {
  console.error(`Unknown command: ${cli._[0]}`);
  printHelp();
  process.exit(1);
}

if (!cli.url && !cli.config) {
  printHelp();
  process.exit(1);
}

try {
  const config = await loadConfig(cli);
  console.log(`scrolltape: recording ${config.url}`);
  console.log(`  cursor: ${config.cursor}  tour: ${config.tour}  hero: ${config.heroHoldSec}s`);

  const { mp4, webm } = await record(config);
  console.log(`\n✅ MP4:  ${mp4}`);
  console.log(`✅ WebM: ${webm}`);
} catch (err) {
  console.error("scrolltape error:", err.message ?? err);
  process.exit(1);
}
