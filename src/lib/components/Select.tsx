import { mergeProps, splitProps, For, Show } from 'solid-js';
import { useTheme } from '../theme/context.js';

interface SelectProps {
	options: Array<{ value: string; label: string }>;
	value?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
	error?: string;
	class?: string;
	[key: string]: any;
}

export function Select(props: SelectProps) {
	const merged = mergeProps({ value: '', placeholder: 'Select...', disabled: false }, props);
	const [local, rest] = splitProps(merged, ['options', 'value', 'onChange', 'placeholder', 'disabled', 'error', 'class']);

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
			<select
				value={local.value}
				disabled={local.disabled}
				onChange={(e) => local.onChange?.(e.currentTarget.value)}
				class={`omnidea-select w-full px-[--spacing-md] py-[--spacing-sm] min-h-11 ${bgClass()} text-[--color-on-background] border ${borderClass()} rounded-[--radius-md] shadow-[--shadow-pressed] outline-none transition-[border-color] duration-150 appearance-none cursor-pointer ${local.disabled ? 'opacity-40 cursor-not-allowed' : ''} ${local.class ?? ''}`}
				{...rest}
			>
				<Show when={local.placeholder}>
					<option value="" disabled selected hidden>{local.placeholder}</option>
				</Show>
				<For each={local.options}>
					{(opt) => <option value={opt.value}>{opt.label}</option>}
				</For>
			</select>
			<Show when={local.error}>
				<span class="text-xs text-[--color-danger] px-1">{local.error}</span>
			</Show>
		</div>
	);
}
