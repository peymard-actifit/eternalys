// Types pour la base de données Supabase - ethernalys-db
// Ces types seront générés automatiquement avec: npx supabase gen types typescript

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Table des utilisateurs (authentification custom)
      users: {
        Row: {
          id: string
          username: string
          password_hash: string
          is_admin: boolean
          created_at: string
          last_login: string | null
        }
        Insert: {
          id?: string
          username: string
          password_hash: string
          is_admin?: boolean
          created_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          username?: string
          password_hash?: string
          is_admin?: boolean
          last_login?: string | null
        }
      }
      // Table des sauvegardes (3 slots par utilisateur)
      game_saves: {
        Row: {
          id: string
          user_id: string
          slot_number: number  // 1, 2, ou 3
          save_name: string
          game_state: Json     // État complet du jeu
          play_time: number    // Temps de jeu en secondes
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          slot_number: number
          save_name: string
          game_state: Json
          play_time?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          save_name?: string
          game_state?: Json
          play_time?: number
          updated_at?: string
        }
      }
      // Table de l'historique des parties par utilisateur
      game_history: {
        Row: {
          id: string
          user_id: string
          result: 'victory' | 'defeat'
          floor_reached: number
          team_composition: Json   // Personnages utilisés
          enemies_killed: number
          damage_dealt: number
          damage_taken: number
          healing_done: number
          play_time: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          result: 'victory' | 'defeat'
          floor_reached: number
          team_composition: Json
          enemies_killed?: number
          damage_dealt?: number
          damage_taken?: number
          healing_done?: number
          play_time?: number
          created_at?: string
        }
        Update: {
          id?: string
          result?: 'victory' | 'defeat'
          floor_reached?: number
          team_composition?: Json
          enemies_killed?: number
          damage_dealt?: number
          damage_taken?: number
          healing_done?: number
          play_time?: number
        }
      }
      // Table des joueurs
      players: {
        Row: {
          id: string
          username: string
          email: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          username: string
          email: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string
          avatar_url?: string | null
          updated_at?: string
        }
      }
      // Table des parties
      games: {
        Row: {
          id: string
          name: string
          status: 'waiting' | 'in_progress' | 'completed' | 'cancelled'
          host_id: string
          max_players: number
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          status?: 'waiting' | 'in_progress' | 'completed' | 'cancelled'
          host_id: string
          max_players?: number
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          status?: 'waiting' | 'in_progress' | 'completed' | 'cancelled'
          host_id?: string
          max_players?: number
          settings?: Json
          updated_at?: string
        }
      }
      // Table des scores
      scores: {
        Row: {
          id: string
          player_id: string
          game_id: string
          score: number
          rank: number | null
          details: Json
          created_at: string
        }
        Insert: {
          id?: string
          player_id: string
          game_id: string
          score: number
          rank?: number | null
          details?: Json
          created_at?: string
        }
        Update: {
          id?: string
          player_id?: string
          game_id?: string
          score?: number
          rank?: number | null
          details?: Json
        }
      }
      // Table des éléments de jeu (items, compétences, etc.)
      game_elements: {
        Row: {
          id: string
          type: string
          name: string
          description: string
          properties: Json
          rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
          created_at: string
        }
        Insert: {
          id?: string
          type: string
          name: string
          description: string
          properties?: Json
          rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
          created_at?: string
        }
        Update: {
          id?: string
          type?: string
          name?: string
          description?: string
          properties?: Json
          rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      game_status: 'waiting' | 'in_progress' | 'completed' | 'cancelled'
      rarity_level: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
    }
  }
}

// Types utilitaires pour faciliter l'utilisation
export type Player = Database['public']['Tables']['players']['Row']
export type Game = Database['public']['Tables']['games']['Row']
export type Score = Database['public']['Tables']['scores']['Row']
export type GameElement = Database['public']['Tables']['game_elements']['Row']

export type NewPlayer = Database['public']['Tables']['players']['Insert']
export type NewGame = Database['public']['Tables']['games']['Insert']
export type NewScore = Database['public']['Tables']['scores']['Insert']
export type NewGameElement = Database['public']['Tables']['game_elements']['Insert']

// Types pour le système d'authentification
export type User = Database['public']['Tables']['users']['Row']
export type NewUser = Database['public']['Tables']['users']['Insert']
export type GameSave = Database['public']['Tables']['game_saves']['Row']
export type NewGameSave = Database['public']['Tables']['game_saves']['Insert']
export type GameHistory = Database['public']['Tables']['game_history']['Row']
export type NewGameHistory = Database['public']['Tables']['game_history']['Insert']

// Type utilisateur sans le mot de passe (pour l'affichage)
export type SafeUser = Omit<User, 'password_hash'>

