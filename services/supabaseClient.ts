
import { createClient } from '@supabase/supabase-js';

// تعريف الواجهة لمنع أخطاء TypeScript مع import.meta
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const env = (import.meta as unknown as ImportMeta).env;

const supabaseUrl = env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!supabaseAnonKey && supabaseAnonKey !== '' && supabaseAnonKey !== 'missing-key';

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);
