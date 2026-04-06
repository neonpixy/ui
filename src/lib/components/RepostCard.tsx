import { mergeProps, Show, For } from 'solid-js';
import { useTheme } from '../theme/context.js';
import { Avatar } from '../atoms/Avatar.js';
import { Image } from '../atoms/Image.js';

interface RepostCardProps {
	author: { name: string; avatar?: string; handle?: string };
	timestamp: string;
	content?: string;
	media?: Array<{ src: string; alt?: string }>;
	onClick?: () => void;
	class?: string;
}

export function RepostCard(props: RepostCardProps) {
	const merged = mergeProps({}, props);
	const theme = useTheme();
	const isCrystal = () => theme.mode === 'crystal';

	const borderClass = () => isCrystal()
		? 'border-mix-on-background-15 bg-mix-surface-30'
		: 'border-mix-on-background-10 bg-mix-on-background-2';

	return (
		<div
			class={`rounded-[--radius-md] border p-[--spacing-sm] cursor-pointer transition-colors duration-150 hover:bg-mix-on-background-4 ${borderClass()} ${merged.class ?? ''}`}
			onClick={merged.onClick}
		>
			<div class="flex gap-[--spacing-sm]">
				{/* Content side */}
				<div class="flex-1 min-w-0 flex flex-col gap-[--spacing-xs]">
					{/* Header */}
					<div class="flex items-center gap-[--spacing-xs]">
						<Avatar name={merged.author.name} src={merged.author.avatar} size="sm" />
						<span class="text-xs font-semibold text-[--color-on-background]">{merged.author.name}</span>
						<Show when={merged.author.handle}>
							<span class="text-xs text-[--color-secondary]">@{merged.author.handle}</span>
						</Show>
						<span class="text-xs text-[--color-secondary]">{merged.timestamp}</span>
					</div>

					{/* Truncated content */}
					<Show when={merged.content}>
						<p class="text-xs text-[--color-on-background] leading-relaxed line-clamp-2" style="opacity:0.8;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">
							{merged.content}
						</p>
					</Show>
				</div>

				{/* Thumbnail */}
				<Show when={merged.media && merged.media.length > 0}>
					<Image
						src={merged.media![0].src}
						alt={merged.media![0].alt ?? ''}
						fit="cover"
						radius="sm"
						class="w-16 h-16 shrink-0"
					/>
				</Show>
			</div>
		</div>
	);
}
