import { mergeProps, For, Show } from 'solid-js';

interface StatItem {
	label: string;
	value: number | string;
	icon?: string;
}

interface StatGroupProps {
	stats: StatItem[];
	separator?: string;
	size?: 'sm' | 'md';
	class?: string;
}

const sizeMap = {
	sm: 'text-xs',
	md: 'text-sm',
};

export function StatGroup(props: StatGroupProps) {
	const merged = mergeProps({ separator: '\u00B7', size: 'md' as const }, props);

	return (
		<div class={`flex items-center gap-[--spacing-sm] flex-wrap ${sizeMap[merged.size]} ${merged.class ?? ''}`}>
			<For each={merged.stats}>
				{(stat, i) => (
					<>
						<Show when={i() > 0}>
							<span class="text-[--color-secondary] select-none">{merged.separator}</span>
						</Show>
						<span class="flex items-center gap-1">
							<Show when={stat.icon}>
								<i class={`ri-${stat.icon} text-[--color-secondary]`} />
							</Show>
							<span class="font-semibold text-[--color-on-background]">{stat.value}</span>
							<span class="text-[--color-secondary]">{stat.label}</span>
						</span>
					</>
				)}
			</For>
		</div>
	);
}
