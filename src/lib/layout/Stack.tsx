import { mergeProps, type ParentProps } from 'solid-js';

interface StackProps extends ParentProps {
	direction?: 'vertical' | 'horizontal';
	gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
	align?: 'start' | 'center' | 'end' | 'stretch';
	justify?: 'start' | 'center' | 'end' | 'between' | 'around';
	wrap?: boolean;
	class?: string;
}

const gapMap: Record<string, string> = {
	xs: 'gap-[--spacing-xs]',
	sm: 'gap-[--spacing-sm]',
	md: 'gap-[--spacing-md]',
	lg: 'gap-[--spacing-lg]',
	xl: 'gap-[--spacing-xl]',
	xxl: 'gap-[--spacing-xxl]',
};

const alignMap: Record<string, string> = {
	start: 'items-start',
	center: 'items-center',
	end: 'items-end',
	stretch: 'items-stretch',
};

const justifyMap: Record<string, string> = {
	start: 'justify-start',
	center: 'justify-center',
	end: 'justify-end',
	between: 'justify-between',
	around: 'justify-around',
};

export function Stack(props: StackProps) {
	const merged = mergeProps({ direction: 'vertical' as const, gap: 'md' as const, wrap: false }, props);

	const classes = () => [
		'flex',
		merged.direction === 'horizontal' ? 'flex-row' : 'flex-col',
		gapMap[merged.gap],
		merged.align ? alignMap[merged.align] : '',
		merged.justify ? justifyMap[merged.justify] : '',
		merged.wrap ? 'flex-wrap' : '',
		merged.class ?? '',
	].filter(Boolean).join(' ');

	return <div class={classes()}>{props.children}</div>;
}
