import { Show, createEffect, onCleanup, mergeProps, type JSX, type ParentProps } from 'solid-js';
import { useTheme } from '../theme/context.js';

interface PopoverProps extends ParentProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	position?: 'top' | 'bottom' | 'left' | 'right';
	align?: 'start' | 'center' | 'end';
	class?: string;
	trigger?: JSX.Element;
}

const posMap: Record<string, string> = {
	top:    'bottom-full mb-2',
	bottom: 'top-full mt-2',
	left:   'right-full mr-2',
	right:  'left-full ml-2',
};

const alignMap: Record<string, Record<string, string>> = {
	top:    { start: 'left-0', center: 'left-1/2 -translate-x-1/2', end: 'right-0' },
	bottom: { start: 'left-0', center: 'left-1/2 -translate-x-1/2', end: 'right-0' },
	left:   { start: 'top-0', center: 'top-1/2 -translate-y-1/2', end: 'bottom-0' },
	right:  { start: 'top-0', center: 'top-1/2 -translate-y-1/2', end: 'bottom-0' },
};

export function Popover(props: PopoverProps) {
	const merged = mergeProps({ open: false, position: 'bottom' as const, align: 'start' as const }, props);

	const theme = useTheme();
	const isCrystal = () => theme.mode === 'crystal';

	const bgClass = () =>
		isCrystal()
			? 'bg-mix-surface-80 backdrop-blur-xl border-mix-on-background-12'
			: 'bg-[--color-surface] border-mix-on-background-8';

	createEffect(() => {
		if (merged.open) {
			const handleClickOutside = (e: MouseEvent) => {
				if (!(e.target as HTMLElement)?.closest('.omnidea-popover')) {
					merged.onOpenChange?.(false);
				}
			};
			const handleKeydown = (e: KeyboardEvent) => {
				if (e.key === 'Escape') merged.onOpenChange?.(false);
			};
			document.addEventListener('click', handleClickOutside);
			document.addEventListener('keydown', handleKeydown);
			onCleanup(() => {
				document.removeEventListener('click', handleClickOutside);
				document.removeEventListener('keydown', handleKeydown);
			});
		}
	});

	return (
		<div class={`omnidea-popover relative inline-block ${merged.class ?? ''}`}>
			<Show when={merged.trigger}>
				<div onClick={() => merged.onOpenChange?.(!merged.open)}>
					{merged.trigger}
				</div>
			</Show>

			<Show when={merged.open}>
				<div
					class={`absolute z-40 ${posMap[merged.position]} ${alignMap[merged.position][merged.align]} ${bgClass()} border rounded-[--radius-lg] shadow-[--shadow-elevated] p-[--spacing-md] min-w-48`}
				>
					{merged.children}
				</div>
			</Show>
		</div>
	);
}
