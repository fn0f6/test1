

import { createClient } from '@supabase/supabase-js';

// Use type assertion to access Vite environment variables to resolve property 'env' does not exist on type 'ImportMeta'
// في Vite، يتم استبدال import.meta.env وقت البناء تلقائياً.
// استخدام الطريقة المباشرة يضمن عدم فشل الـ AST Parser الخاص بـ Rollup.
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseAnonKey && 
  supabaseAnonKey !== '' && 
  supabaseAnonKey !== 'missing-key'
);

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
