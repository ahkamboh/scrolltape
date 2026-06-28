export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Wait until landing page is painted — not a white loading screen. */
export async function waitForPageReady(page, heroSelector = "h1") {
  await page.waitForSelector(heroSelector, { state: "visible", timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  // Wait until the hero has real size AND the page has actually laid out content.
  // (We do NOT reject white backgrounds — plenty of real landing pages are white.)
  // Best-effort: proceed anyway if the heuristic never trips, so we never hang.
  await page
    .waitForFunction(
      (sel) => {
        const hero = document.querySelector(sel);
        if (!hero || hero.getBoundingClientRect().height < 20) return false;
        return (hero.textContent || "").trim().length > 0; // hero has painted text → ready
      },
      heroSelector,
      { timeout: 15000 }
    )
    .catch(() => {});
  await page.evaluate(
    () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
  );
  await sleep(600);
}
