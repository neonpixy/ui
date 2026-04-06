import { mergeProps, Show, For, type ParentProps } from 'solid-js';
import { useTheme } from '../theme/context.js';
import { Avatar } from '../atoms/Avatar.js';
import { Tag } from '../atoms/Tag.js';
import { StatGroup } from '../atoms/StatGroup.js';
import { Button } from './Button.js';
import { GlassPane } from '../crystal/GlassPane.js';

interface CollectiveHeaderProps extends ParentProps {
	name: string;
	icon?: string;
	description?: string;
	banner?: string;
	memberCount?: number;
	onlineCount?: number;
	isMember?: boolean;
	isAdmin?: boolean;
	tags?: string[];
	onJoin?: () => void;
	onLeave?: () => void;
	onSettings?: () => void;
	class?: string;
}

function hashHue(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	return Math.abs(hash) % 360;
}

export function CollectiveHeader(props: CollectiveHeaderProps) {
	const merged = mergeProps({}, props);
	const theme = useTheme();
	const isCrystal = () => theme.mode === 'crystal';

	const bannerGradient = () => {
		const h = hashHue(merged.name);
		return `linear-gradient(135deg, hsl(${h}, 45%, 30%), hsl(${(h + 60) % 360}, 55%, 20%))`;
	};

	const stats = () => {
		const s: Array<{ label: string; value: number | string; icon?: string }> = [];
		if (merged.memberCount != null) s.push({ label: 'members', value: merged.memberCount, icon: 'group-line' });
		if (merged.onlineCount != null) s.push({ label: 'online', value: merged.onlineCount, icon: 'circle-fill' });
		return s;
	};

	const inner = () => (
		<div class="flex flex-col">
			{/* Banner */}
			<div
				class="h-36 rounded-t-[--radius-lg] overflow-hidden bg-cover bg-center"
				style={merged.banner
					? { "background-image": `url(${merged.banner})` }
					: { background: bannerGradient() }
				}
			/>

			{/* Info */}
			<div class="px-[--spacing-lg] pb-[--spacing-md]">
				{/* Icon + name row */}
				<div class="flex items-end justify-between -mt-8">
					<div class="ring-4 ring-[--color-surface] rounded-full">
						<Avatar name={merged.name} src={merged.icon} size="lg" />
					</div>

					<div class="flex items-center gap-[--spacing-xs] pb-1">
						<Show when={merged.isAdmin}>
							<Button variant="ghost" size="sm" icon="settings-3-line" onClick={merged.onSettings} />
						</Show>
						<Show when={merged.isMember}>
							<Button variant="default" size="sm" onClick={merged.onLeave}>Joined</Button>
						</Show>
						<Show when={!merged.isMember}>
							<Button variant="primary" size="sm" onClick={merged.onJoin}>Join</Button>
						</Show>
					</div>
				</div>

				{/* Name + description */}
				<div class="mt-[--spacing-sm]">
					<h2 class="text-lg font-bold text-[--color-on-background]">{merged.name}</h2>
					<Show when={merged.description}>
						<p class="text-sm text-[--color-on-background] mt-1" style="opacity:0.75">{merged.description}</p>
					</Show>
				</div>

				{/* Tags */}
				<Show when={merged.tags && merged.tags.length > 0}>
					<div class="flex gap-[--spacing-xs] flex-wrap mt-[--spacing-sm]">
						<For each={merged.tags}>
							{(tag) => <Tag>{tag}</Tag>}
						</For>
					</div>
				</Show>

				{/* Stats */}
				<Show when={stats().length > 0}>
					<div class="mt-[--spacing-sm]">
						<StatGroup stats={stats()} size="sm" />
					</div>
				</Show>
			</div>

			{/* Tab slot (children) */}
			<Show when={merged.children}>
				<div class="px-[--spacing-lg]">
					{merged.children}
				</div>
			</Show>
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
