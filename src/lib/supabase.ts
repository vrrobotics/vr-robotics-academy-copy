import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// For static GitHub Pages deployment without backend
// Use placeholder values if environment variables are not set
const url = supabaseUrl || 'https://placeholder.supabase.co';
const key = supabaseAnonKey || 'placeholder-key';

let supabase: ReturnType<typeof createClient> | null = null;

try {
  supabase = createClient(url, key);
} catch (error) {
  console.warn('[Supabase] Failed to initialize client:', error);
  supabase = null;
}

export { supabase };
