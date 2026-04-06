import { Show, createEffect, onCleanup, type JSX, type ParentProps } from 'solid-js';
import { useTheme } from '../theme/context.js';
import { GlassPane } from '../crystal/GlassPane.js';

interface ModalProps extends ParentProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	title?: string;
	closeOnOverlay?: boolean;
	class?: string;
	footer?: JSX.Element;
}

export function Modal(props: ModalProps) {
	const theme = useTheme();
	const isCrystal = () => theme.mode === 'crystal';

	function close() {
		props.onOpenChange?.(false);
	}

	function handleOverlayClick() {
		if (props.closeOnOverlay !== false) close();
	}

	createEffect(() => {
		if (props.open) {
			const handler = (e: KeyboardEvent) => {
				if (e.key === 'Escape') close();
			};
			document.addEventListener('keydown', handler);
			onCleanup(() => document.removeEventListener('keydown', handler));
		}
	});

	const modalContent = () => (
		<>
			<Show when={props.title}>
				<div class="px-[--spacing-lg] pt-[--spacing-lg] pb-[--spacing-sm] flex items-center justify-between">
					<h2 class="text-lg font-semibold text-[--color-on-background]">{props.title}</h2>
					<button
						class="w-8 h-8 flex items-center justify-center rounded-full text-[--color-secondary] cursor-pointer"
						onClick={close}
						aria-label="Close"
					>
						<i class="ri-close-line" />
					</button>
				</div>
			</Show>

			<div class="px-[--spacing-lg] py-[--spacing-md] overflow-y-auto flex-1">
				{props.children}
			</div>

			<Show when={props.footer}>
				<div class="px-[--spacing-lg] py-[--spacing-md] border-t border-[--color-mid-gray] flex justify-end gap-[--spacing-sm]">
					{props.footer}
				</div>
			</Show>
		</>
	);

	return (
		<Show when={props.open}>
			<div class="fixed inset-0 z-50 flex items-center justify-center" onClick={handleOverlayClick}>
				<div class="absolute inset-0 bg-black/40" />

				<div
					class={`relative z-10 min-w-80 max-w-lg w-full mx-[--spacing-lg] max-h-[85vh] flex flex-col ${props.class ?? ''}`}
					onClick={(e) => e.stopPropagation()}
					role="dialog"
					aria-modal="true"
					aria-label={props.title ?? 'Dialog'}
				>
					{isCrystal() ? (
						<GlassPane elevation="modal">
							{modalContent()}
						</GlassPane>
					) : (
						<div class="bg-[--color-surface] rounded-[--radius-xl] shadow-[--shadow-floating] border border-mix-on-background-8">
							{modalContent()}
						</div>
					)}
				</div>
			</div>
		</Show>
	);
}
