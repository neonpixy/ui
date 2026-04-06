import { createSignal, For, Show, mergeProps, type JSX } from 'solid-js';
import { useTheme } from '../theme/context.js';
import { GlassPane } from '../crystal/GlassPane.js';

interface AccordionItem {
	id: string;
	title: string;
	content: () => JSX.Element;
	icon?: string;
}

interface AccordionProps {
	items: AccordionItem[];
	multiple?: boolean;
	class?: string;
}

export function Accordion(props: AccordionProps) {
	const merged = mergeProps({ multiple: false }, props);

	const theme = useTheme();
	const isCrystal = () => theme.mode === 'crystal';

	const [openIds, setOpenIds] = createSignal<Set<string>>(new Set());

	function toggle(id: string) {
		setOpenIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				if (merged.multiple) {
					next.add(id);
				} else {
					return new Set([id]);
				}
			}
			return next;
		});
	}

	const headerHover = () => isCrystal()
		? 'hover:bg-mix-on-background-6'
		: 'hover:bg-mix-on-background-3';

	const dividerClass = () => isCrystal()
		? 'border-mix-on-background-8'
		: 'border-mix-on-background-6';

	const contentBg = () => isCrystal()
		? 'bg-mix-on-background-3'
		: 'bg-mix-on-background-2';

	const items = () => (
		<div class="flex flex-col">
			<For each={merged.items}>
				{(item, i) => (
					<>
						<Show when={i() > 0}>
							<div class={`border-t ${dividerClass()}`} />
						</Show>

						<div>
							<button
								class={`w-full px-[--spacing-md] py-[--spacing-md] flex items-center justify-between bg-transparent text-[--color-on-background] text-sm font-medium cursor-pointer transition-[background] duration-150 border-none ${headerHover()}`}
								onClick={() => toggle(item.id)}
								aria-expanded={openIds().has(item.id)}
							>
								<span class="flex items-center gap-[--spacing-sm]">
									{item.icon ? <i class={`ri-${item.icon} text-[--color-secondary]`} /> : null}
									{item.title}
								</span>
								<i class={`ri-arrow-down-s-line text-[--color-secondary] transition-transform duration-200 ${openIds().has(item.id) ? 'rotate-180' : ''}`} />
							</button>

							<Show when={openIds().has(item.id)}>
								<div class={`px-[--spacing-md] py-[--spacing-md] ${contentBg()} text-sm`}>
									{item.content()}
								</div>
							</Show>
						</div>
					</>
				)}
			</For>
		</div>
	);

	return isCrystal() ? (
		<GlassPane elevation="accordion" class={`overflow-hidden rounded-[--radius-lg] ${merged.class ?? ''}`}>
			{items()}
		</GlassPane>
	) : (
		<div class={`rounded-[--radius-lg] border border-mix-on-background-8 shadow-[--shadow-flat] overflow-hidden bg-[--color-surface] ${merged.class ?? ''}`}>
			{items()}
		</div>
	);
}
