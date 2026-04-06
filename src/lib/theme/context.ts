// @omnidea/ui — Theme state (module-level signals)
// No Solid context — module-level signals work reliably across all environments.
// Theme component sets these, all other components read them.

import { createSignal, createMemo } from 'solid-js';
import type { ThemeConfig, ThemeMode } from '../tokens/types.js';
import { defaults } from '../tokens/defaults.js';

const [_mode, _setMode] = createSignal<ThemeMode>('neu');
const [_aspect, _setAspect] = createSignal<'light' | 'dark'>('light');
const [_config, _setConfig] = createSignal<ThemeConfig>(defaults);
const [_crystal, _setCrystal] = createSignal<unknown>(null);

/** Current theme mode. */
export const themeMode = _mode;
/** Current resolved aspect (never 'system'). */
export const themeAspect = _aspect;
/** Current theme config. */
export const themeConfig = _config;
/** Current Crystal instance. */
export const themeCrystal = _crystal;

/** @internal — called by <Theme> to sync state. */
export function _syncTheme(mode: ThemeMode, aspect: 'light' | 'dark', config: ThemeConfig, crystal: unknown) {
	_setMode(mode);
	_setAspect(aspect);
	_setConfig(config);
	_setCrystal(crystal);
}

/** Convenience: is crystal mode active? */
export const isCrystalMode = () => _mode() === 'crystal';

/** Convenience: is Crystal WebGPU available? */
export const hasCrystal = () => isCrystalMode() && _crystal() !== null;

// Legacy compat — useTheme returns a getter-based object
export interface ThemeContext {
	readonly config: ThemeConfig;
	readonly mode: ThemeMode;
	readonly aspect: 'light' | 'dark';
	readonly crystal: unknown | null;
}

export function useTheme(): ThemeContext {
	return {
		get config() { return _config(); },
		get mode() { return _mode(); },
		get aspect() { return _aspect(); },
		get crystal() { return _crystal(); },
	};
}
