import { createSignal, mergeProps, Show, type JSX } from 'solid-js';
import { useTheme } from '../theme/context.js';
import { Avatar } from '../atoms/Avatar.js';
import { Button } from './Button.js';
import { GlassPane } from '../crystal/GlassPane.js';

interface ComposeBoxProps {
	placeholder?: string;
	author?: { name: string; avatar?: string };
	value?: string;
	onInput?: (value: string) => void;
	onSubmit?: (value: string) => void;
	maxLength?: number;
	editor?: JSX.Element;
	actions?: JSX.Element;
	submitLabel?: string;
	class?: string;
}

export function ComposeBox(props: ComposeBoxProps) {
	const merged = mergeProps({ placeholder: "What's on your mind?", submitLabel: 'Post' }, props);
	const theme = useTheme();
	const isCrystal = () => theme.mode === 'crystal';
	const [focused, setFocused] = createSignal(false);

	const text = () => merged.value ?? '';
	const charCount = () => text().length;
	const showCount = () => merged.maxLength && charCount() > merged.maxLength * 0.8;
	const overLimit = () => merged.maxLength ? charCount() > merged.maxLength : false;

	const handleSubmit = () => {
		if (!text().trim() || overLimit()) return;
		merged.onSubmit?.(text());
	};

	const focusBorder = () => focused()
		? (isCrystal() ? 'border-mix-accent-40' : 'border-[--color-accent]')
		: (isCrystal() ? 'border-mix-on-background-12' : 'border-mix-on-background-8');

	const inner = () => (
		<div class="flex gap-[--spacing-sm]">
			<Show when={merged.author}>
				<div class="shrink-0 pt-1">
					<Avatar name={merged.author!.name} src={merged.author!.avatar} size="md" />
				</div>
			</Show>

			<div class="flex-1 flex flex-col gap-[--spacing-sm]">
				{/* Editor area */}
				<Show when={merged.editor} fallback={
					<textarea
						class="w-full min-h-20 bg-transparent border-none resize-y text-sm text-[--color-on-background] placeholder:text-[--color-secondary] focus:outline-none"
						placeholder={merged.placeholder}
						value={text()}
						onInput={(e) => merged.onInput?.(e.currentTarget.value)}
						onFocus={() => setFocused(true)}
						onBlur={() => setFocused(false)}
					/>
				}>
					{merged.editor}
				</Show>

				{/* Bottom row */}
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-[--spacing-xs]">
						<Show when={merged.actions} fallback={
							<>
								<button class="bg-transparent border-none cursor-pointer text-[--color-secondary] hover:text-[--color-accent] transition-colors duration-150 p-1 text-base" aria-label="Add image">
									<i class="ri-image-line" />
								</button>
								<button class="bg-transparent border-none cursor-pointer text-[--color-secondary] hover:text-[--color-accent] transition-colors duration-150 p-1 text-base" aria-label="Add link">
									<i class="ri-link" />
								</button>
							</>
						}>
							{merged.actions}
						</Show>
					</div>

					<div class="flex items-center gap-[--spacing-sm]">
						<Show when={showCount()}>
							<span class={`text-xs tabular-nums ${overLimit() ? 'text-[--color-danger] font-semibold' : 'text-[--color-secondary]'}`}>
								{charCount()}/{merged.maxLength}
							</span>
						</Show>
						<Button
							variant="primary"
							size="sm"
							onClick={handleSubmit}
							disabled={!text().trim() || overLimit()}
						>
							{merged.submitLabel}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);

	return isCrystal() ? (
		<GlassPane elevation="card" class={`border ${focusBorder()} transition-[border-color] duration-150 ${merged.class ?? ''}`}>
			<div class="p-[--spacing-md]">{inner()}</div>
		</GlassPane>
	) : (
		<div class={`bg-[--color-surface] rounded-[--radius-lg] p-[--spacing-md] border ${focusBorder()} shadow-[--shadow-flat] transition-[border-color,box-shadow] duration-150 ${focused() ? 'shadow-[--shadow-raised]' : ''} ${merged.class ?? ''}`}>
			{inner()}
		</div>
	);
}
