import { supabase } from '../lib/supabase';
import type { User, SafeUser, NewUser, GameSave, NewGameSave, GameHistory, NewGameHistory } from '../types/database.types';

/**
 * Hash simple pour le mot de passe
 * Note: En production, utiliser bcrypt ou argon2 côté serveur
 */
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'eternalys_salt_2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Vérifie si le mot de passe correspond au hash
 */
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const newHash = await hashPassword(password);
  return newHash === hash;
}

/**
 * Service d'authentification
 */
export const authService = {
  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(username: string, password: string): Promise<{ user: SafeUser | null; error: string | null }> {
    try {
      // Vérifier si l'utilisateur existe déjà
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('username', username.toLowerCase())
        .single();

      if (existing) {
        return { user: null, error: 'Ce nom d\'utilisateur est déjà pris' };
      }

      // Hasher le mot de passe
      const passwordHash = await hashPassword(password);

      // Créer l'utilisateur
      const { data, error } = await supabase
        .from('users')
        .insert({
          username: username.toLowerCase(),
          password_hash: passwordHash,
          is_admin: false
        })
        .select('id, username, is_admin, created_at, last_login')
        .single();

      if (error) {
        console.error('Erreur création utilisateur:', error);
        return { user: null, error: 'Erreur lors de la création du compte' };
      }

      return { user: data as SafeUser, error: null };
    } catch (err) {
      console.error('Erreur register:', err);
      return { user: null, error: 'Erreur de connexion à la base de données' };
    }
  },

  /**
   * Connexion d'un utilisateur
   */
  async login(username: string, password: string): Promise<{ user: SafeUser | null; error: string | null }> {
    try {
      // Récupérer l'utilisateur
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username.toLowerCase())
        .single();

      if (error || !user) {
        return { user: null, error: 'Nom d\'utilisateur ou mot de passe incorrect' };
      }

      // Vérifier le mot de passe
      const isValid = await verifyPassword(password, user.password_hash);
      if (!isValid) {
        return { user: null, error: 'Nom d\'utilisateur ou mot de passe incorrect' };
      }

      // Mettre à jour last_login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id);

      // Retourner l'utilisateur sans le mot de passe
      const safeUser: SafeUser = {
        id: user.id,
        username: user.username,
        is_admin: user.is_admin,
        created_at: user.created_at,
        last_login: new Date().toISOString()
      };

      return { user: safeUser, error: null };
    } catch (err) {
      console.error('Erreur login:', err);
      return { user: null, error: 'Erreur de connexion à la base de données' };
    }
  },

  /**
   * Récupérer tous les utilisateurs (admin seulement)
   */
  async getAllUsers(): Promise<{ users: SafeUser[]; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, is_admin, created_at, last_login')
        .order('created_at', { ascending: false });

      if (error) {
        return { users: [], error: 'Erreur lors de la récupération des utilisateurs' };
      }

      return { users: data as SafeUser[], error: null };
    } catch (err) {
      console.error('Erreur getAllUsers:', err);
      return { users: [], error: 'Erreur de connexion à la base de données' };
    }
  },

  /**
   * Créer le compte admin par défaut si nécessaire
   */
  async ensureAdminExists(): Promise<void> {
    try {
      // Vérifier si l'admin existe
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('username', 'admin')
        .single();

      if (!existing) {
        // Créer le compte admin
        const passwordHash = await hashPassword('124578');
        await supabase
          .from('users')
          .insert({
            username: 'admin',
            password_hash: passwordHash,
            is_admin: true
          });
        console.log('Compte admin créé avec succès');
      }
    } catch (err) {
      console.error('Erreur ensureAdminExists:', err);
    }
  }
};

/**
 * Service de sauvegarde
 */
