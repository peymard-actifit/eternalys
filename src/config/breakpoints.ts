/**
 * Breakpoints centralisés pour le responsive design
 * Ces valeurs doivent correspondre à celles dans responsive.css
 */

export const BREAKPOINTS = {
  /** Mobile : 0 - 480px */
  mobile: 480,
  /** Tablette : 481px - 768px */
  tablet: 768,
  /** Laptop : 769px - 1024px */
  laptop: 1024,
  /** Desktop : 1025px+ */
  desktop: 1025
} as const;

export type BreakpointName = keyof typeof BREAKPOINTS;

/**
 * Media queries pour utilisation dans styled-components ou CSS-in-JS
 */
export const MEDIA_QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.mobile}px)`,
  tablet: `(min-width: ${BREAKPOINTS.mobile + 1}px) and (max-width: ${BREAKPOINTS.tablet}px)`,
  laptop: `(min-width: ${BREAKPOINTS.tablet + 1}px) and (max-width: ${BREAKPOINTS.laptop}px)`,
  desktop: `(min-width: ${BREAKPOINTS.desktop}px)`,
  touch: '(hover: none) and (pointer: coarse)',
  reducedMotion: '(prefers-reduced-motion: reduce)'
} as const;

/**
 * Vérifie si la largeur d'écran correspond à un breakpoint
 */
export function isBreakpoint(breakpoint: BreakpointName): boolean {
  if (typeof window === 'undefined') return false;
  
  const width = window.innerWidth;
  
  switch (breakpoint) {
    case 'mobile':
      return width <= BREAKPOINTS.mobile;
    case 'tablet':
      return width > BREAKPOINTS.mobile && width <= BREAKPOINTS.tablet;
    case 'laptop':
      return width > BREAKPOINTS.tablet && width <= BREAKPOINTS.laptop;
    case 'desktop':
      return width >= BREAKPOINTS.desktop;
    default:
      return false;
  }
}

/**
 * Retourne le breakpoint actuel
 */
export function getCurrentBreakpoint(): BreakpointName {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  
  if (width <= BREAKPOINTS.mobile) return 'mobile';
  if (width <= BREAKPOINTS.tablet) return 'tablet';
  if (width <= BREAKPOINTS.laptop) return 'laptop';
  return 'desktop';
}



