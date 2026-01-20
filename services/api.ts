
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { NewsItem, SupportTicket, UserProfile } from '../types';

export const apiService = {
  // --- إرسال بريد ترحيبي (محاكاة) ---
  sendWelcomeEmail: async (email: string, displayName: string) => {
    console.log(`📧 Welcome email simulation for: ${email}`);
    return { success: true };
  },

  // --- إعدادات الموقع ---
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
      console.error("API Error [getSettings]:", e);
      return null;
    }
  },

  updateSettings: async (settings: any) => {
    if (!isSupabaseConfigured) return;
    try {
      const dbPayload = {
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
      };
      
      const { error } = await supabase.from('settings').upsert(dbPayload);
      if (error) throw error;
    } catch (e) {
      console.error("API Error [updateSettings]:", e);
      throw e;
    }
  },

  // --- الأخبار ---
  getNews: async () => {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        excerpt: item.excerpt,
        thumbnailUrl: item.thumbnail_url,
        category: item.category,
        date: item.date
      })) as NewsItem[];
    } catch (e) {
      return [];
    }
  },

  addNews: async (news: any) => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from('news').insert([{
      title: news.title,
      excerpt: news.excerpt,
      thumbnail_url: news.thumbnailUrl,
      category: news.category,
      date: new Date().toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }),
      created_at: new Date().toISOString()
    }]);
    if (error) throw error;
  },

  deleteNews: async (id: string) => {
    if (!isSupabaseConfigured) return;
    await supabase.from('news').delete().eq('id', id);
  },

  // --- تذاكر الدعم ---
  getTickets: async () => {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase.from('tickets').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as SupportTicket[];
    } catch (e) {
      return [];
    }
  },

  submitTicket: async (ticket: any) => {
    if (!isSupabaseConfigured) return;
    await supabase.from('tickets').insert([{ 
      name: ticket.name, 
      email: ticket.email, 
      subject: ticket.subject, 
      message: ticket.message,
      created_at: new Date().toISOString() 
    }]);
  },

  deleteTicket: async (id: number) => {
    if (!isSupabaseConfigured) return;
    await supabase.from('tickets').delete().eq('id', id);
  },

  // --- ملفات المستخدمين ---
  getAllProfiles: async () => {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    return error ? [] : data;
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

  uploadImage: async (file: File, bucketName: string) => {
    if (!isSupabaseConfigured) return URL.createObjectURL(file);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from(bucketName).upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(fileName);
      return publicUrl;
    } catch (e: any) {
      throw new Error(`Upload failed: ${e.message}`);
    }
  }
};