export const saveService = {
  /**
   * Récupérer les sauvegardes d'un utilisateur
   */
  async getSaves(userId: string): Promise<{ saves: GameSave[]; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('game_saves')
        .select('*')
        .eq('user_id', userId)
        .order('slot_number', { ascending: true });

      if (error) {
        return { saves: [], error: 'Erreur lors de la récupération des sauvegardes' };
      }

      return { saves: data || [], error: null };
    } catch (err) {
      console.error('Erreur getSaves:', err);
      return { saves: [], error: 'Erreur de connexion à la base de données' };
    }
  },

  /**
   * Sauvegarder une partie
   */
  async saveGame(userId: string, slotNumber: number, saveName: string, gameState: object, playTime: number): Promise<{ save: GameSave | null; error: string | null }> {
    try {
      // Vérifier si le slot existe déjà
      const { data: existing } = await supabase
        .from('game_saves')
        .select('id')
        .eq('user_id', userId)
        .eq('slot_number', slotNumber)
        .single();

      if (existing) {
        // Mettre à jour la sauvegarde existante
        const { data, error } = await supabase
          .from('game_saves')
          .update({
            save_name: saveName,
            game_state: gameState,
            play_time: playTime,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) {
          return { save: null, error: 'Erreur lors de la sauvegarde' };
        }
        return { save: data, error: null };
      } else {
        // Créer une nouvelle sauvegarde
        const { data, error } = await supabase
          .from('game_saves')
          .insert({
            user_id: userId,
            slot_number: slotNumber,
            save_name: saveName,
            game_state: gameState,
            play_time: playTime
          })
          .select()
          .single();

        if (error) {
          return { save: null, error: 'Erreur lors de la sauvegarde' };
        }
        return { save: data, error: null };
      }
    } catch (err) {
      console.error('Erreur saveGame:', err);
      return { save: null, error: 'Erreur de connexion à la base de données' };
    }
  },

  /**
   * Charger une sauvegarde
   */
  async loadGame(userId: string, slotNumber: number): Promise<{ save: GameSave | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('game_saves')
        .select('*')
        .eq('user_id', userId)
        .eq('slot_number', slotNumber)
        .single();

      if (error) {
        return { save: null, error: 'Aucune sauvegarde dans ce slot' };
      }

      return { save: data, error: null };
    } catch (err) {
      console.error('Erreur loadGame:', err);
      return { save: null, error: 'Erreur de connexion à la base de données' };
    }
  },

  /**
   * Supprimer une sauvegarde
   */
  async deleteSave(userId: string, slotNumber: number): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('game_saves')
        .delete()
        .eq('user_id', userId)
        .eq('slot_number', slotNumber);

      if (error) {
        return { success: false, error: 'Erreur lors de la suppression' };
      }

      return { success: true, error: null };
    } catch (err) {
      console.error('Erreur deleteSave:', err);
      return { success: false, error: 'Erreur de connexion à la base de données' };
    }
  }
};

/**
 * Service d'historique des parties
 */
export const historyService = {
  /**
   * Récupérer l'historique d'un utilisateur
   */
  async getHistory(userId: string): Promise<{ history: GameHistory[]; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('game_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        return { history: [], error: 'Erreur lors de la récupération de l\'historique' };
      }

      return { history: data || [], error: null };
    } catch (err) {
      console.error('Erreur getHistory:', err);
      return { history: [], error: 'Erreur de connexion à la base de données' };
    }
  },

  /**
   * Ajouter une entrée à l'historique
   */
  async addToHistory(entry: NewGameHistory): Promise<{ history: GameHistory | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('game_history')
        .insert(entry)
        .select()
        .single();

      if (error) {
        return { history: null, error: 'Erreur lors de l\'ajout à l\'historique' };
      }

      return { history: data, error: null };
    } catch (err) {
      console.error('Erreur addToHistory:', err);
      return { history: null, error: 'Erreur de connexion à la base de données' };
    }
  },

  /**
   * Supprimer l'historique d'un utilisateur
   */
  async clearHistory(userId: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('game_history')
        .delete()
        .eq('user_id', userId);

      if (error) {
        return { success: false, error: 'Erreur lors de la suppression de l\'historique' };
      }

      return { success: true, error: null };
    } catch (err) {
      console.error('Erreur clearHistory:', err);
      return { success: false, error: 'Erreur de connexion à la base de données' };
    }
  }
};


