import { Show, type ParentProps } from 'solid-js';

interface SectionProps extends ParentProps {
	title?: string;
	description?: string;
	class?: string;
}

export function Section(props: SectionProps) {
	const classes = () => `flex flex-col gap-[--spacing-md] ${props.class ?? ''}`.trim();

	return (
		<section class={classes()}>
			<Show when={props.title}>
				<h2 class="text-lg font-semibold text-[--color-on-background]">{props.title}</h2>
			</Show>
			<Show when={props.description}>
				<p class="text-sm text-[--color-secondary]">{props.description}</p>
			</Show>
			{props.children}
		</section>
	);
}
