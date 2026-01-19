
import { supabase } from './supabaseClient';
import { NewsItem, SupportTicket, UserProfile } from '../types';

export const apiService = {
  getSettings: async () => {
    try {
      const { data, error } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
      if (error) throw error;
      if (!data) return null;

      return {
        logoUrl: data.logo_url || '',
        heroBgUrl: data.hero_bg_url || '',
        siteTitle: data.site_title || 'عصر الهامور',
        androidUrl: data.android_url || '#',
        iosUrl: data.ios_url || '#',
        isMaintenanceMode: !!data.is_maintenance_mode,
        maintenanceMessage: data.maintenance_message || '',
        showcaseImages: data.showcase_images || {},
        translations: data.translations || {},
        socialLinks: data.social_links || {}
      };
    } catch (e) {
      console.error("Settings Fetch Error:", e);
      return null;
    }
  },

  updateSettings: async (settings: any) => {
    const dbPayload = {
      id: 1,
      logo_url: settings.logoUrl,
      hero_bg_url: settings.heroBgUrl,
      site_title: settings.siteTitle,
      android_url: settings.androidUrl,
      ios_url: settings.ios_url,
      is_maintenance_mode: settings.isMaintenanceMode,
      maintenance_message: settings.maintenanceMessage,
      showcase_images: settings.showcaseImages,
      translations: settings.translations,
      social_links: settings.socialLinks,
      updated_at: new Date().toISOString()
    };
    
    const { error } = await supabase.from('settings').upsert(dbPayload);
    if (error) throw error;
  },

  // Map snake_case thumbnail_url to camelCase thumbnailUrl
  getNews: async () => {
    const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    if (error) return [];
    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      excerpt: item.excerpt,
      thumbnailUrl: item.thumbnail_url,
      category: item.category,
      date: item.date
    })) as NewsItem[];
  },

  addNews: async (news: any) => {
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
    await supabase.from('news').delete().eq('id', id);
  },

  // Map snake_case created_at to camelCase createdAt
  getTickets: async () => {
    const { data, error } = await supabase.from('tickets').select('*').order('created_at', { ascending: false });
    if (error) return [];
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      subject: item.subject,
      message: item.message,
      createdAt: item.created_at
    })) as SupportTicket[];
  },

  submitTicket: async (ticket: any) => {
    const { error } = await supabase.from('tickets').insert([{
      name: ticket.name,
      email: ticket.email,
      subject: ticket.subject,
      message: ticket.message,
      created_at: new Date().toISOString()
    }]);
    if (error) throw error;
  },

  deleteTicket: async (id: number) => {
    await supabase.from('tickets').delete().eq('id', id);
  },

  getAllProfiles: async () => {
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    return data || [];
  },

  updateUserRole: async (id: string, role: string) => {
    const { error } = await supabase.from('profiles').update({ role }).eq('id', id);
    if (error) throw error;
  },

  updateProfile: async (id: string, updates: any) => {
    const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  uploadImage: async (file: File, bucketName: string) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, arrayBuffer, {
          contentType: file.type,
          upsert: true
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (e: any) {
      console.error("Storage Upload Error:", e);
      throw e;
    }
  }
};
