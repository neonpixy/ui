import { mergeProps, splitProps } from 'solid-js';
import { useTheme } from '../theme/context.js';

interface ToggleProps {
	checked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
	disabled?: boolean;
	label?: string;
	class?: string;
	[key: string]: any;
}

export function Toggle(props: ToggleProps) {
	const merged = mergeProps({ checked: false, disabled: false, label: '' }, props);
	const [local, rest] = splitProps(merged, ['checked', 'onCheckedChange', 'disabled', 'label', 'class']);

	const theme = useTheme();
	const isCrystal = () => theme.mode === 'crystal';

	function handleClick() {
		if (local.disabled) return;
		local.onCheckedChange?.(!local.checked);
	}

	return (
		<button
			type="button"
			role="switch"
			aria-checked={local.checked}
			aria-label={local.label}
			disabled={local.disabled}
			classList={{
				toggle: true,
				checked: local.checked,
				disabled: local.disabled,
				glass: isCrystal(),
				[local.class ?? '']: !!local.class,
			}}
			onClick={handleClick}
			{...rest}
		>
			<span class="toggle-thumb" />
		</button>
	);
}
