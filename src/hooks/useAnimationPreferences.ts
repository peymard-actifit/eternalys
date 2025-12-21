import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'eternalys_auto_mode';

interface AnimationPreferences {
  autoMode: boolean;
  toggleAutoMode: () => void;
  setAutoMode: (enabled: boolean) => void;
  // Alias pour compatibilité
  animationsEnabled: boolean;
  toggleAnimations: () => void;
  setAnimations: (enabled: boolean) => void;
}

export function useAnimationPreferences(): AnimationPreferences {
  const [autoMode, setAutoModeState] = useState<boolean>(() => {
    // Charger la préférence depuis localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        return stored === 'true';
      }
    } catch {}
    return false; // Par défaut, mode auto désactivé
  });

  // Sauvegarder dans localStorage quand la préférence change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(autoMode));
    } catch {}
    
    // Appliquer la classe au body pour désactiver les animations globalement
    if (autoMode) {
      document.body.classList.add('no-animations');
      document.body.classList.add('auto-mode');
    } else {
      document.body.classList.remove('no-animations');
      document.body.classList.remove('auto-mode');
    }
  }, [autoMode]);

  const toggleAutoMode = useCallback(() => {
    setAutoModeState(prev => !prev);
  }, []);

  const setAutoMode = useCallback((enabled: boolean) => {
    setAutoModeState(enabled);
  }, []);

  // Alias pour compatibilité
  return {
    autoMode,
    toggleAutoMode,
    setAutoMode,
    // Compatibilité avec l'ancien nom
    animationsEnabled: !autoMode,
    toggleAnimations: toggleAutoMode,
    setAnimations: (enabled: boolean) => setAutoMode(!enabled)
  };
}

export default useAnimationPreferences;

