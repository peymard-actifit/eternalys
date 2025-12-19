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

  // Charger l'utilisateur depuis le localStorage au démarrage
  const storedUser = localStorage.getItem('eternalys_user');
  if (storedUser) {
    try {
      state.currentUser = JSON.parse(storedUser);
      state.isAuthenticated = true;
    } catch (e) {
      localStorage.removeItem('eternalys_user');
    }
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
      localStorage.setItem('eternalys_user', JSON.stringify(user));
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
      localStorage.removeItem('eternalys_user');
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


