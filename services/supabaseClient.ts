
import { createClient } from '@supabase/supabase-js';

const getEnvVar = (key: string): string => {
  try {
    // محاولة القراءة من Vite env أولاً
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      return (import.meta as any).env[key] || (window as any).process?.env?.[key] || '';
    }
    return '';
  } catch (e) {
    return '';
  }
};

// ملاحظة: تأكد من إضافة هذه المتغيرات في ملف .env الخاص بك
const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://')
);

const effectiveUrl = isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co';
const effectiveKey = isSupabaseConfigured ? supabaseAnonKey : 'placeholder';

export const supabase = createClient(effectiveUrl, effectiveKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
