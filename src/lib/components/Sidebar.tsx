import { Show, mergeProps, type JSX, type ParentProps } from 'solid-js';
import { useTheme } from '../theme/context.js';

interface SidebarProps extends ParentProps {
	collapsed?: boolean;
	onCollapsedChange?: (collapsed: boolean) => void;
	width?: string;
	collapsedWidth?: string;
	position?: 'left' | 'right';
	class?: string;
	header?: JSX.Element;
	footer?: JSX.Element;
}

export function Sidebar(props: SidebarProps) {
	const merged = mergeProps({
		collapsed: false,
		width: '260px',
		collapsedWidth: '52px',
		position: 'left' as const,
	}, props);

	const theme = useTheme();
	const isCrystal = () => theme.mode === 'crystal';

	const bgClass = () =>
		isCrystal()
			? 'bg-mix-surface-60 backdrop-blur-xl'
			: 'bg-[--color-surface]';

	const borderSide = () => merged.position === 'left' ? 'border-r' : 'border-l';
	const borderClass = () =>
		isCrystal()
			? 'border-mix-on-background-10'
			: 'border-[--color-mid-gray]';

	const currentWidth = () => merged.collapsed ? merged.collapsedWidth : merged.width;

	return (
		<aside
			class={`omnidea-sidebar flex flex-col h-full ${bgClass()} ${borderSide()} ${borderClass()} overflow-hidden transition-[width] duration-200 ease-in-out ${merged.class ?? ''}`}
			style={{ width: currentWidth(), 'min-width': currentWidth() }}
		>
			<Show when={merged.header}>
				<div class={`flex-shrink-0 px-[--spacing-sm] py-[--spacing-sm] ${merged.collapsed ? 'items-center' : ''}`}>
					{merged.header}
				</div>
			</Show>

			<nav class="flex-1 overflow-y-auto overflow-x-hidden px-[--spacing-sm] py-[--spacing-xs]">
				{merged.children}
			</nav>

			<Show when={merged.footer}>
				<div class={`flex-shrink-0 px-[--spacing-sm] py-[--spacing-sm] border-t ${borderClass()}`}>
					{merged.footer}
				</div>
			</Show>
		</aside>
	);
}
