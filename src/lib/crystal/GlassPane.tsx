// @omnidea/ui — GlassPane (Solid.js)
// Three-tier glass rendering: Crystal WebGPU → CSS glass → Neu fallback.

import { createEffect, createMemo, createSignal, onCleanup, type ParentProps } from 'solid-js';
import { themeConfig, themeCrystal, isCrystalMode as _isCrystalMode, hasCrystal as _hasCrystal } from '../theme/context.js';
import { requestCrystalRender, registerScrollEntry, unregisterScrollEntry } from '../theme/render-loop.js';

export interface GlassPaneProps extends ParentProps {
  /** Override Crystal FacetStyle properties. */
  style?: Record<string, unknown>;
  /** Glass frost level — key from GlassElevation or raw number (0-20). */
  elevation?: string | number;
  /** Corner radius in pixels. */
  cornerRadius?: number;
  class?: string;
}

export function GlassPane(props: GlassPaneProps) {
  const [containerEl, setContainerEl] = createSignal<HTMLDivElement>();

  const elevation = () => props.elevation ?? 'card';
  const cornerRadius = () => props.cornerRadius ?? 20;

  const frostValue = createMemo(() => {
    const elev = elevation();
    if (typeof elev === 'number') return elev / 20;
    const elevations = themeConfig().glass.elevation as unknown as Record<string, number>;
    const raw = elevations[elev] ?? 6;
    return raw / 20;
  });

  // Blur radius: frost 0-1 → blur 0-24px
  const blurRadius = createMemo(() => Math.round(frostValue() * 24));

  // Crystal WebGPU path
  createEffect(() => {
    const crystal = themeCrystal() as any;
    const container = containerEl();

    if (!_hasCrystal() || !crystal || !container) return;

    let el: any = null;
    let currentW = 0;
    let currentH = 0;

    // Register with centralized scroll tracker
    const scrollEntry = registerScrollEntry(container, crystal);

    function buildCrystal(w: number, h: number) {
      if (el) el.destroy();

      el = crystal.rect({
        width: w,
        height: h,
        cornerRadius: cornerRadius(),
        style: {
          frost: frostValue(),
          resonance: true,
          lightSource: { type: 'cursor', falloffRadius: null, baseIntensity: 0.3 },
          ...(props.style ?? {}),
        },
      });

      el.element.style.cssText =
        `position:absolute; inset:0; width:100%; height:100%; pointer-events:none; border-radius:${cornerRadius()}px; transform:translateZ(0);`;

      container!.insertBefore(el.element, container!.firstChild);
      scrollEntry.element = el;
      currentW = w;
      currentH = h;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const box = entry.borderBoxSize?.[0];
        const w = box ? Math.round(box.inlineSize) : Math.round(entry.contentRect.width);
        const h = box ? Math.round(box.blockSize) : Math.round(entry.contentRect.height);
        if (w === 0 || h === 0) return;

        if (w !== currentW || h !== currentH) {
          buildCrystal(w, h);
        }

        const r = container!.getBoundingClientRect();
        el?.setViewportPosition(Math.round(r.left), Math.round(r.top));
        requestCrystalRender(crystal);
      }
    });
    observer.observe(container!);

    // Viewport culling — invisible elements skip all GPU work
    const visObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const isVisible = entry.isIntersecting;
        if (el) el._visible = isVisible;
        if (isVisible) {
          const r = container!.getBoundingClientRect();
          el?.setViewportPosition(Math.round(r.left), Math.round(r.top));
          requestCrystalRender(crystal);
        }
      }
    }, { rootMargin: '100px' });
    visObserver.observe(container);

    onCleanup(() => {
      observer.disconnect();
      visObserver.disconnect();
      unregisterScrollEntry(scrollEntry);
      if (el) el.destroy();
    });
  });

  const containerStyle = createMemo((): string => {
    if (_hasCrystal()) {
      return `border-radius: ${cornerRadius()}px; border: 1px solid rgba(255, 255, 255, 0.1); overflow: hidden;`;
    }
    if (_isCrystalMode()) {
      return `backdrop-filter: blur(${blurRadius()}px); -webkit-backdrop-filter: blur(${blurRadius()}px); background: color-mix(in srgb, var(--color-surface) 30%, transparent); border: 1px solid color-mix(in srgb, var(--color-on-background) 12%, transparent); border-radius: ${cornerRadius()}px; overflow: hidden;`;
    }
    return '';
  });

  const neuClass = createMemo(() => {
    if (!_isCrystalMode()) {
      return 'bg-[--color-surface] shadow-[--shadow-raised] border border-mix-on-background-8 rounded-[--radius-lg]';
    }
    return 'shadow-[--shadow-raised]';
  });

  return (
    <div
      ref={setContainerEl}
      class={`relative ${neuClass()} ${props.class ?? ''}`}
      style={containerStyle()}
    >
      <div
        class={_hasCrystal() ? 'relative' : ''}
        style={_hasCrystal() ? 'z-index: 1;' : ''}
      >
        {props.children}
      </div>
    </div>
  );
}
