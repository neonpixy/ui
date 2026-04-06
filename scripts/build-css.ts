#!/usr/bin/env node
// Generates theme.css from tokens/defaults.ts for backward compatibility.
// Consumers who only want CSS tokens can @import "@omnidea/ui/theme.css".
// Run: npx tsx scripts/build-css.ts (or via `npm run prebuild`)

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { defaults } from '../src/lib/tokens/defaults.js';
import { emberToHex } from '../src/lib/tokens/css.js';
import type { Shadow } from '../src/lib/tokens/types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const aura = defaults.aura;
const light = aura.light_crest;
const dark = aura.dark_crest;
const neu = defaults.neu;

const lines: string[] = [];
lines.push('/* @omnidea/ui — Auto-generated from tokens/defaults.ts. Do not edit. */');
lines.push('/* Run: npm run prebuild to regenerate. */');
lines.push('');
lines.push('/* Tell UnoCSS to scan @omnidea/ui component files for utility classes.');
lines.push('   Without this, UnoCSS purges classes only used inside the library. */');
lines.push('@source ".";');
lines.push('');

// ── Theme block (UnoCSS) ──
lines.push('@theme {');

// Colors (light mode as base)
lines.push('  /* Semantic colors (light) */');
const colorKeys = [
  'primary', 'secondary', 'accent', 'background', 'surface',
  'on_primary', 'on_background', 'danger', 'success', 'warning', 'info', 'mid_gray',
] as const;

for (const key of colorKeys) {
  const cssName = key.replace(/_/g, '-');
  lines.push(`  --color-${cssName}: ${emberToHex(light[key])};`);
}
lines.push('');

// Spacing
lines.push('  /* Spacing */');
const { custom: _sc, ...spanEntries } = aura.span;
for (const [key, val] of Object.entries(spanEntries)) {
  lines.push(`  --spacing-${key}: ${val}px;`);
}
lines.push('');

// Radii
lines.push('  /* Radii */');
const { custom: _ac, ...archEntries } = aura.arch;
for (const [key, val] of Object.entries(archEntries)) {
  lines.push(`  --radius-${key}: ${key === 'full' ? '9999px' : val + 'px'};`);
}
lines.push('');

// Typography
lines.push('  /* Typography */');
const systemFont = '-apple-system, BlinkMacSystemFont, system-ui, sans-serif';
const monoFont = "'SF Mono', 'Fira Code', monospace";
const { custom: _ic, ...inscEntries } = aura.inscription;
for (const [level, glyph] of Object.entries(inscEntries)) {
  const family = glyph.family === 'system' ? systemFont
    : glyph.family === 'monospace' ? monoFont
    : glyph.family;
  lines.push(`  --font-${level}: ${glyph.size}px ${family};`);
}
lines.push('');

// Shadows
lines.push('  /* Shadows */');
const { custom: _uc, ...umbraEntries } = aura.umbra;
for (const [key, shadow] of Object.entries(umbraEntries)) {
  const s = shadow as Shadow;
  lines.push(`  --shadow-${key}: ${s.offset_x}px ${s.offset_y}px ${s.radius}px rgba(0,0,0,${s.opacity});`);
}
lines.push('');

// Neumorphic
lines.push('  /* Neumorphic */');
lines.push(`  --shadow-raised: ${neu.light.raised};`);
lines.push(`  --shadow-pressed: ${neu.light.pressed};`);
lines.push(`  --shadow-flat: ${neu.light.flat};`);
lines.push('');

lines.push('}');
lines.push('');

// ── Dark mode overrides ──
lines.push('@media (prefers-color-scheme: dark) {');
lines.push('  :root {');
for (const key of colorKeys) {
  const cssName = key.replace(/_/g, '-');
  lines.push(`    --color-${cssName}: ${emberToHex(dark[key])};`);
}
lines.push(`    --shadow-raised: ${neu.dark.raised};`);
lines.push(`    --shadow-pressed: ${neu.dark.pressed};`);
lines.push(`    --shadow-flat: ${neu.dark.flat};`);
lines.push('  }');
lines.push('}');

const output = lines.join('\n') + '\n';
writeFileSync(resolve(__dirname, '..', 'src', 'lib', 'theme.css'), output);
console.log('Generated src/lib/theme.css from tokens/defaults.ts');
