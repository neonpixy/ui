import { For, type ParentProps } from 'solid-js';
import { useTheme } from '../theme/context.js';

interface TabsProps extends ParentProps {
	items: Array<{ id: string; label: string; icon?: string }>;
	active?: string;
	onActiveChange?: (id: string) => void;
	class?: string;
}

export function Tabs(props: TabsProps) {
	const theme = useTheme();
	const isCrystal = () => theme.mode === 'crystal';

	const activeId = () => props.active ?? props.items[0]?.id ?? '';

	const barBorder = () => isCrystal()
		? 'border-mix-on-background-10'
		: 'border-mix-on-background-8';

	const activeStyle = () => isCrystal()
		? 'text-[--color-accent] border-[--color-accent]'
		: 'text-[--color-accent] border-[--color-accent]';

	const inactiveStyle = () => isCrystal()
		? 'text-[--color-secondary] border-transparent hover:text-[--color-on-background] hover:bg-mix-on-background-5'
		: 'text-[--color-secondary] border-transparent hover:text-[--color-on-background] hover:bg-mix-on-background-4';

	return (
		<div class={`flex flex-col gap-[--spacing-md] ${props.class ?? ''}`}>
			<div class={`flex border-b ${barBorder()}`} role="tablist">
				<For each={props.items}>
					{(item) => (
						<button
							role="tab"
							aria-selected={activeId() === item.id}
							class={`px-[--spacing-md] py-[--spacing-sm] text-sm font-medium cursor-pointer border-b-2 -mb-px bg-transparent border-t-0 border-x-0 rounded-t-[--radius-sm] transition-all duration-150 ${activeId() === item.id ? activeStyle() : inactiveStyle()}`}
							onClick={() => props.onActiveChange?.(item.id)}
						>
							{item.icon ? <i class={`ri-${item.icon} mr-1.5 text-xs`} /> : null}
							{item.label}
						</button>
					)}
				</For>
			</div>

			{props.children}
		</div>
	);
}
