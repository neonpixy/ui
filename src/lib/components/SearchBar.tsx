import { mergeProps, splitProps, Show } from 'solid-js';
import { useTheme } from '../theme/context.js';

interface SearchBarProps {
	value?: string;
	onInput?: (value: string) => void;
	placeholder?: string;
	autofocus?: boolean;
	class?: string;
	onSearch?: (query: string) => void;
	onClear?: () => void;
	[key: string]: any;
}

export function SearchBar(props: SearchBarProps) {
	const merged = mergeProps({ value: '', placeholder: 'Search...', autofocus: false }, props);
	const [local, rest] = splitProps(merged, ['value', 'onInput', 'placeholder', 'autofocus', 'class', 'onSearch', 'onClear']);

	const theme = useTheme();
	const isCrystal = () => theme.mode === 'crystal';

	const bgClass = () =>
		isCrystal()
			? 'bg-mix-surface-40'
			: 'bg-[--color-surface]';

	const borderClass = () =>
		isCrystal()
			? 'border-mix-on-background-15'
			: 'border-mix-on-background-10';

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') local.onSearch?.(local.value);
		if (e.key === 'Escape') handleClear();
	}

	function handleClear() {
		local.onInput?.('');
		local.onClear?.();
	}

	return (
		<div class={`omnidea-search-bar relative flex items-center ${local.class ?? ''}`}>
			<i class="ri-search-line absolute left-3 text-sm text-[--color-secondary] pointer-events-none" />
			<input
				type="search"
				value={local.value}
				onInput={(e) => local.onInput?.(e.currentTarget.value)}
				placeholder={local.placeholder}
				class={`w-full pl-9 pr-8 py-[--spacing-sm] min-h-9 ${bgClass()} text-[--color-on-background] text-sm border ${borderClass()} rounded-[--radius-md] shadow-[--shadow-pressed] outline-none transition-[border-color] duration-150`}
				onKeyDown={handleKeydown}
				{...rest}
			/>
			<Show when={local.value}>
				<button
					class="absolute right-2 w-5 h-5 flex items-center justify-center rounded-full text-[--color-secondary] cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
					onClick={handleClear}
					aria-label="Clear search"
				>
					<i class="ri-close-line text-xs" />
				</button>
			</Show>
		</div>
	);
}
