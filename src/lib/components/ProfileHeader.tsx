import { mergeProps, Show, For } from 'solid-js';
import { useTheme } from '../theme/context.js';
import { Avatar } from '../atoms/Avatar.js';
import { Badge } from '../atoms/Badge.js';
import { StatGroup } from '../atoms/StatGroup.js';
import { Button } from './Button.js';
import { GlassPane } from '../crystal/GlassPane.js';

interface ProfileHeaderProps {
	name: string;
	handle?: string;
	avatar?: string;
	bio?: string;
	banner?: string;
	stats?: Array<{ label: string; value: number | string }>;
	isOwner?: boolean;
	isFollowing?: boolean;
	onFollow?: () => void;
	onEdit?: () => void;
	badges?: Array<{ label: string; variant?: string }>;
	class?: string;
}

// Reuse Avatar's hash algorithm for banner gradient fallback
function hashHue(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	return Math.abs(hash) % 360;
}

export function ProfileHeader(props: ProfileHeaderProps) {
	const merged = mergeProps({}, props);
	const theme = useTheme();
	const isCrystal = () => theme.mode === 'crystal';

	const bannerGradient = () => {
		const h = hashHue(merged.name);
		return `linear-gradient(135deg, hsl(${h}, 50%, 35%), hsl(${(h + 40) % 360}, 60%, 25%))`;
	};

	const inner = () => (
		<div class="flex flex-col">
			{/* Banner */}
			<div
				class="h-48 rounded-t-[--radius-lg] overflow-hidden bg-cover bg-center"
				style={merged.banner
					? { "background-image": `url(${merged.banner})` }
					: { background: bannerGradient() }
				}
			/>

			{/* Profile info */}
			<div class="px-[--spacing-lg] pb-[--spacing-lg]">
				{/* Avatar row — overlaps banner */}
				<div class="flex items-end justify-between -mt-10">
					<div class="ring-4 ring-[--color-surface] rounded-full">
						<Avatar name={merged.name} src={merged.avatar} size="xl" />
					</div>

					<div class="pb-1">
						<Show when={merged.isOwner}>
							<Button variant="ghost" size="sm" icon="edit-line" onClick={merged.onEdit}>
								Edit Profile
							</Button>
						</Show>
						<Show when={!merged.isOwner}>
							<Button
								variant={merged.isFollowing ? 'default' : 'primary'}
								size="sm"
								onClick={merged.onFollow}
							>
								{merged.isFollowing ? 'Following' : 'Follow'}
							</Button>
						</Show>
					</div>
				</div>

				{/* Name + handle + badges */}
				<div class="mt-[--spacing-sm] flex flex-col gap-[--spacing-xs]">
					<div class="flex items-center gap-[--spacing-sm] flex-wrap">
						<h2 class="text-xl font-bold text-[--color-on-background] leading-tight">{merged.name}</h2>
						<Show when={merged.badges}>
							<For each={merged.badges}>
								{(b) => <Badge variant={(b.variant as any) ?? 'default'}>{b.label}</Badge>}
							</For>
						</Show>
					</div>
					<Show when={merged.handle}>
						<span class="text-sm text-[--color-secondary]">@{merged.handle}</span>
					</Show>
				</div>

				{/* Bio */}
				<Show when={merged.bio}>
					<p class="mt-[--spacing-sm] text-sm text-[--color-on-background] leading-relaxed" style="opacity:0.85">
						{merged.bio}
					</p>
				</Show>

				{/* Stats */}
				<Show when={merged.stats && merged.stats.length > 0}>
					<div class="mt-[--spacing-md]">
						<StatGroup stats={merged.stats!} />
					</div>
				</Show>
			</div>
		</div>
	);

	return isCrystal() ? (
		<GlassPane elevation="card" class={`overflow-hidden ${merged.class ?? ''}`}>
			{inner()}
		</GlassPane>
	) : (
		<div class={`bg-[--color-surface] rounded-[--radius-lg] border border-mix-on-background-8 shadow-[--shadow-raised] overflow-hidden ${merged.class ?? ''}`}>
			{inner()}
		</div>
	);
}
