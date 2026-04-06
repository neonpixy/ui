import { mergeProps, For, Show } from 'solid-js';
import { useTheme } from '../theme/context.js';

interface SortBarProps {
	active?: string;
	onActiveChange?: (sort: string) => void;
	options?: Array<{ id: string; label: string; icon?: string }>;
	timeFilter?: string;
	onTimeFilterChange?: (time: string) => void;
	showTimeFilter?: boolean;
	class?: string;
}

const defaultOptions = [
	{ id: 'hot', label: 'Hot', icon: 'fire-line' },
	{ id: 'new', label: 'New', icon: 'time-line' },
	{ id: 'top', label: 'Top', icon: 'bar-chart-line' },
	{ id: 'rising', label: 'Rising', icon: 'rocket-line' },
];

const timeOptions = [
	{ value: 'hour', label: 'Past Hour' },
	{ value: 'day', label: 'Today' },
	{ value: 'week', label: 'This Week' },
	{ value: 'month', label: 'This Month' },
	{ value: 'year', label: 'This Year' },
	{ value: 'all', label: 'All Time' },
];

export function SortBar(props: SortBarProps) {
	const merged = mergeProps({ active: 'hot', showTimeFilter: false, timeFilter: 'day' }, props);
	const theme = useTheme();
	const isCrystal = () => theme.mode === 'crystal';

	const items = () => merged.options ?? defaultOptions;

	const barBorder = () => isCrystal()
		? 'border-mix-on-background-12'
		: 'border-[--color-mid-gray]';

	const activeClass = () => isCrystal()
		? 'text-[--color-accent] border-mix-accent-60'
		: 'text-[--color-accent] border-[--color-accent]';

	return (
		<div class={`flex items-center gap-[--spacing-xs] ${merged.class ?? ''}`}>
			<div class={`flex gap-1 border-b ${barBorder()}`}>
				<For each={items()}>
					{(item) => (
						<button
							class={`px-[--spacing-sm] py-[--spacing-xs] text-sm font-medium cursor-pointer transition-[color,border-color] duration-150 border-b-2 -mb-px bg-transparent border-x-0 border-t-0 ${merged.active === item.id ? activeClass() : 'text-[--color-secondary] border-transparent'}`}
							onClick={() => merged.onActiveChange?.(item.id)}
						>
							<Show when={item.icon}>
								<i class={`ri-${item.icon} mr-1`} />
							</Show>
							{item.label}
						</button>
					)}
				</For>
			</div>

			<Show when={merged.showTimeFilter && merged.active === 'top'}>
				<select
					class={`text-xs px-[--spacing-xs] py-1 rounded-[--radius-sm] border border-mix-on-background-15 bg-[--color-surface] text-[--color-on-background] cursor-pointer`}
					value={merged.timeFilter}
					onChange={(e) => merged.onTimeFilterChange?.(e.currentTarget.value)}
				>
					<For each={timeOptions}>
						{(opt) => <option value={opt.value}>{opt.label}</option>}
					</For>
				</select>
			</Show>
		</div>
	);
}
