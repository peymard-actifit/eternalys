import { useState, useEffect, useCallback } from 'react';

/**
 * Types d'appareils supportés
 */
export type DeviceType = 'mobile' | 'tablet' | 'laptop' | 'desktop';
export type OrientationType = 'portrait' | 'landscape';

/**
 * Interface pour les infos de l'appareil
 */
export interface DeviceInfo {
  type: DeviceType;
  orientation: OrientationType;
  isTouchDevice: boolean;
  isHighDPI: boolean;
  screenWidth: number;
  screenHeight: number;
  prefersReducedMotion: boolean;
}

/**
 * Breakpoints en pixels
 */
const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  laptop: 1024,
  desktop: Infinity
};

/**
 * Détermine le type d'appareil basé sur la largeur d'écran
 */
function getDeviceType(width: number): DeviceType {
  if (width <= BREAKPOINTS.mobile) return 'mobile';
  if (width <= BREAKPOINTS.tablet) return 'tablet';
  if (width <= BREAKPOINTS.laptop) return 'laptop';
  return 'desktop';
}

/**
 * Détermine l'orientation
 */
function getOrientation(): OrientationType {
  if (typeof window === 'undefined') return 'portrait';
  return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
}

/**
 * Vérifie si c'est un appareil tactile
 */
function checkTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || 
    navigator.maxTouchPoints > 0 || 
    (navigator as any).msMaxTouchPoints > 0;
}

/**
 * Vérifie si c'est un écran haute résolution
 */
function checkHighDPI(): boolean {
  if (typeof window === 'undefined') return false;
  return window.devicePixelRatio >= 2;
}

/**
 * Vérifie la préférence de mouvement réduit
 */
function checkPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Hook pour détecter le type d'appareil et ses caractéristiques
 */
export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => ({
    type: typeof window !== 'undefined' ? getDeviceType(window.innerWidth) : 'desktop',
    orientation: getOrientation(),
    isTouchDevice: checkTouchDevice(),
    isHighDPI: checkHighDPI(),
    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 1920,
    screenHeight: typeof window !== 'undefined' ? window.innerHeight : 1080,
    prefersReducedMotion: checkPrefersReducedMotion()
  }));

  const updateDeviceInfo = useCallback(() => {
    setDeviceInfo({
      type: getDeviceType(window.innerWidth),
      orientation: getOrientation(),
      isTouchDevice: checkTouchDevice(),
      isHighDPI: checkHighDPI(),
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      prefersReducedMotion: checkPrefersReducedMotion()
    });
  }, []);

  useEffect(() => {
    // Mettre à jour au redimensionnement
    window.addEventListener('resize', updateDeviceInfo);
    
    // Mettre à jour au changement d'orientation
    window.addEventListener('orientationchange', updateDeviceInfo);
    
    // Écouter les changements de préférence de mouvement
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', updateDeviceInfo);
    
    // Initial update
    updateDeviceInfo();
    
    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
      motionQuery.removeEventListener('change', updateDeviceInfo);
    };
  }, [updateDeviceInfo]);

  return deviceInfo;
}

/**
 * Hook simplifié pour savoir si on est sur mobile
 */
export function useIsMobile(): boolean {
  const { type } = useDeviceDetection();
  return type === 'mobile';
}

/**
 * Hook simplifié pour savoir si on est sur tablette
 */
export function useIsTablet(): boolean {
  const { type } = useDeviceDetection();
  return type === 'tablet';
}

/**
 * Hook simplifié pour savoir si on est sur un appareil tactile
 */
export function useIsTouchDevice(): boolean {
  const { isTouchDevice } = useDeviceDetection();
  return isTouchDevice;
}

/**
 * Ajoute une classe CSS au body selon le type d'appareil
 */
export function useDeviceClass(): void {
  const { type, orientation, isTouchDevice } = useDeviceDetection();
  
  useEffect(() => {
    const body = document.body;
    
    // Supprimer les anciennes classes
    body.classList.remove('device-mobile', 'device-tablet', 'device-laptop', 'device-desktop');
    body.classList.remove('orientation-portrait', 'orientation-landscape');
    body.classList.remove('touch-device', 'pointer-device');
    
    // Ajouter les nouvelles classes
    body.classList.add(`device-${type}`);
    body.classList.add(`orientation-${orientation}`);
    body.classList.add(isTouchDevice ? 'touch-device' : 'pointer-device');
    
    // Log pour debug en développement
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Device] Type: ${type}, Orientation: ${orientation}, Touch: ${isTouchDevice}`);
    }
  }, [type, orientation, isTouchDevice]);
}

export default useDeviceDetection;



