import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let supabase: ReturnType<typeof createClient> | null = null;

if (!isSupabaseConfigured) {
  console.warn('[Supabase] Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY');
} else {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.warn('[Supabase] Failed to initialize client:', error);
    supabase = null;
  }
}

export { supabase, isSupabaseConfigured };
