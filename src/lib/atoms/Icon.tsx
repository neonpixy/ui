import { mergeProps } from 'solid-js';

interface IconProps {
  /** Remix Icon name including style suffix, e.g. "search-line", "close-fill" */
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  class?: string;
}

const sizeMap: Record<string, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-2xl',
};

export function Icon(props: IconProps) {
  const merged = mergeProps({ size: 'md' as const }, props);

  const iconClass = () => `ri-${merged.name} ${sizeMap[merged.size]} ${props.class ?? ''}`;

  return (
    <i class={iconClass()} style={props.color ? `color: ${props.color}` : ''} aria-hidden="true" />
  );
}
