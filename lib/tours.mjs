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
