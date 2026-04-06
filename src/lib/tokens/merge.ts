// @omnidea/ui — Deep merge utility for theme overrides

import type { ThemeConfig, DeepPartial } from './types.js';

/**
 * Deep merge overrides onto a base ThemeConfig.
 * - Objects are merged key-by-key
 * - Arrays and primitives are replaced
 * - Undefined values are skipped
 */
export function mergeTheme(base: ThemeConfig, overrides: DeepPartial<ThemeConfig>): ThemeConfig {
  return deepMerge(base as unknown as Record<string, unknown>, overrides as unknown as Record<string, unknown>) as unknown as ThemeConfig;
}

function deepMerge<T extends Record<string, unknown>>(base: T, overrides: Partial<T>): T {
  const result = { ...base };

  for (const key in overrides) {
    const val = overrides[key];
    if (val === undefined) continue;

    const baseVal = base[key];

    if (
      val !== null &&
      typeof val === 'object' &&
      !Array.isArray(val) &&
      baseVal !== null &&
      typeof baseVal === 'object' &&
      !Array.isArray(baseVal)
    ) {
      // Recurse into nested objects
      (result as Record<string, unknown>)[key] = deepMerge(
        baseVal as Record<string, unknown>,
        val as Record<string, unknown>,
      );
    } else {
      // Replace primitive, array, or null
      (result as Record<string, unknown>)[key] = val;
    }
  }

  return result;
}
