
import { createClient } from '@supabase/supabase-js';

// استخدام استدعاء Vite الرسمي لمتغيرات البيئة لمنع خطأ Rollup/Process
// Fixed type error by casting import.meta to any to access Vite environment variables
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!supabaseAnonKey && supabaseAnonKey !== '' && supabaseAnonKey !== 'missing-key';

if (!isSupabaseConfigured) {
  console.warn("⚠️ Supabase is not configured properly. Check your .env file.");
}

export const supabase = createClient(
  supabaseUrl || 'https://kldrokcxvyyaxkbkjkrf.supabase.co', 
  supabaseAnonKey || 'sb_publishable_8iBP5Mp0CwmTYF2tqytV7w_OQvKbwAo',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);
