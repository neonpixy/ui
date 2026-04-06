import { mergeProps, Show } from 'solid-js';
import { useTheme } from '../theme/context.js';

interface ReactionBarProps {
	likes?: number;
	replies?: number;
	reposts?: number;
	liked?: boolean;
	reposted?: boolean;
	onLike?: () => void;
	onReply?: () => void;
	onRepost?: () => void;
	onShare?: () => void;
	compact?: boolean;
	class?: string;
}

export function ReactionBar(props: ReactionBarProps) {
	const merged = mergeProps({ compact: false }, props);
	const theme = useTheme();
	const isCrystal = () => theme.mode === 'crystal';

	const btnBase = () => {
		const base = 'inline-flex items-center gap-1.5 border-none cursor-pointer transition-colors duration-150 rounded-[--radius-sm]';
		const pad = merged.compact ? 'px-1 py-0.5' : 'px-2 py-1';
		const hover = isCrystal() ? 'hover:bg-mix-on-background-8' : 'hover:bg-mix-on-background-6';
		const text = merged.compact ? 'text-xs' : 'text-sm';
		return `${base} ${pad} ${hover} ${text} bg-transparent`;
	};

	const count = (n?: number) => n != null && n > 0 ? n : null;

	return (
		<div class={`flex items-center gap-[--spacing-sm] ${merged.class ?? ''}`}>
			{/* Like */}
			<button
				class={`${btnBase()} ${merged.liked ? 'text-[--color-danger]' : 'text-[--color-secondary]'}`}
				onClick={merged.onLike}
				aria-label="Like"
			>
				<i class={merged.liked ? 'ri-heart-fill' : 'ri-heart-line'} />
				<Show when={count(merged.likes)}>
					<span class="tabular-nums">{merged.likes}</span>
				</Show>
			</button>

			{/* Reply */}
			<button
				class={`${btnBase()} text-[--color-secondary]`}
				onClick={merged.onReply}
				aria-label="Reply"
			>
				<i class="ri-chat-3-line" />
				<Show when={count(merged.replies)}>
					<span class="tabular-nums">{merged.replies}</span>
				</Show>
			</button>

			{/* Repost */}
			<button
				class={`${btnBase()} ${merged.reposted ? 'text-[--color-accent]' : 'text-[--color-secondary]'}`}
				onClick={merged.onRepost}
				aria-label="Repost"
			>
				<i class={merged.reposted ? 'ri-repeat-fill' : 'ri-repeat-line'} />
				<Show when={count(merged.reposts)}>
					<span class="tabular-nums">{merged.reposts}</span>
				</Show>
			</button>

			{/* Share */}
			<button
				class={`${btnBase()} text-[--color-secondary]`}
				onClick={merged.onShare}
				aria-label="Share"
			>
				<i class="ri-share-forward-line" />
			</button>
		</div>
	);
}
