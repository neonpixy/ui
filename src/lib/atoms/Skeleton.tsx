import { mergeProps, Show, For } from 'solid-js';
import { useTheme } from '../theme/context.js';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
  lines?: number;
  class?: string;
}

const variantStyles: Record<string, string> = {
  text: 'h-4 rounded-[--radius-sm]',
  circular: 'rounded-full aspect-square',
  rectangular: 'rounded-[--radius-md]',
};

export function Skeleton(props: SkeletonProps) {
  const merged = mergeProps({ variant: 'text' as const, lines: 1 }, props);
  const theme = useTheme();
  const isCrystal = () => theme.mode === 'crystal';

  const bgClass = () =>
    isCrystal()
      ? 'bg-mix-on-background-8'
      : 'bg-[--color-mid-gray]';

  return (
    <Show
      when={merged.variant === 'text' && merged.lines > 1}
      fallback={
        <div
          class={`omnidea-skeleton ${bgClass()} ${variantStyles[merged.variant]} ${props.class ?? ''}`}
          style={`${props.width ? `width:${props.width}` : merged.variant === 'text' ? 'width:100%' : ''}; ${props.height ? `height:${props.height}` : ''}`}
        />
      }
    >
      <div class={`flex flex-col gap-2 ${props.class ?? ''}`}>
        <For each={Array(merged.lines).fill(0)}>
          {(_, i) => (
            <div
              class={`omnidea-skeleton ${bgClass()} ${variantStyles.text}`}
              style={`${props.width ? `width:${props.width}` : `width:${i() === merged.lines - 1 ? '75%' : '100%'}`}; ${props.height ? `height:${props.height}` : ''}`}
            />
          )}
        </For>
      </div>
    </Show>
  );
}
