import { Show, type JSX } from 'solid-js';
import { useTheme } from '../theme/context.js';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  class?: string;
  action?: JSX.Element;
}

export function EmptyState(props: EmptyStateProps) {
  const theme = useTheme();
  const isCrystal = () => theme.mode === 'crystal';

  return (
    <div class={`flex flex-col items-center justify-center py-[--spacing-xxl] px-[--spacing-lg] text-center ${props.class ?? ''}`}>
      <Show when={props.icon}>
        <div class="mb-[--spacing-md]">
          <i class={`ri-${props.icon} text-3xl ${isCrystal()
            ? 'text-mix-secondary-60'
            : 'text-[--color-secondary]'}`} />
        </div>
      </Show>

      <h3 class="text-base font-semibold text-[--color-on-background] mb-1">{props.title}</h3>

      <Show when={props.description}>
        <p class="text-sm text-[--color-secondary] max-w-xs">{props.description}</p>
      </Show>

      <Show when={props.action}>
        <div class="mt-[--spacing-md]">
          {props.action}
        </div>
      </Show>
    </div>
  );
}
