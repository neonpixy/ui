import { mergeProps, type ParentProps } from 'solid-js';
import { useTheme } from '../theme/context.js';

interface BadgeProps extends ParentProps {
  variant?: 'default' | 'primary' | 'danger' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md';
  class?: string;
}

const neuVariants: Record<string, string> = {
  default: 'bg-[--color-surface] text-[--color-on-background]',
  primary: 'bg-[--color-accent] text-white',
  danger:  'bg-[--color-danger] text-white',
  success: 'bg-[--color-success] text-white',
  warning: 'bg-[--color-warning] text-white',
  info:    'bg-[--color-info] text-white',
};

const glassVariants: Record<string, string> = {
  default: 'bg-mix-surface-50 text-[--color-on-background] border border-mix-on-background-12',
  primary: 'bg-mix-accent-25 text-[--color-accent] border border-mix-accent-30',
  danger:  'bg-mix-danger-25 text-[--color-danger] border border-mix-danger-30',
  success: 'bg-mix-success-25 text-[--color-success] border border-mix-success-30',
  warning: 'bg-mix-warning-25 text-[--color-warning] border border-mix-warning-30',
  info:    'bg-mix-info-25 text-[--color-info] border border-mix-info-30',
};

const sizeMap: Record<string, string> = {
  sm: 'px-[--spacing-xs] py-0.5 text-[10px]',
  md: 'px-[--spacing-sm] py-[--spacing-xs] text-xs',
};

export function Badge(props: BadgeProps) {
  const merged = mergeProps({ variant: 'default' as const, size: 'md' as const }, props);
  const theme = useTheme();
  const isCrystal = () => theme.mode === 'crystal';
  const variantClass = () => isCrystal() ? glassVariants[merged.variant] : neuVariants[merged.variant];

  return (
    <span class={`inline-flex items-center justify-center font-semibold whitespace-nowrap rounded-[--radius-full] ${variantClass()} ${sizeMap[merged.size]} ${props.class ?? ''}`}>
      {props.children}
    </span>
  );
}
