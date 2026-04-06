// @omnidea/ui — Internal utilities

import type { Ember } from '../tokens/types.js';

/** Convert Ember to CSS hex string (#rrggbb). */
export function emberToHex(e: Ember): string {
  const r = Math.round(e.r * 255).toString(16).padStart(2, '0');
  const g = Math.round(e.g * 255).toString(16).padStart(2, '0');
  const b = Math.round(e.b * 255).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

/** Clamp a number between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Convert a Record<string, string> to an inline style string. */
export function cssVarsToStyle(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([key, val]) => `${key}: ${val}`)
    .join('; ');
}
