import { mergeProps, Show, type JSX } from 'solid-js';
import { useTheme } from '../theme/context.js';
import { Avatar } from '../atoms/Avatar.js';
import { VoteGroup } from '../atoms/VoteGroup.js';

interface CommentNodeProps {
	id: string;
	author: { name: string; avatar?: string; handle?: string };
	timestamp: string;
	content: string;
	score?: number;
	vote?: 'up' | 'down' | null;
	liked?: boolean;
	likes?: number;
	depth?: number;
	collapsed?: boolean;
	childCount?: number;
	onVote?: (vote: 'up' | 'down' | null) => void;
	onLike?: () => void;
	onReply?: () => void;
	onCollapse?: () => void;
	children?: JSX.Element;
	class?: string;
}

const MAX_DEPTH = 6;
const INDENT_PX = 20;

export type { CommentNodeProps };

export function CommentNode(props: CommentNodeProps) {
	const merged = mergeProps({ depth: 0, collapsed: false }, props);
	const theme = useTheme();
	const isCrystal = () => theme.mode === 'crystal';

	const indent = () => Math.min(merged.depth, MAX_DEPTH) * INDENT_PX;

	const threadLineColor = () => isCrystal()
		? 'border-mix-on-background-15'
		: 'border-mix-on-background-10';

	const hoverBg = () => isCrystal()
		? 'hover:bg-mix-on-background-4'
		: 'hover:bg-mix-on-background-3';

	const actionBtn = 'bg-transparent border-none cursor-pointer text-xs text-[--color-secondary] hover:text-[--color-accent] transition-colors duration-150 px-1 py-0.5 rounded-[--radius-sm]';

	return (
		<div class={`${merged.class ?? ''}`} style={{ "padding-left": `${indent()}px` }}>
			<div class={`flex gap-[--spacing-sm] ${merged.depth > 0 ? `border-l-2 ${threadLineColor()} pl-[--spacing-sm]` : ''}`}>
				{/* Thread line click area */}
				<Show when={merged.depth > 0 && merged.onCollapse}>
					<button
						class="absolute left-0 top-0 bottom-0 w-4 cursor-pointer bg-transparent border-none"
						onClick={merged.onCollapse}
						aria-label="Collapse thread"
					/>
				</Show>

				<div class={`flex-1 rounded-[--radius-sm] p-[--spacing-xs] ${hoverBg()} transition-colors duration-100`}>
					{/* Collapsed view */}
					<Show when={merged.collapsed}>
						<button
							class={`${actionBtn} font-medium`}
							onClick={merged.onCollapse}
						>
							<i class="ri-add-line mr-1" />
							<span class="font-semibold">{merged.author.name}</span>
							<Show when={merged.childCount}>
								<span class="ml-1">{merged.childCount} {merged.childCount === 1 ? 'reply' : 'replies'}</span>
							</Show>
						</button>
					</Show>

					{/* Expanded view */}
					<Show when={!merged.collapsed}>
						<div class="flex flex-col gap-[--spacing-xs]">
							{/* Header */}
							<div class="flex items-center gap-[--spacing-xs]">
								<Avatar name={merged.author.name} src={merged.author.avatar} size="sm" />
								<span class="text-sm font-semibold text-[--color-on-background]">{merged.author.name}</span>
								<Show when={merged.author.handle}>
									<span class="text-xs text-[--color-secondary]">@{merged.author.handle}</span>
								</Show>
								<span class="text-xs text-[--color-secondary]">{merged.timestamp}</span>
							</div>

							{/* Content */}
							<p class="text-sm text-[--color-on-background] leading-relaxed pl-10" style="opacity:0.9">
								{merged.content}
							</p>

							{/* Actions */}
							<div class="flex items-center gap-[--spacing-xs] pl-10">
								<Show when={merged.score != null}>
									<VoteGroup
										score={merged.score!}
										vote={merged.vote}
										onVote={merged.onVote}
										size="sm"
										compact
									/>
								</Show>

								<button class={actionBtn} onClick={merged.onLike}>
									<i class={`${merged.liked ? 'ri-heart-fill text-[--color-danger]' : 'ri-heart-line'} mr-0.5`} />
									<Show when={merged.likes}>{merged.likes}</Show>
								</button>

								<button class={actionBtn} onClick={merged.onReply}>
									<i class="ri-reply-line mr-0.5" />Reply
								</button>

								<Show when={merged.onCollapse && merged.depth > 0}>
									<button class={actionBtn} onClick={merged.onCollapse}>
										<i class="ri-contract-up-down-line mr-0.5" />Collapse
									</button>
								</Show>
							</div>
						</div>
					</Show>
				</div>
			</div>

			{/* Children */}
			<Show when={!merged.collapsed && merged.children}>
				{merged.children}
			</Show>
		</div>
	);
}
