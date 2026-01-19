
import { createClient } from '@supabase/supabase-js';

const getEnvValue = (key: string): string => {
  // الأولوية لـ Vite (import.meta.env)
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    const val = (import.meta as any).env[key];
    if (val) return val;
  }
  
  // ثم Vercel/Node (process.env)
  if (typeof process !== 'undefined' && process.env) {
    const val = process.env[key];
    if (val) return val;
  }

  // محاولة البحث عن المفاتيح بدون بادئة VITE_ في حال وجودها في Vercel
  const cleanKey = key.replace('VITE_', '');
  if (typeof process !== 'undefined' && process.env && process.env[cleanKey]) {
    return process.env[cleanKey] as string;
  }

  return '';
};

const supabaseUrl = getEnvValue('VITE_SUPABASE_URL') || 'https://yxhqpyhpwumqvytobxtr.supabase.co';
const supabaseAnonKey = getEnvValue('VITE_SUPABASE_ANON_KEY');

if (!supabaseAnonKey) {
  console.warn("⚓ Supabase Anon Key is missing. Storage and Auth features will be limited.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey || 'missing-key', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
