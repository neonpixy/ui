import { createSignal, For, Show, mergeProps } from 'solid-js';
import { useTheme } from '../theme/context.js';

export interface TreeNode {
	id: string;
	label: string;
	icon?: string;
	children?: TreeNode[];
}

interface TreeViewProps {
	nodes: TreeNode[];
	selected?: string;
	onSelectedChange?: (id: string) => void;
	indent?: number;
	depth?: number;
	class?: string;
	onSelect?: (node: TreeNode) => void;
}

export function TreeView(props: TreeViewProps) {
	const merged = mergeProps({ indent: 16, depth: 0, selected: '' }, props);

	const theme = useTheme();
	const isCrystal = () => theme.mode === 'crystal';

	const [expandedIds, setExpandedIds] = createSignal<Set<string>>(new Set());

	function toggleExpand(id: string, e: MouseEvent) {
		e.stopPropagation();
		setExpandedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	}

	function selectNode(node: TreeNode) {
		merged.onSelectedChange?.(node.id);
		merged.onSelect?.(node);
	}

	const selectedBg = () =>
		isCrystal()
			? 'bg-mix-accent-15'
			: 'bg-mix-accent-10';

	const hoverBg = () =>
		isCrystal()
			? 'hover:bg-mix-on-background-6'
			: 'hover:bg-[--color-mid-gray]';

	return (
		<ul class={`tree-view flex flex-col ${merged.depth === 0 ? merged.class ?? '' : ''}`} role={merged.depth === 0 ? 'tree' : 'group'}>
			<For each={merged.nodes}>
				{(node) => {
					const hasChildren = () => !!(node.children && node.children.length > 0);
					const isExpanded = () => expandedIds().has(node.id);
					const isSelected = () => merged.selected === node.id;

					return (
						<li role="treeitem" aria-expanded={hasChildren() ? isExpanded() : undefined} aria-selected={isSelected()}>
							<div
								class={`tree-node flex items-center gap-1 px-[--spacing-sm] py-1 rounded-[--radius-sm] cursor-pointer text-sm transition-[background] duration-100 ${isSelected() ? selectedBg() + ' text-[--color-accent]' : 'text-[--color-on-background]'} ${isSelected() ? '' : hoverBg()}`}
								style={{ 'padding-left': `${merged.depth * merged.indent + 8}px` }}
								onClick={() => selectNode(node)}
							>
								{hasChildren() ? (
									<span class="w-4 h-4 flex items-center justify-center flex-shrink-0" onClick={(e) => toggleExpand(node.id, e)}>
										<i class={`ri-arrow-right-s-line text-[10px] text-[--color-secondary] transition-transform duration-150 ${isExpanded() ? 'rotate-90' : ''}`} />
									</span>
								) : (
									<span class="w-4 h-4 flex-shrink-0" />
								)}

								{node.icon ? (
									<i class={`ri-${node.icon} text-xs ${isSelected() ? '' : 'text-[--color-secondary]'} flex-shrink-0`} />
								) : null}

								<span class="truncate">{node.label}</span>
							</div>

							<Show when={hasChildren() && isExpanded()}>
								<TreeView
									nodes={node.children ?? []}
									selected={merged.selected}
									onSelectedChange={merged.onSelectedChange}
									indent={merged.indent}
									depth={merged.depth + 1}
									onSelect={merged.onSelect}
								/>
							</Show>
						</li>
					);
				}}
			</For>
		</ul>
	);
}
