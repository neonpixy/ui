// @omnidea/ui — Convert resolved ThemeConfig to CSS custom properties

import type { ThemeConfig, Ember, Crest, Shadow } from './types.js';

/**
 * Convert a resolved ThemeConfig + aspect into a flat map of CSS custom properties.
 * Variable names match existing conventions: --color-*, --spacing-*, --radius-*, etc.
 */
export function tokensToCSSVars(config: ThemeConfig, aspect: 'light' | 'dark'): Record<string, string> {
  const vars: Record<string, string> = {};
  const crest = aspect === 'dark' ? config.aura.dark_crest : config.aura.light_crest;
  const neu = aspect === 'dark' ? config.neu.dark : config.neu.light;

  // ── Colors ──
  setCrestColors(vars, crest);

  // ── Spacing ──
  const { custom: _sc, ...spanEntries } = config.aura.span;
  for (const [key, val] of Object.entries(spanEntries)) {
    vars[`--spacing-${key}`] = `${val}px`;
  }
  for (const [key, val] of Object.entries(config.aura.span.custom)) {
    vars[`--spacing-${key}`] = `${val}px`;
  }

  // ── Radii ──
  const { custom: _ac, ...archEntries } = config.aura.arch;
  for (const [key, val] of Object.entries(archEntries)) {
    vars[`--radius-${key}`] = key === 'full' ? '9999px' : `${val}px`;
  }
  for (const [key, val] of Object.entries(config.aura.arch.custom)) {
    vars[`--radius-${key}`] = `${val}px`;
  }

  // ── Typography ──
  const systemFont = '-apple-system, BlinkMacSystemFont, system-ui, sans-serif';
  const monoFont = "'SF Mono', 'Fira Code', monospace";
  const { custom: _ic, ...inscEntries } = config.aura.inscription;
  for (const [level, glyph] of Object.entries(inscEntries)) {
    const family = glyph.family === 'system' ? systemFont
      : glyph.family === 'monospace' ? monoFont
      : glyph.family;
    vars[`--font-${level}`] = `${glyph.size}px ${family}`;
  }
  for (const [level, glyph] of Object.entries(config.aura.inscription.custom)) {
    const family = glyph.family === 'system' ? systemFont
      : glyph.family === 'monospace' ? monoFont
      : glyph.family;
    vars[`--font-${level}`] = `${glyph.size}px ${family}`;
  }

  // ── Shadows ──
  const { custom: _uc, ...umbraEntries } = config.aura.umbra;
  for (const [key, shadow] of Object.entries(umbraEntries)) {
    vars[`--shadow-${key}`] = shadowToCSS(shadow);
  }
  for (const [key, shadow] of Object.entries(config.aura.umbra.custom)) {
    vars[`--shadow-${key}`] = shadowToCSS(shadow);
  }

  // ── Neumorphic ──
  vars['--shadow-raised'] = neu.raised;
  vars['--shadow-pressed'] = neu.pressed;
  vars['--shadow-flat'] = neu.flat;

  return vars;
}

// ── Helpers ──────────────────────────────────────────────────────────

function setCrestColors(vars: Record<string, string>, crest: Crest): void {
  const colorKeys: (keyof Crest)[] = [
    'primary', 'secondary', 'accent', 'background', 'surface',
    'on_primary', 'on_background', 'danger', 'success', 'warning', 'info', 'mid_gray',
  ];

  for (const key of colorKeys) {
    const ember = crest[key] as Ember;
    const cssName = key.replace(/_/g, '-');
    vars[`--color-${cssName}`] = emberToHex(ember);
  }

  for (const [key, ember] of Object.entries(crest.families)) {
    vars[`--color-family-${key}`] = emberToHex(ember);
  }

  for (const [key, ember] of Object.entries(crest.custom)) {
    vars[`--color-${key}`] = emberToHex(ember);
  }
}

export function emberToHex(e: Ember): string {
  const r = Math.round(e.r * 255).toString(16).padStart(2, '0');
  const g = Math.round(e.g * 255).toString(16).padStart(2, '0');
  const b = Math.round(e.b * 255).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

function shadowToCSS(s: Shadow): string {
  return `${s.offset_x}px ${s.offset_y}px ${s.radius}px rgba(0,0,0,${s.opacity})`;
}
