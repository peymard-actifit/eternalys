import type { SafeUser, GameSave, GameHistory } from '../types/database.types';

/**
 * État de l'authentification
 */
interface AuthState {
  currentUser: SafeUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  saves: GameSave[];
  history: GameHistory[];
}

/**
 * Store simple pour l'authentification
 */
const createAuthStore = () => {
  let state: AuthState = {
    currentUser: null,
    isAuthenticated: false,
    isLoading: false,
    saves: [],
    history: []
  };

  const listeners: Set<() => void> = new Set();
  let initialized = false;

  // Fonction pour initialiser depuis localStorage (appelée seulement côté client)
  const initFromStorage = () => {
    if (initialized) return;
    initialized = true;
    
    if (typeof window === 'undefined') return;
    
    try {
      const storedUser = localStorage.getItem('eternalys_user');
      if (storedUser) {
        state.currentUser = JSON.parse(storedUser);
        state.isAuthenticated = true;
      }
    } catch (e) {
      try {
        localStorage.removeItem('eternalys_user');
      } catch {}
    }
  };

  // Initialiser si on est côté client
  if (typeof window !== 'undefined') {
    initFromStorage();
  }

  return {
    getState: () => state,

    setState: (updates: Partial<AuthState>) => {
      state = { ...state, ...updates };
      listeners.forEach(listener => listener());
    },

    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    /**
     * Connecter un utilisateur
     */
    login: (user: SafeUser) => {
      state = {
        ...state,
        currentUser: user,
        isAuthenticated: true,
        isLoading: false
      };
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('eternalys_user', JSON.stringify(user));
        }
      } catch {}
      listeners.forEach(listener => listener());
    },

    /**
     * Déconnecter l'utilisateur
     */
    logout: () => {
      state = {
        ...state,
        currentUser: null,
        isAuthenticated: false,
        saves: [],
        history: []
      };
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('eternalys_user');
        }
      } catch {}
      listeners.forEach(listener => listener());
    },

    /**
     * Mettre à jour les sauvegardes
     */
    setSaves: (saves: GameSave[]) => {
      state = { ...state, saves };
      listeners.forEach(listener => listener());
    },

    /**
     * Mettre à jour l'historique
     */
    setHistory: (history: GameHistory[]) => {
      state = { ...state, history };
      listeners.forEach(listener => listener());
    },

    /**
     * Définir l'état de chargement
     */
    setLoading: (isLoading: boolean) => {
      state = { ...state, isLoading };
      listeners.forEach(listener => listener());
    }
  };
};

export const authStore = createAuthStore();


