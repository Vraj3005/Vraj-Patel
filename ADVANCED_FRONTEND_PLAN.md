# Advanced Frontend Plan & Guidelines

This document outlines the visual identity foundation, future interaction rollouts, performance guidelines, accessibility compliance, and rollback strategies for Vraj Patel's portfolio.

## 1. Feature List
- **Cursor Spotlight Border Effects**: Subtle light beams that track user cursors around component borders.
- **Magnetic Action Hooks**: Spring-backed cursor pull dynamics for primary navigation buttons and recruiter triggers.
- **Dynamic Scroll Progression**: High-performance window and relative-container vertical scroll trackers.
- **Aesthetic Depth Texture**: CSS noise overlays and grid line layers filtered to avoid distraction.
- **Ambient Color Glows**: Floating gradient backdrops that animate gently to emphasize dashboard modules.

## 2. Components Built & Available
- `lib/motion/variants.ts`: Reusable stagger and movement variants.
- `lib/motion/use-reduced-motion-safe.ts`: Hook mapping system motion preferences.
- `lib/motion/transition-presets.ts`: Shared stiffness/damping settings.
- `hooks/use-mouse-position.ts`: Performance-throttled position tracker relative to window or specific refs.
- `hooks/use-element-bounds.ts`: Element dimensions tracker leveraging `ResizeObserver`.
- `hooks/use-scroll-progress.ts`: Percent vertical scroll listener.
- `hooks/use-intersection.ts`: Viewport entry trigger utilizing `IntersectionObserver`.
- `components/visual/floating-glow.tsx`: Smooth ambient glow backdrops.
- `components/visual/noise-layer.tsx`: High-performance background overlay texturizer.
- `components/visual/grid-layer.tsx`: Radial masked background grid.
- `components/visual/spotlight.tsx`: Hover spotlight reflector layer.
- `components/visual/magnetic-button.tsx`: Spring magnet mouse translation container.
- `components/visual/cursor-border-card.tsx`: Card border mask glowing cursor target.

## 3. Pages Affected (Future Rollout)
- **Homepage (`/`)**: Add noise layer, ambient color glows behind stats, grid background, and cursor border cards on project filters.
- **Projects & Case Studies (`/projects`, `/projects/[slug]`)**: Spotlight effects on case study images, magnetic source buttons.
- **Systems & Architecture (`/systems`)**: Staggered fades on SVG paths, canvas border glow card reflections.
- **Developer Terminal (`/terminal`)**: Scanline simulation overlay and terminal cursor blink animations.

## 4. Performance Risks & Mitigation Rules
- **Large Client Bundles**: All motion utilities depend on Framer Motion. Components utilizing Framer Motion are marked as client-only components (`"use client"`). Heavy or highly-animated components must be dynamically imported via Next.js `next/dynamic` with `ssr: false` to avoid blocking first-load paint:
  ```typescript
  import dynamic from 'next/dynamic';
  const DynamicFloatingGlow = dynamic(() => import('@/components/visual/floating-glow').then(mod => mod.FloatingGlow), { ssr: false });
  ```
- **Global Event Listeners**: Avoid listening to scroll or mousemove events globally unless optimized. Our custom hooks throttling updates via `requestAnimationFrame` prevents layout thrashing.
- **Memory Leaks**: All event listeners, timers, and `ResizeObserver` instances are registered in `useEffect` setups and completely cleared in their return clean-up closures.

## 5. Accessibility (a11y) & Readability Rules
- **Motion Safety**: Respect `prefers-reduced-motion`. The `useReducedMotionSafe` hook and standard wrappers verify preferences and disable physics loops immediately.
- **Text Legibility**: Contrast must never be sacrificed. Background animations and overlay graphics must maintain low opacity (`opacity <= 0.05` for noise/grid overlays, `opacity <= 0.1` for blurs) to ensure body copy remains readable.
- **Interactive Focus**: Ensure magnetic pulls do not prevent keyboard focus navigation. Screen readers must be able to standard-focus buttons, and key events must work independently of mouse position translations.

## 6. Rollback Strategy
- All visual components and motion wrappers are designed as optional styling wrappers. If any component causes unexpected layout issues, it can be swapped back to a standard `div` or class container instantly without breaking the child elements or core page functions.
