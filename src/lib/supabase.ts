import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Vérifier si Supabase est configuré
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured) {
  console.warn('Supabase credentials not configured. Some features may not work.')
}

// Créer un client factice si Supabase n'est pas configuré
// Cela évite l'erreur "supabaseUrl is required"
const createSupabaseClient = (): SupabaseClient<Database> | null => {
  if (!isSupabaseConfigured) {
    return null
  }
  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

export const supabase = createSupabaseClient()

// Helper pour vérifier si on peut utiliser Supabase
export const canUseSupabase = (): boolean => {
  return isSupabaseConfigured && supabase !== null
}




