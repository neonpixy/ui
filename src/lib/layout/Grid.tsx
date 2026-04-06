import { mergeProps, type ParentProps } from 'solid-js';

interface GridProps extends ParentProps {
	/** Number for uniform columns, string for grid-template-columns. */
	cols?: number | string;
	/** Columns at >=640px (sm breakpoint). */
	colsSm?: number | string;
	/** Columns at >=768px (md breakpoint). */
	colsMd?: number | string;
	/** Columns at >=1024px (lg breakpoint). */
	colsLg?: number | string;
	gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	class?: string;
}

const gapMap: Record<string, string> = {
	xs: 'gap-[--spacing-xs]',
	sm: 'gap-[--spacing-sm]',
	md: 'gap-[--spacing-md]',
	lg: 'gap-[--spacing-lg]',
	xl: 'gap-[--spacing-xl]',
};

function colsToCSS(c: number | string): string {
	return typeof c === 'number' ? `repeat(${c}, minmax(0, 1fr))` : c;
}

export function Grid(props: GridProps) {
	const merged = mergeProps({ cols: 1 as number | string, gap: 'md' as const }, props);

	const gridStyle = () =>
		`grid-template-columns: ${colsToCSS(merged.cols)};`
		+ (merged.colsSm ? ` --grid-sm: ${colsToCSS(merged.colsSm)};` : '')
		+ (merged.colsMd ? ` --grid-md: ${colsToCSS(merged.colsMd)};` : '')
		+ (merged.colsLg ? ` --grid-lg: ${colsToCSS(merged.colsLg)};` : '');

	const responsiveClass = () => [
		merged.colsSm ? 'grid-responsive-sm' : '',
		merged.colsMd ? 'grid-responsive-md' : '',
		merged.colsLg ? 'grid-responsive-lg' : '',
	].filter(Boolean).join(' ');

	const classes = () => `grid ${gapMap[merged.gap]} ${responsiveClass()} ${merged.class ?? ''}`.trim();

	return (
		<>
			<div class={classes()} style={gridStyle()}>
				{props.children}
			</div>
			<style>{`
				@media (min-width: 640px) {
					.grid-responsive-sm { grid-template-columns: var(--grid-sm) !important; }
				}
				@media (min-width: 768px) {
					.grid-responsive-md { grid-template-columns: var(--grid-md) !important; }
				}
				@media (min-width: 1024px) {
					.grid-responsive-lg { grid-template-columns: var(--grid-lg) !important; }
				}
			`}</style>
		</>
	);
}
