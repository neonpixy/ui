import { mergeProps, type ParentProps } from 'solid-js';

interface ContainerProps extends ParentProps {
	maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
	padding?: boolean;
	center?: boolean;
	class?: string;
}

const widthMap: Record<string, string> = {
	sm: 'max-w-xl',
	md: 'max-w-3xl',
	lg: 'max-w-5xl',
	xl: 'max-w-7xl',
	full: 'max-w-full',
};

export function Container(props: ContainerProps) {
	const merged = mergeProps({ maxWidth: 'lg' as const, padding: true, center: true }, props);

	const classes = () => `${widthMap[merged.maxWidth]} ${merged.center ? 'mx-auto' : ''} ${merged.padding ? 'px-[--spacing-lg]' : ''} w-full ${merged.class ?? ''}`.trim();

	return <div class={classes()}>{props.children}</div>;
}
