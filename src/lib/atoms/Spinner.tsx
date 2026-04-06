import { mergeProps } from 'solid-js';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  class?: string;
}

const sizeMap: Record<string, string> = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4',
};

export function Spinner(props: SpinnerProps) {
  const merged = mergeProps({ size: 'md' as const }, props);

  return (
    <div
      class={`rounded-full border-[--color-secondary] border-t-[--color-accent] omnidea-spin ${sizeMap[merged.size]} ${props.class ?? ''}`}
      role="status"
      aria-label="Loading"
    />
  );
}
