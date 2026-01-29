
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { NewsItem, SupportTicket } from '../types';

const apiService = {
  // جلب إعدادات الموقع
  getSettings: async () => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
      if (error) throw error;
      if (!data) return null;
      
      return {
        logoUrl: data.logo_url,
        heroBgUrl: data.hero_bg_url,
        siteTitle: data.site_title,
        androidUrl: data.android_url,
        iosUrl: data.ios_url,
        isMaintenanceMode: !!data.is_maintenance_mode,
        maintenanceMessage: data.maintenance_message,
        qrData: data.qr_data,
        customQrUrl: data.custom_qr_url,
        showcaseImages: data.showcase_images || {},
        translations: data.translations || {},
        socialLinks: data.social_links || {}
      };
    } catch (e) {
      console.warn("Settings fetch failed, using defaults. Error:", e);
      return null;
    }
  },

  updateSettings: async (settings: any) => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from('settings').upsert({
      id: 1,
      logo_url: settings.logoUrl,
      hero_bg_url: settings.heroBgUrl,
      site_title: settings.siteTitle,
      android_url: settings.androidUrl,
      ios_url: settings.iosUrl,
      is_maintenance_mode: settings.isMaintenanceMode,
      maintenance_message: settings.maintenanceMessage,
      qr_data: settings.qrData,
      custom_qr_url: settings.customQrUrl,
      showcase_images: settings.showcaseImages,
      translations: settings.translations,
      social_links: settings.socialLinks,
      updated_at: new Date().toISOString()
    });
    if (error) throw error;
  },

  // الأخبار
  getNews: async () => {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false });
      if (error) return [];
      return (data || []).map(item => ({
        id: item.id,
        title: item.title,
        excerpt: item.excerpt,
        thumbnailUrl: item.thumbnail_url,
        category: item.category,
        date: item.date
      })) as NewsItem[];
    } catch { return []; }
  },

  addNews: async (news: any) => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from('news').insert([{
      title: news.title,
      excerpt: news.excerpt,
      thumbnail_url: news.thumbnailUrl,
      category: news.category,
      date: new Date().toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })
    }]);
    if (error) throw error;
  },

  deleteNews: async (id: string) => {
    if (!isSupabaseConfigured) return;
    await supabase.from('news').delete().eq('id', id);
  },

  // رسائل الدعم
  getTickets: async () => {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase.from('tickets').select('*').order('created_at', { ascending: false });
      if (error) return [];
      return (data || []) as SupportTicket[];
    } catch { return []; }
  },

  submitTicket: async (ticket: any) => {
    const { error } = await supabase.from('tickets').insert([ticket]);
    if (error) throw error;
  },

  deleteTicket: async (id: number) => {
    await supabase.from('tickets').delete().eq('id', id);
  },

  // إدارة المستخدمين
  getAllProfiles: async () => {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    return data || [];
  },

  updateUserRole: async (id: string, role: string) => {
    if (!isSupabaseConfigured) return;
    await supabase.from('profiles').update({ role }).eq('id', id);
  },

  updateProfile: async (id: string, updates: any) => {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  // رفع الصور
  uploadImage: async (file: File, bucket: string = 'assets') => {
    if (!isSupabaseConfigured) return '';
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from(bucket).upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  }
};

export { apiService };
