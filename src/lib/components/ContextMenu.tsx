import { createSignal, createEffect, onCleanup, For, Show, type ParentProps } from 'solid-js';
import { useTheme } from '../theme/context.js';

interface MenuItem {
	id: string;
	label: string;
	icon?: string;
	shortcut?: string;
	variant?: 'default' | 'danger';
	disabled?: boolean;
	separator?: boolean;
}

interface ContextMenuProps extends ParentProps {
	items: MenuItem[];
	class?: string;
	onAction?: (id: string) => void;
}

export function ContextMenu(props: ContextMenuProps) {
	const theme = useTheme();
	const isCrystal = () => theme.mode === 'crystal';

	const [isOpen, setIsOpen] = createSignal(false);
	const [x, setX] = createSignal(0);
	const [y, setY] = createSignal(0);

	const bgClass = () =>
		isCrystal()
			? 'bg-mix-surface-80 backdrop-blur-xl border-mix-on-background-12'
			: 'bg-[--color-surface] border-mix-on-background-8';

	const hoverBg = () =>
		isCrystal()
			? 'hover:bg-mix-accent-15'
			: 'hover:bg-mix-accent-10';

	function handleContextMenu(e: MouseEvent) {
		e.preventDefault();
		setX(e.clientX);
		setY(e.clientY);
		setIsOpen(true);
	}

	function handleAction(id: string) {
		setIsOpen(false);
		props.onAction?.(id);
	}

	createEffect(() => {
		if (isOpen()) {
			const handleClickOutside = (e: MouseEvent) => {
				if (!(e.target as HTMLElement)?.closest('.omnidea-context-menu')) {
					setIsOpen(false);
				}
			};
			const handleKeydown = (e: KeyboardEvent) => {
				if (e.key === 'Escape') setIsOpen(false);
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
		<>
			<div class={`inline-block ${props.class ?? ''}`} onContextMenu={handleContextMenu}>
				{props.children}
			</div>

			<Show when={isOpen()}>
				<div
					class={`omnidea-context-menu fixed z-50 py-1 min-w-44 ${bgClass()} border rounded-[--radius-md] shadow-[--shadow-floating]`}
					style={{ left: `${x()}px`, top: `${y()}px` }}
					role="menu"
				>
					<For each={props.items}>
						{(item) => (
							<>
								{item.separator ? (
									<div class="my-1 border-t border-[--color-mid-gray]" />
								) : (
									<button
										class={`w-full px-3 py-1.5 flex items-center gap-[--spacing-sm] text-sm cursor-pointer transition-[background] duration-100 ${hoverBg()} ${item.variant === 'danger' ? 'text-[--color-danger]' : 'text-[--color-on-background]'} ${item.disabled ? 'opacity-30 pointer-events-none' : ''}`}
										role="menuitem"
										disabled={item.disabled}
										onClick={() => handleAction(item.id)}
									>
										{item.icon ? (
											<i class={`ri-${item.icon} w-4 text-center text-xs`} />
										) : (
											<span class="w-4" />
										)}
										<span class="flex-1 text-left">{item.label}</span>
										{item.shortcut ? (
											<span class="text-xs text-[--color-secondary] ml-4">{item.shortcut}</span>
										) : null}
									</button>
								)}
							</>
						)}
					</For>
				</div>
			</Show>
		</>
	);
}
