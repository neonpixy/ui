// @omnidea/ui — Default token values
// Ported from defaults.json. This is now the canonical source of truth.

import type { ThemeConfig } from './types.js';

/** The default Omnidea theme configuration. */
export const defaults: ThemeConfig = {
  mode: 'neu',
  aspect: 'system',

  aura: {
    light_crest: {
      primary:       { r: 0, g: 0, b: 0, a: 1 },
      secondary:     { r: 0.557, g: 0.557, b: 0.576, a: 1 },
      accent:        { r: 0.8, g: 0.012, b: 0.984, a: 1 },
      background:    { r: 1, g: 1, b: 1, a: 1 },
      surface:       { r: 0.98, g: 0.98, b: 0.98, a: 1 },
      on_primary:    { r: 1, g: 1, b: 1, a: 1 },
      on_background: { r: 0, g: 0, b: 0, a: 1 },
      danger:        { r: 1, g: 0.231, b: 0.188, a: 1 },
      success:       { r: 0, g: 0.867, b: 0.310, a: 1 },
      warning:       { r: 0.984, g: 0.510, b: 0.020, a: 1 },
      info:          { r: 0.039, g: 0.675, b: 0.984, a: 1 },
      mid_gray:      { r: 0.937, g: 0.937, b: 0.937, a: 1 },
      families: {},
      custom: {},
    },

    dark_crest: {
      primary:       { r: 1, g: 1, b: 1, a: 1 },
      secondary:     { r: 0.557, g: 0.557, b: 0.576, a: 1 },
      accent:        { r: 0.8, g: 0.012, b: 0.984, a: 1 },
      background:    { r: 0, g: 0, b: 0, a: 1 },
      surface:       { r: 0.11, g: 0.11, b: 0.118, a: 1 },
      on_primary:    { r: 0, g: 0, b: 0, a: 1 },
      on_background: { r: 1, g: 1, b: 1, a: 1 },
      danger:        { r: 0.984, g: 0.012, b: 0.004, a: 1 },
      success:       { r: 0, g: 0.867, b: 0.310, a: 1 },
      warning:       { r: 0.984, g: 0.510, b: 0.004, a: 1 },
      info:          { r: 0.353, g: 0.784, b: 0.98, a: 1 },
      mid_gray:      { r: 0.2, g: 0.2, b: 0.2, a: 1 },
      families: {},
      custom: {},
    },

    span: {
      xs: 6,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
      custom: {},
    },

    inscription: {
      display:  { family: 'system', weight: 'bold',      size: 34, line_height: null, letter_spacing: null },
      title:    { family: 'system', weight: 'semibold',   size: 28, line_height: null, letter_spacing: null },
      headline: { family: 'system', weight: 'semibold',   size: 22, line_height: null, letter_spacing: null },
      body:     { family: 'system', weight: 'regular',    size: 16, line_height: null, letter_spacing: null },
      caption:  { family: 'system', weight: 'regular',    size: 12, line_height: null, letter_spacing: null },
      mono:     { family: 'monospace', weight: 'regular',  size: 14, line_height: null, letter_spacing: null },
      custom: {},
    },

    arch: {
      sm: 4,
      md: 12,
      lg: 20,
      xl: 28,
      full: 9999,
      custom: {},
    },

    umbra: {
      subtle:   { radius: 2,  offset_x: 0, offset_y: 1,  opacity: 0.08 },
      medium:   { radius: 6,  offset_x: 0, offset_y: 3,  opacity: 0.12 },
      elevated: { radius: 12, offset_x: 0, offset_y: 6,  opacity: 0.18 },
      floating: { radius: 24, offset_x: 0, offset_y: 12, opacity: 0.25 },
      custom: {},
    },

    motion_preference: 'Full',
    minimum_touch_target: 44,
    minimum_font_size: 12,
  },

  glass: {
    elevation: {
      card: 6,
      modal: 14,
      nav: 4,
      accordion: 4,
      ambient: 2,
      input: 3,
      button: 0,
      badge: 0,
      slider: 5,
      carousel: 8,
    },
    shadow: {
      dark:  { darkAlpha: 0.5, lightAlpha: 0.05 },
      light: { darkAlpha: 0.1, lightAlpha: 0.7 },
    },
  },

  neu: {
    light: {
      raised:  '3px 3px 6px rgba(0,0,0,0.08), -3px -3px 6px rgba(255,255,255,0.8)',
      pressed: 'inset 3px 3px 6px rgba(0,0,0,0.08), inset -3px -3px 6px rgba(255,255,255,0.8)',
      flat:    '0 1px 2px rgba(0,0,0,0.05)',
    },
    dark: {
      raised:  '3px 3px 6px rgba(0,0,0,0.08), -3px -3px 6px rgba(255,255,255,0.8)',
      pressed: 'inset 3px 3px 6px rgba(0,0,0,0.08), inset -3px -3px 6px rgba(255,255,255,0.8)',
      flat:    '0 1px 2px rgba(0,0,0,0.05)',
    },
  },
};
