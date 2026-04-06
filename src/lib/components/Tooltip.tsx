import { createSignal, type ParentProps } from 'solid-js';
import { mergeProps, Show } from 'solid-js';

interface TooltipProps extends ParentProps {
	text: string;
	position?: 'top' | 'bottom' | 'left' | 'right';
	delay?: number;
	class?: string;
}

const posMap: Record<string, string> = {
	top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
	bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
	left:   'right-full top-1/2 -translate-y-1/2 mr-2',
	right:  'left-full top-1/2 -translate-y-1/2 ml-2',
};

export function Tooltip(props: TooltipProps) {
	const merged = mergeProps({ position: 'top' as const, delay: 400 }, props);
	const [visible, setVisible] = createSignal(false);
	const [posOverride, setPosOverride] = createSignal<string | null>(null);
	let timer: ReturnType<typeof setTimeout> | null = null;
	let wrapperEl: HTMLDivElement | undefined;

	const resolvedPos = () => posOverride() ?? merged.position;

	function resolvePosition(preferred: string): string {
		if (!wrapperEl) return preferred;
		const rect = wrapperEl.getBoundingClientRect();
		const margin = 48;

		if (preferred === 'top' && rect.top < margin) return 'bottom';
		if (preferred === 'bottom' && rect.bottom > window.innerHeight - margin) return 'top';
		if (preferred === 'left' && rect.left < margin) return 'right';
		if (preferred === 'right' && rect.right > window.innerWidth - margin) return 'left';
		return preferred;
	}

	function show() {
		timer = setTimeout(() => {
			setPosOverride(resolvePosition(merged.position));
			setVisible(true);
		}, merged.delay);
	}

	function hide() {
		if (timer) { clearTimeout(timer); timer = null; }
		setVisible(false);
		setPosOverride(null);
	}

	return (
		<div
			ref={(el) => { wrapperEl = el; }}
			class={`relative inline-block ${merged.class ?? ''}`}
			onMouseEnter={show}
			onMouseLeave={hide}
			onFocusIn={show}
			onFocusOut={hide}
		>
			{merged.children}

			<Show when={visible()}>
				<div
					class={`absolute z-50 ${posMap[resolvedPos()]} px-[--spacing-sm] py-1 text-xs font-medium whitespace-nowrap bg-[--color-on-background] text-[--color-background] rounded-[--radius-sm] shadow-[--shadow-medium] pointer-events-none`}
					role="tooltip"
				>
					{merged.text}
				</div>
			</Show>
		</div>
	);
}
