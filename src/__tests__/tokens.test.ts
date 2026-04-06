import { describe, it, expect } from 'vitest';
import { emberToHex, clamp, cssVarsToStyle } from '../lib/internal/utils.js';
import { modeClass } from '../lib/internal/mode-styles.js';
import { mergeTheme } from '../lib/tokens/merge.js';
import { tokensToCSSVars } from '../lib/tokens/css.js';
import { defaults } from '../lib/tokens/defaults.js';
import type { Ember, ThemeMode } from '../lib/tokens/types.js';

// ── emberToHex ──────────────────────────────────────────────────────

describe('emberToHex', () => {
  it('converts pure red', () => {
    const red: Ember = { r: 1, g: 0, b: 0, a: 1 };
    expect(emberToHex(red)).toBe('#ff0000');
  });

  it('converts pure white', () => {
    const white: Ember = { r: 1, g: 1, b: 1, a: 1 };
    expect(emberToHex(white)).toBe('#ffffff');
  });

  it('converts pure black', () => {
    const black: Ember = { r: 0, g: 0, b: 0, a: 1 };
    expect(emberToHex(black)).toBe('#000000');
  });

  it('converts fractional values', () => {
    // 0.5 * 255 = 127.5, rounds to 128 = 0x80
    const gray: Ember = { r: 0.5, g: 0.5, b: 0.5, a: 1 };
    expect(emberToHex(gray)).toBe('#808080');
  });

  it('ignores alpha channel', () => {
    const semi: Ember = { r: 1, g: 0, b: 0, a: 0.5 };
    expect(emberToHex(semi)).toBe('#ff0000');
  });
});

// ── clamp ───────────────────────────────────────────────────────────

describe('clamp', () => {
  it('returns value when in range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('clamps to min', () => {
    expect(clamp(-3, 0, 10)).toBe(0);
  });

  it('clamps to max', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('handles equal min and max', () => {
    expect(clamp(5, 3, 3)).toBe(3);
  });
});

// ── cssVarsToStyle ──────────────────────────────────────────────────

describe('cssVarsToStyle', () => {
  it('converts a single var', () => {
    expect(cssVarsToStyle({ '--color-primary': '#ff0000' }))
      .toBe('--color-primary: #ff0000');
  });

  it('converts multiple vars', () => {
    const result = cssVarsToStyle({
      '--spacing-md': '16px',
      '--radius-lg': '20px',
    });
    expect(result).toContain('--spacing-md: 16px');
    expect(result).toContain('--radius-lg: 20px');
  });

  it('returns empty string for empty input', () => {
    expect(cssVarsToStyle({})).toBe('');
  });
});

// ── modeClass ───────────────────────────────────────────────────────

describe('modeClass', () => {
  const styles: Record<ThemeMode, string> = {
    neu: 'neu-shadow',
    crystal: 'crystal-glass',
  };

  it('returns neu class for neu mode', () => {
    expect(modeClass('neu', styles)).toBe('neu-shadow');
  });

  it('returns crystal class for crystal mode', () => {
    expect(modeClass('crystal', styles)).toBe('crystal-glass');
  });
});

// ── mergeTheme ──────────────────────────────────────────────────────

describe('mergeTheme', () => {
  it('preserves base when no overrides', () => {
    const merged = mergeTheme(defaults, {});
    expect(merged.mode).toBe(defaults.mode);
    expect(merged.aura.span.md).toBe(16);
  });

  it('overrides a top-level key', () => {
    const merged = mergeTheme(defaults, { mode: 'crystal' });
    expect(merged.mode).toBe('crystal');
  });

  it('deep merges nested objects', () => {
    const merged = mergeTheme(defaults, {
      aura: { span: { md: 20 } },
    });
    expect(merged.aura.span.md).toBe(20);
    // Other span values unchanged
    expect(merged.aura.span.lg).toBe(24);
    expect(merged.aura.span.xs).toBe(6);
  });

  it('overrides a color in a crest', () => {
    const merged = mergeTheme(defaults, {
      aura: {
        dark_crest: {
          accent: { r: 0, g: 1, b: 0, a: 1 },
        },
      },
    });
    expect(merged.aura.dark_crest.accent).toEqual({ r: 0, g: 1, b: 0, a: 1 });
    // Other dark_crest colors remain
    expect(merged.aura.dark_crest.primary).toEqual(defaults.aura.dark_crest.primary);
  });

  it('does not mutate the original', () => {
    const original = structuredClone(defaults);
    mergeTheme(defaults, { mode: 'crystal' });
    expect(defaults).toEqual(original);
  });
});

// ── tokensToCSSVars ─────────────────────────────────────────────────

describe('tokensToCSSVars', () => {
  it('generates spacing vars', () => {
    const vars = tokensToCSSVars(defaults, 'light');
    expect(vars['--spacing-md']).toBe('16px');
    expect(vars['--spacing-xl']).toBe('32px');
  });

  it('generates radius vars', () => {
    const vars = tokensToCSSVars(defaults, 'light');
    expect(vars['--radius-md']).toBe('12px');
    expect(vars['--radius-full']).toBe('9999px');
  });

  it('generates color vars from light crest', () => {
    const vars = tokensToCSSVars(defaults, 'light');
    // light primary is black: r=0, g=0, b=0
    expect(vars['--color-primary']).toBe('#000000');
    // light background is white
    expect(vars['--color-background']).toBe('#ffffff');
  });

  it('generates color vars from dark crest', () => {
    const vars = tokensToCSSVars(defaults, 'dark');
    // dark primary is white
    expect(vars['--color-primary']).toBe('#ffffff');
    // dark background is black
    expect(vars['--color-background']).toBe('#000000');
  });

  it('generates shadow vars', () => {
    const vars = tokensToCSSVars(defaults, 'light');
    expect(vars['--shadow-subtle']).toContain('rgba(0,0,0,');
    expect(vars['--shadow-floating']).toContain('24px');
  });

  it('generates neumorphic shadow vars', () => {
    const vars = tokensToCSSVars(defaults, 'light');
    expect(vars['--shadow-raised']).toBe(defaults.neu.light.raised);
    expect(vars['--shadow-pressed']).toBe(defaults.neu.light.pressed);
  });
});
