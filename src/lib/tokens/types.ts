// @omnidea/ui — Token type definitions
// Uses Regalia vocabulary from the Omninet protocol layer.
// CSS variables and component props use friendly names (color, spacing, radius).
// TypeScript types carry the deeper Omnidea vocabulary.

// ── Color ─────────────────────────────────────────────────────────────

/** RGBA color with values in [0, 1]. Matches @omnidea/crystal's CrystalColor. */
export interface Ember {
  r: number;
  g: number;
  b: number;
  a: number;
}

// ── Semantic Color Palette ────────────────────────────────────────────

/** Semantic color palette for a single light/dark aspect. */
export interface Crest {
  primary: Ember;
  secondary: Ember;
  accent: Ember;
  background: Ember;
  surface: Ember;
  on_primary: Ember;
  on_background: Ember;
  danger: Ember;
  success: Ember;
  warning: Ember;
  info: Ember;
  mid_gray: Ember;
  /** Named color families for domain-specific palettes. */
  families: Record<string, Ember>;
  /** User-defined custom colors. */
  custom: Record<string, Ember>;
}

// ── Spacing ───────────────────────────────────────────────────────────

/** Spacing scale in pixels. */
export interface Span {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  custom: Record<string, number>;
}

// ── Typography ────────────────────────────────────────────────────────

/** A single typography level definition. */
export interface Glyph {
  family: string;
  weight: string;
  size: number;
  line_height: number | null;
  letter_spacing: number | null;
}

/** Typography scale — named levels from display to mono. */
export interface Inscription {
  display: Glyph;
  title: Glyph;
  headline: Glyph;
  body: Glyph;
  caption: Glyph;
  mono: Glyph;
  custom: Record<string, Glyph>;
}

// ── Border Radius ─────────────────────────────────────────────────────

/** Border radius scale in pixels. */
export interface Arch {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
  custom: Record<string, number>;
}

// ── Shadows ───────────────────────────────────────────────────────────

/** A single shadow definition. */
export interface Shadow {
  radius: number;
  offset_x: number;
  offset_y: number;
  opacity: number;
}

/** Shadow scale — from subtle to floating. */
export interface Umbra {
  subtle: Shadow;
  medium: Shadow;
  elevated: Shadow;
  floating: Shadow;
  custom: Record<string, Shadow>;
}

// ── Glass ─────────────────────────────────────────────────────────────

/** Glass frost intensity per component role (0-1 scale mapped from token values). */
export interface GlassElevation {
  card: number;
  modal: number;
  nav: number;
  accordion: number;
  ambient: number;
  input: number;
  button: number;
  badge: number;
  slider: number;
  carousel: number;
}

/** Light/dark alpha values for glass shadows. */
export interface GlassShadowAspect {
  darkAlpha: number;
  lightAlpha: number;
}

// ── Neumorphism ───────────────────────────────────────────────────────

/** Neumorphic shadow CSS strings for a single aspect. */
export interface NeuShadows {
  raised: string;
  pressed: string;
  flat: string;
}

// ── Theme Mode ────────────────────────────────────────────────────────

/** The two visual modes. */
export type ThemeMode = 'neu' | 'crystal';

/** Light/dark aspect, or system-detected. */
export type Aspect = 'light' | 'dark' | 'system';

// ── Aura (all visual tokens) ──────────────────────────────────────────

/** Complete set of visual tokens — color, spacing, typography, radius, shadow. */
export interface Aura {
  light_crest: Crest;
  dark_crest: Crest;
  span: Span;
  inscription: Inscription;
  arch: Arch;
  umbra: Umbra;
  motion_preference: 'Full' | 'Reduced' | 'None';
  minimum_touch_target: number;
  minimum_font_size: number;
}

// ── Full Theme Configuration ──────────────────────────────────────────

/** Complete theme configuration. Pass to <Theme> or merge with overrides. */
export interface ThemeConfig {
  mode: ThemeMode;
  aspect: Aspect;
  aura: Aura;
  glass: {
    elevation: GlassElevation;
    shadow: {
      dark: GlassShadowAspect;
      light: GlassShadowAspect;
    };
  };
  neu: {
    dark: NeuShadows;
    light: NeuShadows;
  };
}

// ── Override Utility ──────────────────────────────────────────────────

/** Deep partial — allows overriding any subset of ThemeConfig. */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Record<string, unknown>
    ? DeepPartial<T[P]>
    : T[P];
};

/** Shorthand for deep-partial theme overrides. */
export type ThemeOverrides = DeepPartial<ThemeConfig>;
