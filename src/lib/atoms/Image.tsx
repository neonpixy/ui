import { mergeProps } from 'solid-js';

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill';
  radius?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'none';
  loading?: 'lazy' | 'eager';
  class?: string;
}

const radiusMap: Record<string, string> = {
  none: 'rounded-none',
  sm: 'rounded-[--radius-sm]',
  md: 'rounded-[--radius-md]',
  lg: 'rounded-[--radius-lg]',
  xl: 'rounded-[--radius-xl]',
  full: 'rounded-full',
};

const fitMap: Record<string, string> = {
  cover: 'object-cover',
  contain: 'object-contain',
  fill: 'object-fill',
};

export function Image(props: ImageProps) {
  const merged = mergeProps({ fit: 'cover' as const, radius: 'md' as const, loading: 'lazy' as const }, props);

  return (
    <img
      src={props.src}
      alt={props.alt}
      width={props.width}
      height={props.height}
      loading={merged.loading}
      class={`${radiusMap[merged.radius]} ${fitMap[merged.fit]} ${props.class ?? ''}`}
    />
  );
}
