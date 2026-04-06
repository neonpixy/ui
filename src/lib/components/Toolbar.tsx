import { For, Show, type JSX } from 'solid-js';
import { useTheme } from '../theme/context.js';

interface ToolbarItem {
	id: string;
	icon: string;
	label: string;
	active?: boolean;
	disabled?: boolean;
}

interface ToolbarGroup {
	items: ToolbarItem[];
}

interface ToolbarProps {
	groups: ToolbarGroup[];
	class?: string;
	extra?: JSX.Element;
	onAction?: (id: string) => void;
}

export function Toolbar(props: ToolbarProps) {
	const theme = useTheme();
	const isCrystal = () => theme.mode === 'crystal';

	const bgClass = () =>
		isCrystal()
			? 'bg-mix-surface-50 backdrop-blur-lg border-mix-on-background-10'
			: 'bg-[--color-surface] border-mix-on-background-8';

	const activeBg = () =>
		isCrystal()
			? 'bg-mix-accent-20 text-[--color-accent]'
			: 'bg-mix-accent-12 text-[--color-accent]';

	const hoverBg = () =>
		isCrystal()
			? 'hover:bg-mix-on-background-8'
			: 'hover:bg-[--color-mid-gray]';

	const dividerClass = () =>
		isCrystal()
			? 'bg-mix-on-background-12'
			: 'bg-[--color-mid-gray]';

	return (
		<div
			class={`toolbar flex items-center gap-0.5 px-[--spacing-xs] py-[--spacing-xs] border rounded-[--radius-md] ${bgClass()} ${props.class ?? ''}`}
			role="toolbar"
		>
			<For each={props.groups}>
				{(group, gi) => (
					<>
						<Show when={gi() > 0}>
							<div class={`w-px h-5 mx-1 flex-shrink-0 ${dividerClass()}`} />
						</Show>

						<For each={group.items}>
							{(item) => (
								<button
									class={`toolbar-btn w-8 h-8 flex items-center justify-center rounded-[--radius-sm] text-sm cursor-pointer transition-[background,color] duration-100 ${item.active ? activeBg() : 'text-[--color-on-background]'} ${item.disabled ? 'opacity-30 pointer-events-none' : ''} ${item.active ? '' : hoverBg()}`}
									title={item.label}
									aria-label={item.label}
									aria-pressed={item.active ?? false}
									disabled={item.disabled}
									onClick={() => props.onAction?.(item.id)}
								>
									<i class={`ri-${item.icon}`} />
								</button>
							)}
						</For>
					</>
				)}
			</For>

			<Show when={props.extra}>
				<div class="ml-auto flex items-center">
					{props.extra}
				</div>
			</Show>
		</div>
	);
}
