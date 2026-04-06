import { For, Show, mergeProps } from 'solid-js';
import { useTheme } from '../theme/context.js';

export interface ListItemData {
	id: string;
	title: string;
	subtitle?: string;
	icon?: string;
	image?: string;
	meta?: string;
	badge?: string;
	badgeVariant?: 'default' | 'primary' | 'danger' | 'success' | 'warning' | 'info';
}

interface ListProps {
	items: ListItemData[];
	selected?: string;
	onSelectedChange?: (id: string) => void;
	selectable?: boolean;
	dividers?: boolean;
	class?: string;
	onSelect?: (item: ListItemData) => void;
	onContextMenu?: (item: ListItemData, e: MouseEvent) => void;
}

const badgeVariantClass: Record<string, string> = {
	default: 'bg-[--color-mid-gray] text-[--color-on-background]',
	primary: 'bg-[--color-accent] text-white',
	danger:  'bg-[--color-danger] text-white',
	success: 'bg-[--color-success] text-white',
	warning: 'bg-[--color-warning] text-white',
	info:    'bg-[--color-info] text-white',
};

export function List(props: ListProps) {
	const merged = mergeProps({ selected: '', selectable: true, dividers: true }, props);

	const theme = useTheme();
	const isCrystal = () => theme.mode === 'crystal';

	const selectedBg = () =>
		isCrystal()
			? 'bg-mix-accent-12'
			: 'bg-mix-accent-8';

	const hoverBg = () =>
		isCrystal()
			? 'hover:bg-mix-on-background-5'
			: 'hover:bg-[--color-mid-gray]';

	const dividerClass = () =>
		isCrystal()
			? 'border-mix-on-background-8'
			: 'border-[--color-mid-gray]';

	return (
		<ul class={`flex flex-col ${merged.class ?? ''}`} role="listbox">
			<For each={merged.items}>
				{(item, i) => (
					<>
						<Show when={i() > 0 && merged.dividers}>
							<li class={`border-t ${dividerClass()}`} role="separator" />
						</Show>

						<li
							class={`flex items-center gap-[--spacing-sm] px-[--spacing-md] py-[--spacing-sm] ${merged.selectable ? 'cursor-pointer' : ''} transition-[background] duration-100 ${merged.selected === item.id ? selectedBg() : ''} ${merged.selectable && merged.selected !== item.id ? hoverBg() : ''}`}
							role="option"
							aria-selected={merged.selected === item.id}
							onClick={() => {
								if (merged.selectable) {
									merged.onSelectedChange?.(item.id);
									merged.onSelect?.(item);
								}
							}}
							onContextMenu={(e) => merged.onContextMenu?.(item, e)}
						>
							{item.image ? (
								<img src={item.image} alt="" class="w-9 h-9 rounded-[--radius-md] object-cover flex-shrink-0" />
							) : item.icon ? (
								<div class="w-9 h-9 flex items-center justify-center rounded-[--radius-md] bg-mix-secondary-15 flex-shrink-0">
									<i class={`ri-${item.icon} text-sm text-[--color-secondary]`} />
								</div>
							) : null}

							<div class="flex-1 min-w-0">
								<div class="text-sm font-medium text-[--color-on-background] truncate">{item.title}</div>
								<Show when={item.subtitle}>
									<div class="text-xs text-[--color-secondary] truncate">{item.subtitle}</div>
								</Show>
							</div>

							<Show when={item.badge}>
								<span class={`px-1.5 py-0.5 text-[10px] font-semibold rounded-[--radius-full] flex-shrink-0 ${badgeVariantClass[item.badgeVariant ?? 'default']}`}>
									{item.badge}
								</span>
							</Show>

							<Show when={item.meta}>
								<span class="text-xs text-[--color-secondary] flex-shrink-0">{item.meta}</span>
							</Show>
						</li>
					</>
				)}
			</For>
		</ul>
	);
}
