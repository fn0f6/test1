
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { NewsItem, SupportTicket, UserProfile } from '../types';

// --- MOCK DATA FOR OFFLINE MODE ---
const MOCK_NEWS: NewsItem[] = [
  { id: '1', title: 'Welcome to the Fleet', excerpt: 'The dashboard is running in demo mode. Configure Supabase to see real data.', category: 'System', date: new Date().toLocaleDateString('en-US'), thumbnailUrl: 'https://images.unsplash.com/photo-1596529896791-537449298538' },
  { id: '2', title: 'Storm Ahead', excerpt: 'Prepare the ships for a heavy storm approaching from the north.', category: 'Weather', date: new Date().toLocaleDateString('en-US'), thumbnailUrl: 'https://images.unsplash.com/photo-1500043204644-768d20653f32' }
];

const MOCK_TICKETS: SupportTicket[] = [
  { id: 1, name: 'Jack', email: 'jack@pirate.com', subject: 'Login Issue', message: 'Cannot access my quarters.', createdAt: new Date().toISOString() }
];

const MOCK_PROFILES: UserProfile[] = [
  { id: 'mock-admin', email: 'admin@fleet.com', role: 'admin', display_name: 'Fleet Admiral', avatar_url: '' },
  { id: 'mock-user', email: 'crew@fleet.com', role: 'user', display_name: 'Deck Hand', avatar_url: '' }
];

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
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
        showcaseImages: data.showcase_images || {},
        translations: data.translations || {},
        socialLinks: data.social_links || {},
        qrData: data.qr_data || '',
        customQrUrl: data.custom_qr_url || ''
      };
    } catch (e: any) {
      console.warn("Settings API Error (using defaults):", e?.message || e);
      return null;
    }
  },

  updateSettings: async (settings: any) => {
    if (!isSupabaseConfigured) {
      await delay(300);
      return;
    }

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
        showcase_images: settings.showcaseImages,
        translations: settings.translations,
        social_links: settings.socialLinks,
        qr_data: settings.qrData,
        custom_qr_url: settings.customQrUrl,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase.from('settings').upsert(dbPayload);
      if (error) throw error;
    } catch (e) {
      console.error("Failed to update settings:", e);
      throw e;
    }
  },

  // --- الأخبار ---
  getNews: async () => {
    if (!isSupabaseConfigured) {
      return MOCK_NEWS;
    }

    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return (data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        excerpt: item.excerpt,
        thumbnailUrl: item.thumbnail_url,
        category: item.category,
        date: item.date
      })) as NewsItem[];
    } catch (error: any) {
      console.warn("Supabase fetch news failed, falling back to mocks:", error?.message || error);
      return MOCK_NEWS;
    }
  },

  addNews: async (news: any) => {
    if (!isSupabaseConfigured) {
      MOCK_NEWS.unshift({ ...news, id: Date.now().toString(), date: new Date().toLocaleDateString() });
      return;
    }

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
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) throw error;
  },

  // --- تذاكر الدعم ---
  getTickets: async () => {
    if (!isSupabaseConfigured) return MOCK_TICKETS;

    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        subject: item.subject,
        message: item.message,
        createdAt: item.created_at
      })) as SupportTicket[];
    } catch (error) {
      return MOCK_TICKETS;
    }
  },

  submitTicket: async (ticket: any) => {
    if (!isSupabaseConfigured) {
      return;
    }
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
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from('tickets').delete().eq('id', id);
    if (error) throw error;
  },

  // --- المستخدمين والبروفايل ---
  getAllProfiles: async () => {
    if (!isSupabaseConfigured) return MOCK_PROFILES;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (e) {
      return MOCK_PROFILES;
    }
  },

  updateUserRole: async (id: string, role: string) => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from('profiles').update({ role }).eq('id', id);
    if (error) throw error;
  },

  updateProfile: async (id: string, updates: any) => {
    if (!isSupabaseConfigured) {
      return { ...MOCK_PROFILES[0], ...updates };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;

      try {
        if (updates.display_name || updates.avatar_url) {
            await supabase.auth.updateUser({
                data: {
                    display_name: updates.display_name,
                    avatar_url: updates.avatar_url
                }
            });
        }
      } catch (e) {}

      return data;
    } catch (err) {
      throw err;
    }
  },

  // --- رفع الملفات ---
  uploadImage: async (file: File, bucketName: string) => {
    if (!isSupabaseConfigured) {
      return URL.createObjectURL(file);
    }

    try {
      const fileExt = file.name.split('.').pop();
      const randomId = Math.random().toString(36).substring(2, 10);
      const fileName = `${Date.now()}_${randomId}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err: any) {
      console.error("Upload Error:", err.message);
      throw new Error(`فشل رفع الصورة: ${err.message}`);
    }
  }
};
