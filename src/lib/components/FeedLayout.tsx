import { Show, onMount, onCleanup, type JSX, type ParentProps } from 'solid-js';
import { Skeleton } from '../atoms/Skeleton.js';
import { EmptyState } from '../atoms/EmptyState.js';
import { SortBar } from './SortBar.js';

interface FeedLayoutProps extends ParentProps {
	sortActive?: string;
	onSortChange?: (sort: string) => void;
	sortOptions?: Array<{ id: string; label: string; icon?: string }>;
	loading?: boolean;
	hasMore?: boolean;
	onLoadMore?: () => void;
	emptyIcon?: string;
	emptyTitle?: string;
	emptyDescription?: string;
	header?: JSX.Element;
	class?: string;
}

function LoadingSkeleton() {
	return (
		<div class="flex flex-col gap-[--spacing-md]">
			{[0, 1, 2].map(() => (
				<div class="flex gap-[--spacing-md] p-[--spacing-md]">
					<Skeleton width="48px" height="48px" variant="circular" />
					<div class="flex-1 flex flex-col gap-[--spacing-xs]">
						<Skeleton width="30%" height="16px" />
						<Skeleton width="80%" height="14px" />
						<Skeleton width="60%" height="14px" />
					</div>
				</div>
			))}
		</div>
	);
}

export function FeedLayout(props: FeedLayoutProps) {
	let sentinelRef: HTMLDivElement | undefined;

	onMount(() => {
		if (!props.onLoadMore) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting && props.hasMore && !props.loading) {
					props.onLoadMore?.();
				}
			},
			{ rootMargin: '200px' }
		);
		if (sentinelRef) observer.observe(sentinelRef);
		onCleanup(() => observer.disconnect());
	});

	const hasChildren = () => {
		const c = props.children;
		if (Array.isArray(c)) return c.length > 0;
		return c != null;
	};

	return (
		<div class={`max-w-3xl mx-auto flex flex-col gap-[--spacing-md] ${props.class ?? ''}`}>
			{/* Header slot (ComposeBox, etc.) */}
			<Show when={props.header}>
				{props.header}
			</Show>

			{/* Sort bar */}
			<Show when={props.sortOptions || props.onSortChange}>
				<SortBar
					active={props.sortActive}
					onActiveChange={props.onSortChange}
					options={props.sortOptions}
				/>
			</Show>

			{/* Feed items */}
			<Show
				when={hasChildren() || props.loading}
				fallback={
					<EmptyState
						icon={props.emptyIcon ?? 'chat-3-line'}
						title={props.emptyTitle ?? 'No posts yet'}
						description={props.emptyDescription ?? 'Be the first to share something.'}
					/>
				}
			>
				<div class="flex flex-col gap-[--spacing-md]">
					{props.children}
				</div>
			</Show>

			{/* Loading */}
			<Show when={props.loading}>
				<LoadingSkeleton />
			</Show>

			{/* Infinite scroll sentinel */}
			<Show when={props.hasMore && !props.loading}>
				<div ref={(el) => { sentinelRef = el; }} class="h-1" />
			</Show>
		</div>
	);
}
