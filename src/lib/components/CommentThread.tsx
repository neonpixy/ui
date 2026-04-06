import { createSignal, For, Show } from 'solid-js';
import { CommentNode } from './CommentNode.js';

interface Comment {
	id: string;
	author: { name: string; avatar?: string; handle?: string };
	timestamp: string;
	content: string;
	score?: number;
	vote?: 'up' | 'down' | null;
	liked?: boolean;
	likes?: number;
	children?: Comment[];
}

interface CommentThreadProps {
	comments: Comment[];
	sortBy?: 'best' | 'new' | 'top' | 'controversial';
	onSortChange?: (sort: string) => void;
	onVote?: (commentId: string, vote: 'up' | 'down' | null) => void;
	onLike?: (commentId: string) => void;
	onReply?: (commentId: string) => void;
	maxDepth?: number;
	class?: string;
}

export type { Comment };

const sortOptions = [
	{ id: 'best', label: 'Best' },
	{ id: 'new', label: 'New' },
	{ id: 'top', label: 'Top' },
	{ id: 'controversial', label: 'Controversial' },
];

function countChildren(comment: Comment): number {
	if (!comment.children) return 0;
	return comment.children.reduce((acc, c) => acc + 1 + countChildren(c), 0);
}

export function CommentThread(props: CommentThreadProps) {
	const maxDepth = () => props.maxDepth ?? 6;
	const [collapsed, setCollapsed] = createSignal<Set<string>>(new Set());

	const toggleCollapse = (id: string) => {
		setCollapsed((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id); else next.add(id);
			return next;
		});
	};

	const activeSort = () => props.sortBy ?? 'best';

	const sortTabClass = (id: string) => {
		const base = 'bg-transparent border-none cursor-pointer text-xs font-medium px-[--spacing-xs] py-1 rounded-[--radius-sm] transition-colors duration-150';
		return id === activeSort()
			? `${base} text-[--color-accent] bg-mix-accent-10`
			: `${base} text-[--color-secondary] hover:text-[--color-on-background]`;
	};

	function renderComments(comments: Comment[], depth: number) {
		return (
			<For each={comments}>
				{(comment) => (
					<CommentNode
						id={comment.id}
						author={comment.author}
						timestamp={comment.timestamp}
						content={comment.content}
						score={comment.score}
						vote={comment.vote}
						liked={comment.liked}
						likes={comment.likes}
						depth={depth}
						collapsed={collapsed().has(comment.id)}
						childCount={countChildren(comment)}
						onVote={(v) => props.onVote?.(comment.id, v)}
						onLike={() => props.onLike?.(comment.id)}
						onReply={() => props.onReply?.(comment.id)}
						onCollapse={() => toggleCollapse(comment.id)}
					>
						<Show when={comment.children && comment.children.length > 0}>
							<Show
								when={depth < maxDepth()}
								fallback={
									<div style={{ "padding-left": `${Math.min(depth + 1, 6) * 20}px` }}>
										<button class="bg-transparent border-none cursor-pointer text-xs text-[--color-accent] hover:underline px-[--spacing-xs] py-1">
											Show more replies ({countChildren(comment)})
										</button>
									</div>
								}
							>
								{renderComments(comment.children!, depth + 1)}
							</Show>
						</Show>
					</CommentNode>
				)}
			</For>
		);
	}

	return (
		<div class={`flex flex-col gap-[--spacing-sm] ${props.class ?? ''}`}>
			{/* Sort tabs */}
			<div class="flex items-center gap-1">
				<span class="text-xs text-[--color-secondary] mr-1">Sort by:</span>
				<For each={sortOptions}>
					{(opt) => (
						<button
							class={sortTabClass(opt.id)}
							onClick={() => props.onSortChange?.(opt.id)}
						>
							{opt.label}
						</button>
					)}
				</For>
			</div>

			{/* Comments */}
			{renderComments(props.comments, 0)}
		</div>
	);
}
