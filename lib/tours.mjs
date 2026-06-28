export function heroPath(w, h, interactive) {
  if (interactive) {
    return [
      { x: w * 0.28, y: h * 0.36 },
      { x: w * 0.34, y: h * 0.5 },
      { x: w * 0.58, y: h * 0.32 },
      { x: w * 0.72, y: h * 0.42 },
      { x: w * 0.66, y: h * 0.58 },
      { x: w * 0.76, y: h * 0.52 },
    ];
  }
  return [
    { x: w * 0.3, y: h * 0.38 },
    { x: w * 0.42, y: h * 0.48 },
    { x: w * 0.36, y: h * 0.58 },
    { x: w * 0.5, y: h * 0.45 },
  ];
}

// Find prominent, clickable elements in the hero / nav area to hover + click,
// primary call-to-action first. Returns viewport-space centers.
export async function getHeroTargets(page) {
  return page.evaluate(() => {
    const sel = 'a[href], button, [role="button"], input[type="submit"], input[type="button"]';
    const vw = window.innerWidth, vh = window.innerHeight;
    const seen = new Set();
    const out = [];
    for (const el of document.querySelectorAll(sel)) {
      const r = el.getBoundingClientRect();
      if (r.width < 28 || r.height < 16) continue;          // too small to be a CTA
      if (r.top < 0 || r.top > vh * 1.15) continue;          // hero / nav band only
      if (r.left < 0 || r.right > vw + 1) continue;          // fully on-screen
      const cx = Math.round(r.left + r.width / 2);
      const cy = Math.round(r.top + r.height / 2);
      const key = cx + "," + cy;
      if (seen.has(key)) continue;
      seen.add(key);
      const cls = (el.className && el.className.toString && el.className.toString()) || "";
      const isBtn =
        el.tagName === "BUTTON" || el.getAttribute("role") === "button" ||
        /\b(btn|button|cta|primary|signup|sign-up|get-?started|download|star)\b/i.test(cls + " " + (el.textContent || ""));
      out.push({ x: cx, y: cy, area: r.width * r.height, isBtn });
    }
    // CTAs first, then biggest
    out.sort((a, b) => (b.isBtn - a.isBtn) || (b.area - a.area));
    return out.slice(0, 4).map((t) => ({ x: t.x, y: t.y }));
  });
}

// Discover same-origin nav/header links to follow (for --follow). Returns
// { href, x, y } so the cursor can click the link before we navigate.
export async function discoverNavLinks(page, limit = 3) {
  return page.evaluate((limit) => {
    const origin = location.origin;
    const norm = (u) => u.replace(/#.*$/, "").replace(/\/+$/, "");
    const here = norm(location.href);
    const out = [];
    const seen = new Set();
    for (const a of document.querySelectorAll("header a[href], nav a[href]")) {
      const raw = a.getAttribute("href") || "";
      if (raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("tel:")) continue;
      let href;
      try { href = new URL(raw, location.href).href; } catch { continue; }
      if (!href.startsWith(origin)) continue; // same-site only
      const key = norm(href);
      if (key === here || key === norm(origin) || seen.has(key)) continue;
      seen.add(key);
      const r = a.getBoundingClientRect();
      if (r.width < 1) continue;
      out.push({ href, x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) });
      if (out.length >= limit) break;
    }
    return out;
  }, limit);
}

// Visible, fillable form fields (for --fill), with a sensible sample value each.
export async function getFormFields(page) {
  return page.evaluate(() => {
    const sel =
      'input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=checkbox]):not([type=radio]):not([type=file]), textarea';
    const vh = window.innerHeight, vw = window.innerWidth;
    const out = [];
    for (const el of document.querySelectorAll(sel)) {
      if (el.disabled || el.readOnly) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 70 || r.height < 16) continue;
      if (r.top < 0 || r.top > vh * 1.1 || r.left < 0 || r.right > vw + 1) continue;
      const type = (el.getAttribute("type") || "text").toLowerCase();
      const hint = ((el.name || "") + " " + (el.placeholder || "") + " " + (el.getAttribute("aria-label") || "")).toLowerCase();
      // Word-bounded matches so "tell" doesn't look like "tel", "message" not "age", etc.
      let val = "Hello there 👋";
      if (el.tagName === "TEXTAREA" || /\b(message|comment|bio|note|describe|why)\b/.test(hint)) val = "This looks great — exactly what I needed!";
      else if (type === "email" || /\be-?mail\b/.test(hint)) val = "alex@example.com";
      else if (type === "password" || /\bpass(word)?\b/.test(hint)) val = "scrolltape-123";
      else if (type === "tel" || /\b(telephone|phone|mobile|tel)\b/.test(hint)) val = "+1 555 0142";
      else if (type === "url" || /\b(url|website)\b/.test(hint)) val = "https://example.com";
      else if (type === "number" || /\b(number|qty|quantity|amount|age|zip)\b/.test(hint)) val = "42";
      else if (type === "search" || /\b(search|query)\b/.test(hint)) val = "how it works";
      else if (/\bfirst[\s_-]?name\b/.test(hint)) val = "Alex";
      else if (/\b(last[\s_-]?name|surname)\b/.test(hint)) val = "Carter";
      else if (/\b(name|full[\s_-]?name)\b/.test(hint)) val = "Alex Carter";
      else if (/\b(company|organi[sz]ation|org)\b/.test(hint)) val = "Acme Inc";
      else if (/\bcity\b/.test(hint)) val = "San Francisco";
      out.push({ x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2), val });
    }
    return out.slice(0, 4);
  });
}

export async function getSectionOffsets(page, sectionIds) {
  return page.evaluate(
    ({ sectionIds }) => {
      const found = [];
      if (sectionIds.length) {
        for (const id of sectionIds) {
          const el =
            document.getElementById(id) ||
            document.querySelector(`[data-section="${id}"]`) ||
            document.querySelector(`#${id}`);
          if (el) found.push({ id, y: el.offsetTop });
        }
      }
      if (!found.length) {
        [...document.querySelectorAll("section")].slice(0, 12).forEach((el, i) => {
          found.push({ id: el.id || `section-${i}`, y: el.offsetTop });
        });
      }
      return found;
    },
    { sectionIds }
  );
}

export function buildScrollStops(sections, docHeight, viewH, tourPreset, focusSections) {
  let list = sections.length > 1 ? sections.slice(1) : [];

  if (focusSections.length && list.length) {
    const focused = list.filter((s) =>
      focusSections.some((f) => s.id.toLowerCase().includes(f.toLowerCase()))
    );
    if (focused.length) list = focused;
  }

  if (tourPreset.maxSections < 99) {
    list = list.slice(0, tourPreset.maxSections);
  }

  if (!list.length && !tourPreset.heroOnly) {
    return [0.22, 0.42, 0.62, 0.82, 0.98]
      .slice(0, tourPreset.maxSections === 99 ? 5 : tourPreset.maxSections)
      .map((p) => Math.max(0, Math.round(docHeight * p - viewH * (1 - p))));
  }

  return list.map((s) => Math.min(s.y, docHeight - viewH));
}
