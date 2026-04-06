import { mergeProps, Show } from 'solid-js';

interface DividerProps {
  direction?: 'horizontal' | 'vertical';
  class?: string;
}

export function Divider(props: DividerProps) {
  const merged = mergeProps({ direction: 'horizontal' as const }, props);

  return (
    <Show
      when={merged.direction === 'horizontal'}
      fallback={<div class={`border-l border-[--color-mid-gray] self-stretch ${props.class ?? ''}`} />}
    >
      <hr class={`border-t border-[--color-mid-gray] w-full ${props.class ?? ''}`} />
    </Show>
  );
}
