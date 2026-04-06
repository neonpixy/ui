import { createSignal, For, Show, mergeProps } from 'solid-js';
import { useTheme } from '../theme/context.js';

export interface ToastMessage {
	id: string;
	message: string;
	variant?: 'default' | 'success' | 'danger' | 'warning' | 'info';
	duration?: number;
	icon?: string;
}

const [toasts, setToasts] = createSignal<ToastMessage[]>([]);
let counter = 0;

export function toast(message: string, options: Partial<Omit<ToastMessage, 'id' | 'message'>> = {}): string {
	const id = `toast-${++counter}`;
	const t: ToastMessage = { id, message, variant: 'default', duration: 3000, ...options };
	setToasts((prev) => [...prev, t]);

	if (t.duration && t.duration > 0) {
		setTimeout(() => dismiss(id), t.duration);
	}

	return id;
}

export function dismiss(id: string) {
	setToasts((prev) => prev.filter((t) => t.id !== id));
}

interface ToastProps {
	position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
	class?: string;
}

const posMap: Record<string, string> = {
	'top-right':      'top-4 right-4',
	'top-center':     'top-4 left-1/2 -translate-x-1/2',
	'bottom-right':   'bottom-4 right-4',
	'bottom-center':  'bottom-4 left-1/2 -translate-x-1/2',
};

const variantIcons: Record<string, string> = {
	default: 'information-line',
	success: 'checkbox-circle-line',
	danger:  'close-circle-line',
	warning: 'error-warning-line',
	info:    'information-line',
};

const variantColors: Record<string, string> = {
	default: 'text-[--color-on-background]',
	success: 'text-[--color-success]',
	danger:  'text-[--color-danger]',
	warning: 'text-[--color-warning]',
	info:    'text-[--color-info]',
};

export function Toast(props: ToastProps) {
	const merged = mergeProps({ position: 'bottom-right' as const }, props);

	const theme = useTheme();
	const isCrystal = () => theme.mode === 'crystal';

	const bgClass = () =>
		isCrystal()
			? 'bg-mix-surface-85 backdrop-blur-xl border-mix-on-background-12'
			: 'bg-[--color-surface] border-mix-on-background-8';

	return (
		<Show when={toasts().length > 0}>
			<div class={`fixed z-[100] flex flex-col gap-2 ${posMap[merged.position]} ${merged.class ?? ''}`} aria-live="polite">
				<For each={toasts()}>
					{(t) => (
						<div
							class={`omnidea-toast flex items-center gap-[--spacing-sm] px-[--spacing-md] py-[--spacing-sm] ${bgClass()} border rounded-[--radius-md] shadow-[--shadow-elevated] min-w-64 max-w-sm`}
							role="alert"
						>
							<i class={`ri-${t.icon ?? variantIcons[t.variant ?? 'default']} ${variantColors[t.variant ?? 'default']} text-sm flex-shrink-0`} />
							<span class="text-sm text-[--color-on-background] flex-1">{t.message}</span>
							<button
								class="w-5 h-5 flex items-center justify-center text-[--color-secondary] cursor-pointer opacity-60 hover:opacity-100 flex-shrink-0"
								onClick={() => dismiss(t.id)}
								aria-label="Dismiss"
							>
								<i class="ri-close-line text-xs" />
							</button>
						</div>
					)}
				</For>
			</div>
		</Show>
	);
}
