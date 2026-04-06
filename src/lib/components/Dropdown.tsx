import { Show, createEffect, createSignal, onCleanup, type JSX, type ParentProps } from 'solid-js';
import { mergeProps } from 'solid-js';

interface DropdownProps extends ParentProps {
	trigger: JSX.Element;
	align?: 'start' | 'center' | 'end';
	class?: string;
}

const alignMap: Record<string, string> = {
	start: 'left-0',
	center: 'left-1/2 -translate-x-1/2',
	end: 'right-0',
};

export function Dropdown(props: DropdownProps) {
	const merged = mergeProps({ align: 'start' as const }, props);
	const [isOpen, setIsOpen] = createSignal(false);

	function handleClickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('.omnidea-dropdown')) {
			setIsOpen(false);
		}
	}

	createEffect(() => {
		if (isOpen()) {
			document.addEventListener('click', handleClickOutside);
			onCleanup(() => document.removeEventListener('click', handleClickOutside));
		}
	});

	return (
		<div class={`omnidea-dropdown relative inline-block ${merged.class ?? ''}`}>
			<div onClick={() => setIsOpen(!isOpen())}>
				{merged.trigger}
			</div>

			<Show when={isOpen()}>
				<div class={`absolute z-40 mt-1 ${alignMap[merged.align]} bg-[--color-surface] rounded-[--radius-md] shadow-[--shadow-elevated] border border-mix-on-background-8 py-1 min-w-40`}>
					{merged.children}
				</div>
			</Show>
		</div>
	);
}
