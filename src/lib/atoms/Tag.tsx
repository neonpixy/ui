import { mergeProps, Show, type ParentProps } from 'solid-js';
import { useTheme } from '../theme/context.js';

interface TagProps extends ParentProps {
  variant?: 'default' | 'primary' | 'danger' | 'success' | 'warning' | 'info';
  removable?: boolean;
  icon?: string;
  class?: string;
  onremove?: () => void;
  onclick?: (e: MouseEvent) => void;
}

const neuVariants: Record<string, string> = {
  default: 'bg-[--color-mid-gray] text-[--color-on-background]',
  primary: 'bg-mix-accent-15 text-[--color-accent]',
  danger:  'bg-mix-danger-15 text-[--color-danger]',
  success: 'bg-mix-success-15 text-[--color-success]',
  warning: 'bg-mix-warning-15 text-[--color-warning]',
  info:    'bg-mix-info-15 text-[--color-info]',
};

const glassVariants: Record<string, string> = {
  default: 'bg-mix-surface-40 text-[--color-on-background] border border-mix-on-background-10',
  primary: 'bg-mix-accent-12 text-[--color-accent] border border-mix-accent-25',
  danger:  'bg-mix-danger-12 text-[--color-danger] border border-mix-danger-25',
  success: 'bg-mix-success-12 text-[--color-success] border border-mix-success-25',
  warning: 'bg-mix-warning-12 text-[--color-warning] border border-mix-warning-25',
  info:    'bg-mix-info-12 text-[--color-info] border border-mix-info-25',
};

export function Tag(props: TagProps) {
  const merged = mergeProps({ variant: 'default' as const, removable: false }, props);
  const theme = useTheme();
  const isCrystal = () => theme.mode === 'crystal';
  const variantClass = () => isCrystal() ? glassVariants[merged.variant] : neuVariants[merged.variant];
  const isClickable = () => !!props.onclick;

  return (
    <span
      class={`inline-flex items-center gap-1 px-[--spacing-sm] py-0.5 rounded-[--radius-full] text-xs font-medium whitespace-nowrap ${variantClass()} ${isClickable() ? 'cursor-pointer' : ''} ${props.class ?? ''}`}
      onClick={props.onclick}
    >
      <Show when={props.icon}>
        <i class={`ri-${props.icon} text-[10px]`} />
      </Show>
      {props.children}
      <Show when={merged.removable}>
        <button
          class="ml-0.5 w-4 h-4 inline-flex items-center justify-center rounded-full cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
          onClick={(e) => { e.stopPropagation(); props.onremove?.(); }}
          aria-label="Remove tag"
        >
          <i class="ri-close-line text-[9px]" />
        </button>
      </Show>
    </span>
  );
}
