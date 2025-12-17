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

