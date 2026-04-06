// @omnidea/ui — GlassCard (Solid.js)
// Convenience wrapper around GlassPane with padding tokens.

import type { ParentProps } from 'solid-js';
import { GlassPane } from './GlassPane.js';

export interface GlassCardProps extends ParentProps {
  /** Override Crystal FacetStyle properties. */
  style?: Record<string, unknown>;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  class?: string;
}

const padMap: Record<string, string> = {
  none: '',
  sm: 'p-[--spacing-sm]',
  md: 'p-[--spacing-md]',
  lg: 'p-[--spacing-lg]',
};

export function GlassCard(props: GlassCardProps) {
  const padding = () => props.padding ?? 'lg';

  return (
    <GlassPane elevation="card" style={props.style} class={props.class}>
      <div class={padMap[padding()]}>
        {props.children}
      </div>
    </GlassPane>
  );
}
