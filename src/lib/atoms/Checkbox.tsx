import { createSignal, mergeProps, Show } from 'solid-js';
import { useTheme } from '../theme/context.js';

interface CheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  label?: string;
  class?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export function Checkbox(props: CheckboxProps) {
  const merged = mergeProps({ checked: false, indeterminate: false, disabled: false }, props);
  const [checked, setChecked] = createSignal(merged.checked);
  const theme = useTheme();
  const isCrystal = () => theme.mode === 'crystal';

  // Sync external prop changes
  const isChecked = () => props.checked !== undefined ? props.checked : checked();

  function handleClick() {
    if (merged.disabled) return;
    const next = !isChecked();
    setChecked(next);
    props.onCheckedChange?.(next);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  }

  return (
    <label
      class={`checkbox-wrapper ${merged.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} ${props.class ?? ''}`}
    >
      <span
        class="checkbox-box"
        classList={{
          checked: isChecked(),
          indeterminate: merged.indeterminate,
          glass: isCrystal(),
        }}
        role="checkbox"
        aria-checked={merged.indeterminate ? 'mixed' : isChecked()}
        aria-disabled={merged.disabled}
        tabindex={merged.disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeydown}
      >
        <Show when={isChecked()} fallback={
          <Show when={merged.indeterminate}>
            <i class="ri-subtract-line checkbox-icon" />
          </Show>
        }>
          <i class="ri-check-line checkbox-icon" />
        </Show>
      </span>
      <Show when={props.label}>
        <span
          class="text-sm text-[--color-on-background] select-none"
          onClick={handleClick}
        >{props.label}</span>
      </Show>
    </label>
  );
}
