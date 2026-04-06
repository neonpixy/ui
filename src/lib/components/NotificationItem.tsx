import { mergeProps } from 'solid-js';
import { useTheme } from '../theme/context.js';
import { Avatar } from '../atoms/Avatar.js';

type NotificationType = 'like' | 'reply' | 'repost' | 'follow' | 'mention' | 'vote';

interface NotificationItemProps {
	type: NotificationType;
	actor: { name: string; avatar?: string };
	target?: string;
	timestamp: string;
	read?: boolean;
	onClick?: () => void;
	class?: string;
}

const typeConfig: Record<NotificationType, { icon: string; color: string; verb: string }> = {
	like:    { icon: 'ri-heart-fill',        color: 'text-[--color-danger]',  verb: 'liked' },
	reply:   { icon: 'ri-chat-3-fill',       color: 'text-[--color-accent]',  verb: 'replied to' },
	repost:  { icon: 'ri-repeat-fill',       color: 'text-[--color-success]', verb: 'reposted' },
	follow:  { icon: 'ri-user-add-fill',     color: 'text-[--color-info]',    verb: 'followed you' },
	mention: { icon: 'ri-at-line',           color: 'text-[--color-warning]', verb: 'mentioned you in' },
	vote:    { icon: 'ri-arrow-up-s-fill',   color: 'text-[--color-accent]',  verb: 'upvoted' },
};

export function NotificationItem(props: NotificationItemProps) {
	const merged = mergeProps({ read: false }, props);
	const theme = useTheme();
	const isCrystal = () => theme.mode === 'crystal';

	const config = () => typeConfig[merged.type];

	const unreadBg = () => {
		if (merged.read) return '';
		return isCrystal() ? 'bg-mix-accent-5' : 'bg-mix-accent-3';
	};

	const hoverBg = () => isCrystal()
		? 'hover:bg-mix-on-background-6'
		: 'hover:bg-mix-on-background-4';

	const description = () => {
		const c = config();
		if (merged.type === 'follow') return `${merged.actor.name} followed you`;
		return `${merged.actor.name} ${c.verb}${merged.target ? ` ${merged.target}` : ''}`;
	};

	return (
		<div
			class={`flex items-center gap-[--spacing-sm] px-[--spacing-md] py-[--spacing-sm] cursor-pointer transition-colors duration-150 ${hoverBg()} ${unreadBg()} ${merged.class ?? ''}`}
			onClick={merged.onClick}
		>
			{/* Type icon */}
			<div class={`shrink-0 text-base ${config().color}`}>
				<i class={config().icon} />
			</div>

			{/* Actor avatar */}
			<Avatar name={merged.actor.name} src={merged.actor.avatar} size="sm" />

			{/* Description */}
			<div class="flex-1 min-w-0">
				<p class="text-sm text-[--color-on-background] truncate">
					{description()}
				</p>
			</div>

			{/* Timestamp */}
			<span class="shrink-0 text-xs text-[--color-secondary]">{merged.timestamp}</span>

			{/* Unread dot */}
			{!merged.read && (
				<div class="shrink-0 w-2 h-2 rounded-full bg-[--color-accent]" />
			)}
		</div>
	);
}
