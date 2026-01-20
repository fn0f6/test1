
import { createClient } from '@supabase/supabase-js';

// الوصول الآمن لمتغيرات بيئة Vite
const getEnvVar = (key: string): string => {
  try {
    // @ts-ignore
    return import.meta.env[key] || '';
  } catch (e) {
    return '';
  }
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

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
