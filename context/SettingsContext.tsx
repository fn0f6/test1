
import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { SupportTicket, NewsItem, UserProfile } from '../types';
import { apiService } from '../services/api';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

export type Language = 'en' | 'ar';

export interface SocialLinks {
  showSocials: boolean;
  whatsapp: string; whatsappGroup: string; telegram: string; discord: string;
  instagram: string; twitter: string; youtube: string; facebook: string; tiktok: string; snapchat: string;
  activeLinks: Record<string, boolean>;
}

export interface SiteSettings {
  logoUrl: string; heroBgUrl: string; siteBgColor: string; siteTitle: string; 
  androidUrl: string; iosUrl: string; isMaintenanceMode: boolean; maintenanceMessage: string;
  qrData: string; customQrUrl: string;
  showcaseImages: Record<string, string>;
  translations: Record<Language, any>;
  socialLinks: SocialLinks;
}

const DEFAULT_SETTINGS: SiteSettings = {
  logoUrl: 'assets/logo.svg',
  heroBgUrl: 'https://images.unsplash.com/photo-1519114056088-b877fe073a5e?auto=format&fit=crop&q=80&w=1600',
  siteBgColor: '#050505',
  siteTitle: 'Asr Al-Hamour',
  androidUrl: '#',
  iosUrl: '#',
  isMaintenanceMode: false,
  maintenanceMessage: 'الأسطول في مهمة صيانة سريعة، سنعود قريباً!',
  qrData: '',
  customQrUrl: '',
  showcaseImages: {},
  translations: {
    en: { navHero: 'Home', navNews: 'News', navShowcase: 'Features', navDownloads: 'App', navSupport: 'Support', heroHeadline: 'Rule the Seas', heroSubheadline: 'Your adventure starts here.' },
    ar: { navHero: 'الرئيسية', navNews: 'الأخبار', navShowcase: 'المميزات', navDownloads: 'التحميل', navSupport: 'الدعم', heroHeadline: 'سيطر على البحار', heroSubheadline: 'مغامرتك تبدأ من هنا.' }
  },
  socialLinks: {
    showSocials: true,
    whatsapp: '', whatsappGroup: '', telegram: '', discord: '',
    instagram: '', twitter: '', youtube: '', facebook: '', tiktok: '', snapchat: '',
    activeLinks: {}
  }
};

interface SettingsContextType {
  settings: SiteSettings; updateSettings: (ns: Partial<SiteSettings>) => Promise<void>;
  tickets: SupportTicket[]; news: NewsItem[];
  addTicket: (tk: any) => Promise<void>; deleteTicket: (id: number) => Promise<void>;
  addNews: (nw: any) => Promise<void>; deleteNews: (id: string) => Promise<void>;
  isLoading: boolean; currentPage: string; navigateTo: (p: any) => void;
  user: UserProfile | null; isAdmin: boolean; lang: Language; setLang: (l: Language) => void; t: any;
  login: (e: string, p: string) => Promise<any>; logout: () => Promise<void>;
  signup: (e: string, p: string) => Promise<any>;
  getAllUsers: () => Promise<UserProfile[]>;
  updateUserRole: (id: string, role: string) => Promise<void>;
  updateUserProfile: (u: any) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('site');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [lang, setLang] = useState<Language>('ar');
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);

  const refreshData = async () => {
    try {
      const [s, n, t] = await Promise.all([
        apiService.getSettings().catch(() => null),
        apiService.getNews().catch(() => []),
        apiService.getTickets().catch(() => [])
      ]);
      if (s) setSettings(s);
      setNews(n);
      setTickets(t);
    } catch (e) {
      console.error("Data refresh failed", e);
    }
  };

  const refreshUserProfile = async () => {
    if (!isSupabaseConfigured) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (!error && data) {
          setUser(data);
        }
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error("Profile refresh error", e);
    }
  };

  useEffect(() => {
    const init = async () => {
      // مؤقت أمان: إذا استغرق التحميل أكثر من 5 ثوانٍ، اجبر الموقع على البدء
      const safetyTimeout = setTimeout(() => {
        setIsLoading(false);
      }, 5000);

      try {
        await refreshUserProfile();
        await refreshData();
      } catch (e) {
        console.error("Initialization error", e);
      } finally {
        clearTimeout(safetyTimeout);
        setIsLoading(false);
      }
    };
    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await refreshUserProfile();
        if (event === 'SIGNED_IN') {
          // التحويل سيتم في AppContent
        }
      } else {
        setUser(null);
        if (event === 'SIGNED_OUT') {
          setCurrentPage('site');
        }
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const value = {
    settings, tickets, news, isLoading, currentPage, lang, setLang,
    user, isAdmin: user?.role === 'admin',
    t: settings?.translations?.[lang] || DEFAULT_SETTINGS.translations[lang],
    navigateTo: setCurrentPage,
    refreshUserProfile,
    login: (email: string, pass: string) => supabase.auth.signInWithPassword({ email, password: pass }),
    signup: (email: string, pass: string) => supabase.auth.signUp({ email, password: pass }),
    logout: () => supabase.auth.signOut(),
    updateSettings: async (ns: any) => {
      const updated = { ...settings, ...ns };
      setSettings(updated);
      await apiService.updateSettings(updated);
    },
    addNews: async (nw: any) => { await apiService.addNews(nw); setNews(await apiService.getNews()); },
    deleteNews: async (id: string) => { await apiService.deleteNews(id); setNews(prev => prev.filter(n => n.id !== id)); },
    addTicket: async (tk: any) => { await apiService.submitTicket(tk); setTickets(await apiService.getTickets()); },
    deleteTicket: async (id: number) => { await apiService.deleteTicket(id); setTickets(prev => prev.filter(t => t.id !== id)); },
    getAllUsers: apiService.getAllProfiles,
    updateUserRole: async (id: string, role: string) => { await apiService.updateUserRole(id, role); },
    updateUserProfile: async (u: any) => { 
      if (!user) return;
      const data = await apiService.updateProfile(user.id, u);
      setUser(data);
    }
  };

  return <SettingsContext.Provider value={value as any}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const c = useContext(SettingsContext);
  if (!c) throw new Error('useSettings error');
  return c;
};
