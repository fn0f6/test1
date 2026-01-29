
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { NewsItem, SupportTicket } from '../types';

const apiService = {
  getSettings: async () => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
      if (error) throw error;
      if (!data) return null;
      
      return {
        logoUrl: data.logo_url || 'assets/logo.svg',
        heroBgUrl: data.hero_bg_url || 'assets/background.svg',
        siteTitle: data.site_title || 'عصر الهامور',
        androidUrl: data.android_url || '#',
        iosUrl: data.ios_url || '#',
        isMaintenanceMode: !!data.is_maintenance_mode,
        maintenanceMessage: data.maintenance_message || 'الأسطول في مهمة صيانة سريعة، سنعود قريباً!',
        qrData: data.qr_data || '',
        customQrUrl: data.custom_qr_url || '',
        showcaseImages: data.showcase_images || {},
        translations: data.translations || {},
        socialLinks: data.social_links || { activeLinks: {} }
      };
    } catch (e) {
      console.warn("Settings fetch failed - using defaults", e);
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

  getNews: async () => {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(item => ({
        id: item.id,
        title: item.title,
        excerpt: item.excerpt,
        thumbnailUrl: item.thumbnail_url || 'https://placehold.co/800x600/111111/ffd700?text=ASR+ALHAMOUR',
        category: item.category || 'تحديث',
        date: item.date || new Date().toLocaleDateString('ar-EG')
      })) as NewsItem[];
    } catch (e) { 
      console.error("News fetch error", e);
      return []; 
    }
  },

  addNews: async (news: any) => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from('news').insert([{
      title: news.title,
      excerpt: news.excerpt,
      thumbnail_url: news.thumbnailUrl || '', // اختيارية
      category: news.category,
      date: new Date().toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })
    }]);
    if (error) throw error;
  },

  deleteNews: async (id: string) => {
    if (!isSupabaseConfigured) return;
    await supabase.from('news').delete().eq('id', id);
  },

  getTickets: async () => {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase.from('tickets').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(t => ({
        id: t.id,
        name: t.name,
        email: t.email,
        subject: t.subject,
        message: t.message,
        createdAt: t.created_at
      })) as SupportTicket[];
    } catch (e) {
      console.error("Tickets fetch error", e);
      return [];
    }
  },

  submitTicket: async (ticket: any) => {
    const { error } = await supabase.from('tickets').insert([{
      name: ticket.name,
      email: ticket.email,
      subject: ticket.subject,
      message: ticket.message
    }]);
    if (error) throw error;
  },

  deleteTicket: async (id: number) => {
    await supabase.from('tickets').delete().eq('id', id);
  },

  getAllProfiles: async () => {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error("Profiles fetch error", e);
      return [];
    }
  },

  updateUserRole: async (id: string, role: string) => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from('profiles').update({ role }).eq('id', id);
    if (error) throw error;
  },

  updateProfile: async (id: string, updates: any) => {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  uploadImage: async (file: File, bucket: string = 'assets') => {
    if (!isSupabaseConfigured) return '';
    const fileExt = file.name.split('.').pop();
    const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const { data, error } = await supabase.storage.from(bucket).upload(cleanFileName, file);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(cleanFileName);
    return publicUrl;
  }
};

export { apiService };
