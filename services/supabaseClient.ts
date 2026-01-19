
import { createClient } from '@supabase/supabase-js';

const getEnvValue = (key: string): string => {
  // Vite environment
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    const val = (import.meta as any).env[key];
    if (val) return val;
  }
  
  // Process environment (Node/Vercel)
  if (typeof process !== 'undefined' && process.env) {
    const val = process.env[key];
    if (val) return val;
    // Try without VITE_ prefix
    const cleanKey = key.replace('VITE_', '');
    const valClean = process.env[cleanKey];
    if (valClean) return valClean;
  }

  return '';
};

const supabaseUrl = getEnvValue('VITE_SUPABASE_URL') || 'https://yxhqpyhpwumqvytobxtr.supabase.co';
const supabaseAnonKey = getEnvValue('VITE_SUPABASE_ANON_KEY');

// التحقق من وجود المفتاح في الـ Console للمساعدة في التشخيص
if (!supabaseAnonKey) {
  console.error("❌ CRITICAL: Supabase Anon Key is missing! Check your environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey || 'missing-key', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: { 'x-application-name': 'asr-alhamour' }
  }
});
