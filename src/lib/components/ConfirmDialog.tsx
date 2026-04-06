import { Show, createEffect, onCleanup, mergeProps } from 'solid-js';
import { useTheme } from '../theme/context.js';
import { GlassPane } from '../crystal/GlassPane.js';

interface ConfirmDialogProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	title: string;
	message: string;
	confirmLabel?: string;
	cancelLabel?: string;
	variant?: 'default' | 'danger';
	icon?: string;
	class?: string;
	onConfirm?: () => void;
	onCancel?: () => void;
}

export function ConfirmDialog(props: ConfirmDialogProps) {
	const merged = mergeProps({
		open: false,
		confirmLabel: 'Confirm',
		cancelLabel: 'Cancel',
		variant: 'default' as const,
	}, props);

	const theme = useTheme();
	const isCrystal = () => theme.mode === 'crystal';

	const confirmBg = () => {
		if (merged.variant === 'danger') {
			return isCrystal()
				? 'bg-mix-danger-25 text-[--color-danger] border border-mix-danger-35'
				: 'bg-[--color-danger] text-white border border-[--color-danger]';
		}
		return isCrystal()
			? 'bg-mix-accent-25 text-[--color-accent] border border-mix-accent-35'
			: 'bg-[--color-accent] text-white border border-[--color-accent]';
	};

	const cancelBg = () =>
		isCrystal()
			? 'bg-mix-surface-60 text-[--color-on-background] border border-mix-on-background-15'
			: 'bg-[--color-surface] text-[--color-on-background] border border-mix-on-background-10';

	function handleConfirm() {
		merged.onOpenChange?.(false);
		merged.onConfirm?.();
	}

	function handleCancel() {
		merged.onOpenChange?.(false);
		merged.onCancel?.();
	}

	createEffect(() => {
		if (merged.open) {
			const handler = (e: KeyboardEvent) => {
				if (e.key === 'Escape') handleCancel();
			};
			document.addEventListener('keydown', handler);
			onCleanup(() => document.removeEventListener('keydown', handler));
		}
	});

	const dialogContent = () => (
		<div class="p-[--spacing-lg] text-center">
			<Show when={merged.icon}>
				<div class="mb-[--spacing-md]">
					<i class={`ri-${merged.icon} text-2xl ${merged.variant === 'danger' ? 'text-[--color-danger]' : 'text-[--color-accent]'}`} />
				</div>
			</Show>

			<h3 class="text-base font-semibold text-[--color-on-background] mb-1">{merged.title}</h3>
			<p class="text-sm text-[--color-secondary]">{merged.message}</p>

			<div class="flex gap-[--spacing-sm] justify-center mt-[--spacing-lg]">
				<button
					class={`omnidea-btn px-[--spacing-lg] py-[--spacing-sm] rounded-[--radius-md] text-sm font-medium cursor-pointer transition-[filter] duration-150 ${cancelBg()}`}
					onClick={handleCancel}
				>{merged.cancelLabel}</button>
				<button
					class={`omnidea-btn px-[--spacing-lg] py-[--spacing-sm] rounded-[--radius-md] text-sm font-medium cursor-pointer transition-[filter] duration-150 ${confirmBg()}`}
					onClick={handleConfirm}
				>{merged.confirmLabel}</button>
			</div>
		</div>
	);

	return (
		<Show when={merged.open}>
			<div class="fixed inset-0 z-50 flex items-center justify-center" onClick={handleCancel}>
				<div class="absolute inset-0 bg-black/40" />

				<div
					class={`relative z-10 w-full max-w-sm mx-[--spacing-lg] ${merged.class ?? ''}`}
					onClick={(e) => e.stopPropagation()}
					role="alertdialog"
					aria-modal="true"
					aria-label={merged.title}
				>
					{isCrystal() ? (
						<GlassPane elevation="modal">
							{dialogContent()}
						</GlassPane>
					) : (
						<div class="bg-[--color-surface] rounded-[--radius-xl] shadow-[--shadow-floating] border border-mix-on-background-8">
							{dialogContent()}
						</div>
					)}
				</div>
			</div>
		</Show>
	);
}
