import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'eternalys_animations_enabled';

interface AnimationPreferences {
  animationsEnabled: boolean;
  toggleAnimations: () => void;
  setAnimations: (enabled: boolean) => void;
}

export function useAnimationPreferences(): AnimationPreferences {
  const [animationsEnabled, setAnimationsEnabled] = useState<boolean>(() => {
    // Charger la préférence depuis localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      return stored === 'true';
    }
    // Par défaut, vérifier si l'utilisateur préfère réduire les animations
    if (typeof window !== 'undefined' && window.matchMedia) {
      return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return true;
  });

  // Sauvegarder dans localStorage quand la préférence change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(animationsEnabled));
    
    // Appliquer la classe au body pour désactiver les animations globalement
    if (animationsEnabled) {
      document.body.classList.remove('no-animations');
    } else {
      document.body.classList.add('no-animations');
    }
  }, [animationsEnabled]);

  const toggleAnimations = useCallback(() => {
    setAnimationsEnabled(prev => !prev);
  }, []);

  const setAnimations = useCallback((enabled: boolean) => {
    setAnimationsEnabled(enabled);
  }, []);

  return {
    animationsEnabled,
    toggleAnimations,
    setAnimations
  };
}

export default useAnimationPreferences;

