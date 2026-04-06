import { mergeProps, splitProps, type JSX, type ParentProps } from 'solid-js';
import { useTheme } from '../theme/context.js';

interface ButtonProps extends ParentProps {
	variant?: 'default' | 'primary' | 'danger' | 'success' | 'ghost';
	size?: 'sm' | 'md' | 'lg';
	icon?: string;
	iconPosition?: 'left' | 'right';
	pill?: boolean;
	disabled?: boolean;
	loading?: boolean;
	class?: string;
	onClick?: (e: MouseEvent) => void;
	[key: string]: any;
}

const base = 'inline-flex items-center justify-center gap-[--spacing-xs] font-medium cursor-pointer transition-[filter,transform] duration-150 border';

const neuVariants: Record<string, string> = {
	primary: 'bg-[--color-accent] text-white border-[--color-accent]',
	danger:  'bg-[--color-danger] text-white border-[--color-danger]',
	success: 'bg-[--color-success] text-white border-[--color-success]',
	ghost:   'bg-transparent border-transparent',
};

const glassVariants: Record<string, string> = {
	primary: 'bg-mix-accent-20 text-[--color-accent] border-mix-accent-30',
	danger:  'bg-mix-danger-20 text-[--color-danger] border-mix-danger-30',
	success: 'bg-mix-success-20 text-[--color-success] border-mix-success-30',
	ghost:   'bg-transparent border-transparent',
};

const sizes: Record<string, string> = {
	sm: 'px-[--spacing-sm] py-[--spacing-xs] min-h-8 text-xs',
	md: 'px-[--spacing-md] py-[--spacing-sm] min-h-11 text-sm',
	lg: 'px-[--spacing-lg] py-[--spacing-md] min-h-13 text-base',
};

export function Button(props: ButtonProps) {
	const merged = mergeProps({ size: 'md' as const, iconPosition: 'left' as const, pill: false, disabled: false, loading: false }, props);
	const [local, rest] = splitProps(merged, ['variant', 'size', 'icon', 'iconPosition', 'pill', 'disabled', 'loading', 'class', 'children', 'onClick']);

	const theme = useTheme();
	const isCrystal = () => theme.mode === 'crystal';

	const variantClass = () => {
		const variants = isCrystal() ? glassVariants : neuVariants;
		if (local.variant) return variants[local.variant];
		return isCrystal()
			? 'bg-mix-surface-60 text-[--color-on-background] border-mix-on-background-15'
			: 'bg-[--color-surface] text-[--color-on-background] border-mix-on-background-10';
	};

	const radiusClass = () => local.pill ? 'rounded-[--radius-full]' : 'rounded-[--radius-sm]';
	const isDisabled = () => local.disabled || local.loading;

	return (
		<button
			class={`omnidea-btn ${base} ${variantClass()} ${sizes[local.size]} ${radiusClass()} ${isDisabled() ? 'opacity-40 pointer-events-none' : ''} ${local.class ?? ''}`}
			disabled={isDisabled()}
			onClick={local.onClick}
			{...rest}
		>
			{local.loading ? (
				<span class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
			) : local.icon && local.iconPosition === 'left' ? (
				<i class={`ri-${local.icon}`} />
			) : null}
			{local.children}
			{!local.loading && local.icon && local.iconPosition === 'right' ? (
				<i class={`ri-${local.icon}`} />
			) : null}
		</button>
	);
}
