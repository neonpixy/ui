import { mergeProps, splitProps } from 'solid-js';
import { useTheme } from '../theme/context.js';

interface InputProps {
	type?: string;
	placeholder?: string;
	id?: string;
	value?: string;
	onInput?: (value: string) => void;
	disabled?: boolean;
	error?: string;
	class?: string;
	[key: string]: any;
}

export function Input(props: InputProps) {
	const merged = mergeProps({ type: 'text', value: '', disabled: false }, props);
	const [local, rest] = splitProps(merged, ['type', 'placeholder', 'id', 'value', 'onInput', 'disabled', 'error', 'class']);

	const theme = useTheme();
	const isCrystal = () => theme.mode === 'crystal';

	const bgClass = () =>
		isCrystal()
			? 'bg-mix-surface-40'
			: 'bg-[--color-surface]';

	const borderClass = () =>
		local.error
			? 'border-[--color-danger]'
			: isCrystal()
				? 'border-mix-on-background-15'
				: 'border-mix-on-background-10';

	return (
		<div class="flex flex-col gap-1">
			<input
				type={local.type}
				placeholder={local.placeholder}
				id={local.id}
				disabled={local.disabled}
				value={local.value}
				onInput={(e) => local.onInput?.(e.currentTarget.value)}
				class={`omnidea-input w-full px-[--spacing-md] py-[--spacing-sm] min-h-11 ${bgClass()} text-[--color-on-background] border ${borderClass()} rounded-[--radius-md] shadow-[--shadow-pressed] outline-none transition-[border-color] duration-150 ${local.disabled ? 'opacity-40 cursor-not-allowed' : ''} ${local.class ?? ''}`}
				{...rest}
			/>
			{local.error ? (
				<span class="text-xs text-[--color-danger] px-1">{local.error}</span>
			) : null}
		</div>
	);
}
