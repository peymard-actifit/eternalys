import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'eternalys_auto_mode';

// 3 modes d'animation
// 'off' = animations normales, attente validation manuelle
// 'on' = auto-validation avec animations (vitesse accélérée)
// 'skip' = pas d'animations, résultat direct affiché au centre
export type AnimationMode = 'off' | 'on' | 'skip';

interface AnimationPreferences {
  animationMode: AnimationMode;
  setAnimationMode: (mode: AnimationMode) => void;
  cycleMode: () => void;
  // Helpers
  isManual: boolean;      // Mode 'off' - validation manuelle
  isAuto: boolean;        // Mode 'on' - auto avec animations
  isSkip: boolean;        // Mode 'skip' - pas d'animations
  // Compatibilité legacy
  autoMode: boolean;
  toggleAutoMode: () => void;
  setAutoMode: (enabled: boolean) => void;
  animationsEnabled: boolean;
  toggleAnimations: () => void;
  setAnimations: (enabled: boolean) => void;
}

export function useAnimationPreferences(): AnimationPreferences {
  const [animationMode, setAnimationModeState] = useState<AnimationMode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'on' || stored === 'off' || stored === 'skip') {
        return stored as AnimationMode;
      }
      // Migration depuis l'ancien format boolean
      if (stored === 'true') return 'on';
    } catch {}
    return 'off'; // Par défaut, mode manuel
  });

  // Sauvegarder dans localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, animationMode);
    } catch {}
    
    // Classes CSS
    document.body.classList.remove('no-animations', 'auto-mode', 'skip-mode');
    if (animationMode === 'on') {
      document.body.classList.add('auto-mode');
    } else if (animationMode === 'skip') {
      document.body.classList.add('no-animations', 'skip-mode');
    }
  }, [animationMode]);

  const setAnimationMode = useCallback((mode: AnimationMode) => {
    setAnimationModeState(mode);
  }, []);

  // Cycle entre les 3 modes: off -> on -> skip -> off
  const cycleMode = useCallback(() => {
    setAnimationModeState(prev => {
      if (prev === 'off') return 'on';
      if (prev === 'on') return 'skip';
      return 'off';
    });
  }, []);

  // Helpers
  const isManual = animationMode === 'off';
  const isAuto = animationMode === 'on';
  const isSkip = animationMode === 'skip';

  // Compatibilité legacy
  const autoMode = animationMode !== 'off';
  const toggleAutoMode = cycleMode;
  const setAutoMode = useCallback((enabled: boolean) => {
    setAnimationModeState(enabled ? 'on' : 'off');
  }, []);

  return {
    animationMode,
    setAnimationMode,
    cycleMode,
    isManual,
    isAuto,
    isSkip,
    // Legacy
    autoMode,
    toggleAutoMode,
    setAutoMode,
    animationsEnabled: !isSkip,
    toggleAnimations: cycleMode,
    setAnimations: (enabled: boolean) => setAnimationModeState(enabled ? 'off' : 'skip')
  };
}

export default useAnimationPreferences;
