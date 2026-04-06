import { mergeProps, Show, type ParentProps } from 'solid-js';
import { useTheme } from '../theme/context.js';

interface LinkProps extends ParentProps {
  href: string;
  external?: boolean;
  variant?: 'default' | 'subtle' | 'plain';
  icon?: string;
  class?: string;
  onclick?: (e: MouseEvent) => void;
}

const variants: Record<string, string> = {
  default: 'text-[--color-accent] hover:underline',
  subtle:  'text-[--color-secondary] hover:text-[--color-accent]',
  plain:   'text-[--color-on-background] hover:text-[--color-accent]',
};

export function Link(props: LinkProps) {
  const merged = mergeProps({ external: false, variant: 'default' as const }, props);
  const theme = useTheme();
  const isCrystal = () => theme.mode === 'crystal';
  const variantClass = () => variants[merged.variant];

  return (
    <a
      href={props.href}
      class={`inline-flex items-center gap-1 transition-colors duration-150 ${variantClass()} ${props.class ?? ''}`}
      target={merged.external ? '_blank' : undefined}
      rel={merged.external ? 'noopener noreferrer' : undefined}
      onClick={props.onclick}
    >
      <Show when={props.icon}>
        <i class={`ri-${props.icon} text-[0.85em]`} />
      </Show>
      {props.children}
      <Show when={merged.external}>
        <i class="ri-external-link-line text-[0.7em] opacity-60" />
      </Show>
    </a>
  );
}
