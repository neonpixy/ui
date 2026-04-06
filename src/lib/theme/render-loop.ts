// @omnidea/ui — Crystal render coordinator
// Batches renderAll() calls via requestAnimationFrame.
// Centralized scroll tracking eliminates per-GlassPane layout thrash.

let frameRequested = false;

/**
 * Request a Crystal render on the next animation frame.
 * Safe to call many times per frame — only one render fires.
 */
export function requestCrystalRender(crystal: { renderAll(): void }): void {
  if (frameRequested) return;
  frameRequested = true;
  requestAnimationFrame(() => {
    frameRequested = false;
    crystal.renderAll();
  });
}

// ── Centralized scroll tracking ──────────────────────────────────────
// One scroll listener updates ALL registered GlassPanes in a single rAF.

interface ScrollEntry {
  container: HTMLElement;
  element: { setViewportPosition(x: number, y: number): void; _visible: boolean } | null;
}

const scrollEntries = new Set<ScrollEntry>();
let scrollRafId = 0;
let scrollCrystal: { renderAll(): void } | null = null;
let scrollListenerActive = false;

function onScroll() {
  if (scrollRafId) return;
  scrollRafId = requestAnimationFrame(() => {
    scrollRafId = 0;
    let anyVisible = false;
    for (const entry of scrollEntries) {
      if (!entry.element || !entry.element._visible) continue;
      const r = entry.container.getBoundingClientRect();
      entry.element.setViewportPosition(Math.round(r.left), Math.round(r.top));
      anyVisible = true;
    }
    if (anyVisible && scrollCrystal) {
      requestCrystalRender(scrollCrystal);
    }
  });
}

function ensureScrollListener() {
  if (scrollListenerActive) return;
  scrollListenerActive = true;
  window.addEventListener('scroll', onScroll, { passive: true });
}

export function registerScrollEntry(
  container: HTMLElement,
  crystal: { renderAll(): void },
): ScrollEntry {
  ensureScrollListener();
  scrollCrystal = crystal;
  const entry: ScrollEntry = { container, element: null };
  scrollEntries.add(entry);
  return entry;
}

export function unregisterScrollEntry(entry: ScrollEntry): void {
  scrollEntries.delete(entry);
  if (scrollEntries.size === 0 && scrollListenerActive) {
    window.removeEventListener('scroll', onScroll);
    scrollListenerActive = false;
    scrollCrystal = null;
  }
}
