import { mergeProps, Show } from 'solid-js';

interface AvatarProps {
  src?: string;
  /** Used to generate initials + gradient when no src. */
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  class?: string;
}

const sizeMap: Record<string, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-xl',
};

// Simple hash for gradient color from name
function hashColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 60%, 50%)`;
}

export function Avatar(props: AvatarProps) {
  const merged = mergeProps({ size: 'md' as const }, props);

  // Generate initials from name
  const initials = () =>
    props.name
      ? props.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
      : '?';

  const gradientStyle = () =>
    props.name
      ? `background: linear-gradient(135deg, ${hashColor(props.name)}, ${hashColor(props.name + '!')})`
      : '';

  return (
    <div
      class={`rounded-full overflow-hidden flex items-center justify-center font-semibold text-white shrink-0 ${sizeMap[merged.size]} ${props.class ?? ''}`}
      style={props.src ? '' : gradientStyle()}
    >
      <Show when={props.src} fallback={initials()}>
        <img src={props.src} alt={props.name ?? 'Avatar'} class="w-full h-full object-cover" />
      </Show>
    </div>
  );
}
