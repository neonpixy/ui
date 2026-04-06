// @omnidea/ui — Mode-conditional style helper

import type { ThemeMode } from '../tokens/types.js';

/**
 * Pick a CSS class string based on the current theme mode.
 * Components use this to branch their styling per mode.
 *
 * @example
 * ```typescript
 * const cls = modeClass(theme.mode, {
 *   neu: 'bg-[--color-surface] shadow-[--shadow-raised]',
 *   crystal: 'bg-transparent',
 * });
 * ```
 */
export function modeClass(
  mode: ThemeMode,
  styles: Record<ThemeMode, string>,
): string {
  return styles[mode] ?? styles.neu;
}
