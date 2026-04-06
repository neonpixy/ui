import { mergeProps, type ParentProps } from 'solid-js';
import { useTheme } from '../theme/context.js';
import { GlassPane } from '../crystal/GlassPane.js';

interface CardProps extends ParentProps {
	padding?: 'none' | 'sm' | 'md' | 'lg';
	class?: string;
}

const padMap: Record<string, string> = {
	none: 'p-0',
	sm: 'p-[--spacing-sm]',
	md: 'p-[--spacing-md]',
	lg: 'p-[--spacing-lg]',
};

export function Card(props: CardProps) {
	const merged = mergeProps({ padding: 'lg' as const }, props);

	const theme = useTheme();
	const isCrystal = () => theme.mode === 'crystal';

	return (
		<>
			{isCrystal() ? (
				<GlassPane elevation="card" class={merged.class}>
					<div class={padMap[merged.padding]}>
						{merged.children}
					</div>
				</GlassPane>
			) : (
				<div class={`bg-[--color-surface] rounded-[--radius-lg] ${padMap[merged.padding]} border border-mix-on-background-8 shadow-[--shadow-raised] ${merged.class ?? ''}`}>
					{merged.children}
				</div>
			)}
		</>
	);
}
