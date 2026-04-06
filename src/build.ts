#!/usr/bin/env node
// Reads defaults.json and generates theme.css for UnoCSS.
// Run: npx tsx src/build.ts

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const defaults = JSON.parse(readFileSync(resolve(__dirname, 'defaults.json'), 'utf-8'));

function toHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(c => Math.round(c * 255).toString(16).padStart(2, '0')).join('');
}

function emberHex(e: { r: number; g: number; b: number }): string {
  return toHex(e.r, e.g, e.b);
}

const reign = defaults.reign;
const aura = reign.aura;
const light = aura.light_crest;
const dark = aura.dark_crest;
const neu = defaults.neu;

const lines: string[] = [];
lines.push('/* @omnidea/ui — Auto-generated from defaults.json. Do not edit. */');
lines.push('/* Run: npm run build to regenerate. */');
lines.push('');

// ── Theme block (UnoCSS) ──
lines.push('@theme {');

// Colors (light mode as base — dark mode via CSS @media or class)
lines.push('  /* Semantic colors (light) */');
lines.push(`  --color-primary: ${emberHex(light.primary)};`);
lines.push(`  --color-secondary: ${emberHex(light.secondary)};`);
lines.push(`  --color-accent: ${emberHex(light.accent)};`);
lines.push(`  --color-background: ${emberHex(light.background)};`);
lines.push(`  --color-surface: ${emberHex(light.surface)};`);
lines.push(`  --color-on-primary: ${emberHex(light.on_primary)};`);
lines.push(`  --color-on-background: ${emberHex(light.on_background)};`);
lines.push(`  --color-danger: ${emberHex(light.danger)};`);
lines.push(`  --color-success: ${emberHex(light.success)};`);
lines.push(`  --color-warning: ${emberHex(light.warning)};`);
lines.push(`  --color-info: ${emberHex(light.info)};`);
lines.push(`  --color-mid-gray: ${emberHex(light.mid_gray)};`);
lines.push('');

// Spacing
lines.push('  /* Spacing */');
for (const [key, val] of Object.entries(aura.span)) {
  if (key === 'custom') continue;
  lines.push(`  --spacing-${key}: ${val}px;`);
}
lines.push('');

// Radii
lines.push('  /* Radii */');
for (const [key, val] of Object.entries(aura.arch)) {
  if (key === 'custom') continue;
  lines.push(`  --radius-${key}: ${key === 'full' ? '9999px' : val + 'px'};`);
}
lines.push('');

// Typography
lines.push('  /* Typography */');
const systemFont = '-apple-system, BlinkMacSystemFont, system-ui, sans-serif';
for (const [level, glyph] of Object.entries(aura.inscription) as [string, any][]) {
  if (level === 'custom') continue;
  const family = glyph.family === 'system' ? systemFont : glyph.family === 'monospace' ? "'SF Mono', 'Fira Code', monospace" : glyph.family;
  lines.push(`  --font-${level}: ${glyph.size}px ${family};`);
}
lines.push('');

// Shadows
lines.push('  /* Shadows */');
for (const [key, shadow] of Object.entries(aura.umbra) as [string, any][]) {
  if (key === 'custom') continue;
  lines.push(`  --shadow-${key}: ${shadow.offset_x}px ${shadow.offset_y}px ${shadow.radius}px rgba(0,0,0,${shadow.opacity});`);
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
lines.push(`    --color-primary: ${emberHex(dark.primary)};`);
lines.push(`    --color-secondary: ${emberHex(dark.secondary)};`);
lines.push(`    --color-accent: ${emberHex(dark.accent)};`);
lines.push(`    --color-background: ${emberHex(dark.background)};`);
lines.push(`    --color-surface: ${emberHex(dark.surface)};`);
lines.push(`    --color-on-primary: ${emberHex(dark.on_primary)};`);
lines.push(`    --color-on-background: ${emberHex(dark.on_background)};`);
lines.push(`    --color-danger: ${emberHex(dark.danger)};`);
lines.push(`    --color-success: ${emberHex(dark.success)};`);
lines.push(`    --color-warning: ${emberHex(dark.warning)};`);
lines.push(`    --color-info: ${emberHex(dark.info)};`);
lines.push(`    --color-mid-gray: ${emberHex(dark.mid_gray)};`);
lines.push(`    --shadow-raised: ${neu.dark.raised};`);
lines.push(`    --shadow-pressed: ${neu.dark.pressed};`);
lines.push(`    --shadow-flat: ${neu.dark.flat};`);
lines.push('  }');
lines.push('}');

const output = lines.join('\n') + '\n';
writeFileSync(resolve(__dirname, 'theme.css'), output);
console.log('Generated src/theme.css from defaults.json');
