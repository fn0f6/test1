
import { createClient } from '@supabase/supabase-js';

// الرابط الذي قدمته للمشروع
const supabaseUrl = 'https://yxhqpyhpwumqvytobxtr.supabase.co';

// محاولة جلب المفتاح من البيئة، وإذا لم يتوفر سيقوم النظام بتنبيهك
// في بيئة التطوير، تأكد من وجود VITE_SUPABASE_ANON_KEY في ملف .env
const getEnvValue = (key: string): string => {
  const viteEnv = (import.meta as any).env;
  if (viteEnv && viteEnv[key]) return viteEnv[key];
  if (typeof process !== 'undefined' && process.env && process.env[key]) return process.env[key] as string;
  return '';
};

const supabaseAnonKey = getEnvValue('VITE_SUPABASE_ANON_KEY') || getEnvValue('SUPABASE_KEY');

if (!supabaseAnonKey) {
  console.error("🚨 مفتاح Supabase Anon Key مفقود! تأكد من إضافته في الإعدادات.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey || 'missing-key', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
