import { mergeProps, Show, For } from 'solid-js';
import { useTheme } from '../theme/context.js';
import { Avatar } from '../atoms/Avatar.js';
import { Badge } from '../atoms/Badge.js';
import { Tag } from '../atoms/Tag.js';
import { Image } from '../atoms/Image.js';
import { VoteGroup } from '../atoms/VoteGroup.js';
import { GlassPane } from '../crystal/GlassPane.js';
import { ReactionBar } from './ReactionBar.js';

interface PostAuthor {
	name: string;
	avatar?: string;
	handle?: string;
}

interface PostCardProps {
	author: PostAuthor;
	timestamp: string;
	title?: string;
	content?: string;
	media?: Array<{ src: string; alt?: string }>;
	tags?: Array<{ label: string; variant?: string }>;
	collective?: { name: string; icon?: string };
	score?: number;
	vote?: 'up' | 'down' | null;
	likes?: number;
	replies?: number;
	reposts?: number;
	liked?: boolean;
	reposted?: boolean;
	pinned?: boolean;
	onVote?: (vote: 'up' | 'down' | null) => void;
	onLike?: () => void;
	onReply?: () => void;
	onRepost?: () => void;
	onShare?: () => void;
	onClick?: () => void;
	class?: string;
}

export type { PostAuthor };

export function PostCard(props: PostCardProps) {
	const merged = mergeProps({}, props);
	const theme = useTheme();
	const isCrystal = () => theme.mode === 'crystal';

	const hasVoting = () => merged.score != null;

	const mediaGrid = () => {
		const m = merged.media;
		if (!m || m.length === 0) return null;
		if (m.length === 1) return 'grid-cols-1';
		return 'grid-cols-2';
	};

	const inner = () => (
		<div class="flex gap-[--spacing-md]">
			{/* Vote column (Reddit side) */}
			<Show when={hasVoting()}>
				<div class="shrink-0 pt-1">
					<VoteGroup
						score={merged.score!}
						vote={merged.vote}
						onVote={merged.onVote}
						size="md"
					/>
				</div>
			</Show>

			{/* Content column */}
			<div class="flex-1 min-w-0 flex flex-col gap-[--spacing-sm]">
				{/* Header */}
				<div class="flex items-center gap-[--spacing-sm] flex-wrap">
					<Avatar name={merged.author.name} src={merged.author.avatar} size="sm" />
					<span class="font-semibold text-sm text-[--color-on-background]">{merged.author.name}</span>
					<Show when={merged.author.handle}>
						<span class="text-xs text-[--color-secondary]">@{merged.author.handle}</span>
					</Show>
					<Show when={merged.collective}>
						<span class="text-[--color-secondary] text-xs">in</span>
						<Badge variant="info">{merged.collective!.name}</Badge>
					</Show>
					<span class="text-xs text-[--color-secondary]">{merged.timestamp}</span>
					<Show when={merged.pinned}>
						<Badge variant="warning">
							<i class="ri-pushpin-fill mr-0.5" />Pinned
						</Badge>
					</Show>
				</div>

				{/* Title */}
				<Show when={merged.title}>
					<h3
						class="text-base font-semibold text-[--color-on-background] leading-snug cursor-pointer hover:text-[--color-accent] transition-colors duration-150"
						onClick={merged.onClick}
					>
						{merged.title}
					</h3>
				</Show>

				{/* Content */}
				<Show when={merged.content}>
					<p class="text-sm text-[--color-on-background] leading-relaxed" style="opacity:0.85">
						{merged.content}
					</p>
				</Show>

				{/* Media */}
				<Show when={merged.media && merged.media.length > 0}>
					<div class={`grid ${mediaGrid()} gap-[--spacing-xs] rounded-[--radius-md] overflow-hidden`}>
						<For each={merged.media!.slice(0, 4)}>
							{(m) => (
								<Image
									src={m.src}
									alt={m.alt ?? ''}
									fit="cover"
									radius="md"
									class="w-full h-48"
								/>
							)}
						</For>
					</div>
				</Show>

				{/* Tags */}
				<Show when={merged.tags && merged.tags.length > 0}>
					<div class="flex gap-[--spacing-xs] flex-wrap">
						<For each={merged.tags}>
							{(tag) => <Tag variant={(tag.variant as any) ?? 'default'}>{tag.label}</Tag>}
						</For>
					</div>
				</Show>

				{/* Reactions */}
				<ReactionBar
					likes={merged.likes}
					replies={merged.replies}
					reposts={merged.reposts}
					liked={merged.liked}
					reposted={merged.reposted}
					onLike={merged.onLike}
					onReply={merged.onReply}
					onRepost={merged.onRepost}
					onShare={merged.onShare}
				/>
			</div>
		</div>
	);

	const cardBase = 'transition-shadow duration-150 hover:shadow-[--shadow-elevated]';

	return isCrystal() ? (
		<GlassPane elevation="card" class={`${cardBase} ${merged.class ?? ''}`}>
			<div class="p-[--spacing-md]">{inner()}</div>
		</GlassPane>
	) : (
		<div class={`bg-[--color-surface] rounded-[--radius-lg] p-[--spacing-md] border border-mix-on-background-8 shadow-[--shadow-raised] ${cardBase} ${merged.class ?? ''}`}>
			{inner()}
		</div>
	);
}
