import { mergeProps } from 'solid-js';
import { useTheme } from '../theme/context.js';

interface VoteGroupProps {
	score: number;
	vote?: 'up' | 'down' | null;
	onVote?: (vote: 'up' | 'down' | null) => void;
	size?: 'sm' | 'md';
	compact?: boolean;
	class?: string;
}

const sizes = {
	sm: { icon: 'text-base', score: 'text-xs', gap: 'gap-0', pad: 'p-0.5' },
	md: { icon: 'text-xl', score: 'text-sm font-semibold', gap: 'gap-0.5', pad: 'p-1' },
};

export function VoteGroup(props: VoteGroupProps) {
	const merged = mergeProps({ size: 'md' as const, compact: false }, props);
	const theme = useTheme();
	const isCrystal = () => theme.mode === 'crystal';

	const handleVote = (dir: 'up' | 'down') => {
		if (!merged.onVote) return;
		merged.onVote(merged.vote === dir ? null : dir);
	};

	const btnBase = () => isCrystal()
		? 'bg-transparent border-none cursor-pointer transition-colors duration-150 rounded-[--radius-sm] hover:bg-mix-on-background-8'
		: 'bg-transparent border-none cursor-pointer transition-colors duration-150 rounded-[--radius-sm] hover:bg-mix-on-background-6';

	const upColor = () => merged.vote === 'up' ? 'text-[--color-accent]' : 'text-[--color-secondary]';
	const downColor = () => merged.vote === 'down' ? 'text-[--color-danger]' : 'text-[--color-secondary]';
	const scoreColor = () =>
		merged.vote === 'up' ? 'text-[--color-accent]'
			: merged.vote === 'down' ? 'text-[--color-danger]'
				: 'text-[--color-secondary]';

	const s = () => sizes[merged.size];
	const layout = () => merged.compact ? 'flex-row items-center gap-[--spacing-xs]' : 'flex-col items-center';

	return (
		<div class={`flex ${layout()} ${s().gap} ${merged.class ?? ''}`}>
			<button
				class={`${btnBase()} ${s().pad} ${upColor()} ${s().icon}`}
				onClick={() => handleVote('up')}
				aria-label="Upvote"
			>
				<i class={merged.vote === 'up' ? 'ri-arrow-up-s-fill' : 'ri-arrow-up-s-line'} />
			</button>

			<span class={`${s().score} ${scoreColor()} tabular-nums select-none leading-none`}>
				{merged.score}
			</span>

			<button
				class={`${btnBase()} ${s().pad} ${downColor()} ${s().icon}`}
				onClick={() => handleVote('down')}
				aria-label="Downvote"
			>
				<i class={merged.vote === 'down' ? 'ri-arrow-down-s-fill' : 'ri-arrow-down-s-line'} />
			</button>
		</div>
	);
}
