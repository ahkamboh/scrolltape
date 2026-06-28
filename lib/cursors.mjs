import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CURSORS_DIR = path.join(__dirname, "..", "cursors");

const BUILTIN = {
  "white-pointer": { file: "white-pointer.svg", width: 42, height: 42, origin: "8px 4px" },
  "mac-hand": { file: "mac-hand.svg", width: 46, height: 49, origin: "18px 4px" },
  "cute-paw": { file: "cute-paw.svg", width: 54, height: 54, origin: "27px 18px" },
  "brand-dot": { file: "brand-dot.svg", width: 30, height: 30, origin: "15px 15px" },
};

export async function getCursorMarkup(config) {
  let svg;
  let meta = BUILTIN[config.cursor] ?? BUILTIN["mac-hand"];

  if (config.customCursorSvg) {
    svg = config.customCursorSvg;
    meta = { width: 32, height: 32, origin: "4px 4px" };
  } else {
    const filePath = path.join(CURSORS_DIR, meta.file);
    svg = await readFile(filePath, "utf8");
  }

  return { svg, ...meta };
}

export function buildCursorInject({ svg, width, height, origin }) {
  const escaped = svg.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
  return `
(() => {
  if (document.getElementById("st-cursor")) return;

  const style = document.createElement("style");
  style.textContent = \`
    *, *::before, *::after { cursor: none !important; }
    /* The page must not run its OWN smooth-scroll, or it fights scrolltape's
       per-frame animation and stutters. Force instant scroll; scrolltape eases. */
    html, body, * { scroll-behavior: auto !important; }
    #st-cursor {
      position: fixed; top: 0; left: 0;
      width: ${width}px; height: ${height}px;
      pointer-events: none; z-index: 2147483647;
      will-change: transform;
      filter: drop-shadow(0 1px 2px rgba(0,0,0,0.4)) drop-shadow(0 0 1px rgba(0,0,0,0.5));
    }
    #st-cursor svg { display: block; width: 100%; height: 100%; }
    #st-cursor.click svg { transform: scale(0.92); transform-origin: ${origin}; }
  \`;
  document.head.appendChild(style);

  const el = document.createElement("div");
  el.id = "st-cursor";
  el.innerHTML = \`${escaped}\`;
  document.body.appendChild(el);

  window.__stMoveCursor = (x, y, click = false) => {
    el.style.transform = \`translate(\${x}px, \${y}px)\`;
    el.classList.toggle("click", click);
  };
})();
`;
}
