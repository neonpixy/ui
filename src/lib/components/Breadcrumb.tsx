import { For, mergeProps } from 'solid-js';
import { useTheme } from '../theme/context.js';

interface BreadcrumbItem {
	id: string;
	label: string;
	icon?: string;
}

interface BreadcrumbProps {
	items: BreadcrumbItem[];
	separator?: string;
	class?: string;
	onNavigate?: (item: BreadcrumbItem) => void;
}

export function Breadcrumb(props: BreadcrumbProps) {
	const merged = mergeProps({ separator: '/' }, props);

	const theme = useTheme();

	return (
		<nav aria-label="Breadcrumb" class={`flex items-center gap-1 text-sm ${merged.class ?? ''}`}>
			<For each={merged.items}>
				{(item, i) => (
					<>
						{i() > 0 ? (
							<span class="text-[--color-secondary] text-xs mx-0.5 select-none" aria-hidden="true">
								{merged.separator === 'chevron' ? (
									<i class="ri-arrow-right-s-line text-[9px]" />
								) : (
									merged.separator
								)}
							</span>
						) : null}

						{i() === merged.items.length - 1 ? (
							<span class="font-medium text-[--color-on-background] flex items-center gap-1" aria-current="page">
								{item.icon ? <i class={`ri-${item.icon} text-xs`} /> : null}
								{item.label}
							</span>
						) : (
							<button
								class="text-[--color-secondary] hover:text-[--color-accent] cursor-pointer transition-colors duration-150 flex items-center gap-1"
								onClick={() => merged.onNavigate?.(item)}
							>
								{item.icon ? <i class={`ri-${item.icon} text-xs`} /> : null}
								{item.label}
							</button>
						)}
					</>
				)}
			</For>
		</nav>
	);
}
