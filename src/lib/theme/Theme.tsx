import { createSignal, createMemo, createEffect, onCleanup, type ParentProps } from 'solid-js';
import type { ThemeConfig, ThemeMode, Aspect, ThemeOverrides } from '../tokens/types.js';
import { defaults } from '../tokens/defaults.js';
import { mergeTheme } from '../tokens/merge.js';
import { tokensToCSSVars } from '../tokens/css.js';
import { cssVarsToStyle } from '../internal/utils.js';
import { _syncTheme } from './context.js';

interface ThemeProps extends ParentProps {
	mode?: ThemeMode;
	aspect?: Aspect;
	overrides?: ThemeOverrides;
	crystal?: unknown;
	class?: string;
}

export function Theme(props: ThemeProps) {
	const [systemDark, setSystemDark] = createSignal(false);

	createEffect(() => {
		if (typeof window === 'undefined') return;
		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		setSystemDark(mq.matches);
		const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
		mq.addEventListener('change', handler);
		onCleanup(() => mq.removeEventListener('change', handler));
	});

	const resolvedAspect = createMemo<'light' | 'dark'>(() => {
		const a = props.aspect ?? 'system';
		return a === 'system' ? (systemDark() ? 'dark' : 'light') : a;
	});

	const config = createMemo<ThemeConfig>(() =>
		props.overrides ? mergeTheme(defaults, props.overrides) : defaults
	);

	const cssVars = createMemo(() => tokensToCSSVars(config(), resolvedAspect()));
	const styleStr = createMemo(() => cssVarsToStyle(cssVars()));

	// Sync all theme state to module-level signals
	createEffect(() => {
		_syncTheme(
			props.mode ?? 'neu',
			resolvedAspect(),
			config(),
			props.crystal ?? null,
		);
	});

	return (
		<div
			class={`omnidea-theme ${props.class ?? ''}`}
			style={styleStr()}
			data-theme-mode={props.mode ?? 'neu'}
			data-theme-aspect={resolvedAspect()}
		>
			{props.children}
		</div>
	);
}
