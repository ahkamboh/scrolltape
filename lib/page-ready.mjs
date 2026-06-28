export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Wait until landing page is painted — not a white loading screen. */
export async function waitForPageReady(page, heroSelector = "h1") {
  await page.waitForSelector(heroSelector, { state: "visible", timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(
    (sel) => {
      const hero = document.querySelector(sel);
      if (!hero || hero.getBoundingClientRect().height < 20) return false;
      const bg = getComputedStyle(document.body).backgroundColor;
      if (bg === "rgba(0, 0, 0, 0)" || bg === "transparent") return true;
      // Reject plain white; accept any tinted/dark background
      if (bg.includes("255, 255, 255") || bg === "rgb(255, 255, 255)") return false;
      return true;
    },
    heroSelector,
    { timeout: 60000 }
  );
  await page.evaluate(
    () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
  );
  await sleep(600);
}
