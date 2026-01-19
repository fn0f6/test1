
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { SupportTicket, NewsItem, UserProfile } from '../types';
import { apiService } from '../services/api';
import { supabase } from '../services/supabaseClient';

export type Language = 'en' | 'ar';

export interface SocialLinks {
  showSocials: boolean; whatsapp: string; whatsappGroup: string; telegram: string; discord: string;
  instagram: string; twitter: string; youtube: string; facebook: string; tiktok: string; snapchat: string;
  activeLinks: {
    whatsapp: boolean; whatsappGroup: boolean; telegram: boolean; discord: boolean; instagram: boolean;
    twitter: boolean; youtube: boolean; facebook: boolean; tiktok: boolean; snapchat: boolean;
  };
}

export interface SiteSettings {
  logoUrl: string; heroBgUrl: string; siteBgColor: string; primaryColor: string; secondaryColor: string;
  siteTitle: string; androidUrl: string; iosUrl: string; isMaintenanceMode: boolean; maintenanceMessage: string;
  qrData: string; customQrUrl: string;
  showcaseImages: { map: string; rank: string; tasks: string; chat: string; store: string; warehouse: string; };
  translations: Record<Language, any>;
  socialLinks: SocialLinks;
}

interface SettingsContextType {
  settings: SiteSettings; updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  tickets: SupportTicket[]; news: NewsItem[];
  addTicket: (ticket: any) => Promise<void>; addNews: (news: any) => Promise<void>;
  deleteNews: (id: string) => Promise<void>; deleteTicket: (id: number) => Promise<void>;
  isLoading: boolean; currentPage: 'site' | 'admin' | 'login'; navigateTo: (page: 'site' | 'admin' | 'login') => void;
  user: UserProfile | null;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  getAllUsers: () => Promise<UserProfile[]>;
  updateUserRole: (id: string, role: 'admin' | 'user') => Promise<void>;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<{ data: any; error: any }>;
  signup: (email: string, pass: string) => Promise<{ data: any; error: any; message?: string }>;
  logout: () => Promise<void>;
  lang: Language; setLang: (lang: Language) => void; t: any;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const DEFAULT_TRANSLATIONS = { 
  en: { navHome: 'Home', navNews: 'News', navShowcase: 'Features', navDownloads: 'Downloads', navSupport: 'Support', heroHeadline: 'Rule the Seas', heroSubheadline: 'Your adventure starts here.', heroBtnDownload: 'Get App', heroBtnLogs: 'Logs', newsTitle: 'News', newsSub: 'Latest', newsBtnRead: 'Read', showcaseTitle: 'Showcase', showcaseSub: 'Game', featMap: 'Map', featMapDesc: 'Explore', featRank: 'Rank', featRankDesc: 'Compete', featTasks: 'Tasks', featTasksDesc: 'Quests', featChat: 'Chat', featChatDesc: 'Connect', featStore: 'Store', featStoreDesc: 'Trade', featWarehouse: 'Safe', featWarehouseDesc: 'Secure', downloadTitle: 'Download', downloadSub: 'Now', downloadQuickDeploy: 'QR', downloadQuickDeploySub: 'Scan', supportTitle: 'Support', supportSub: 'Contact', supportBtnSend: 'Send', footerDesc: 'Asr Al Hamour', storeAppStore: 'App Store', storeGooglePlay: 'Google Play', storeBadge: 'Official' },
  ar: { navHome: 'الرئيسية', navNews: 'الأخبار', navShowcase: 'المميزات', navDownloads: 'التحميل', navSupport: 'الدعم', heroHeadline: 'سيطر على البحار', heroSubheadline: 'مغامرتك تبدأ من هنا.', heroBtnDownload: 'تحميل', heroBtnLogs: 'السجلات', newsTitle: 'الأخبار', newsSub: 'الأحدث', newsBtnRead: 'اقرأ', showcaseTitle: 'العرض', showcaseSub: 'اللعبة', featMap: 'خريطة', featMapDesc: 'استكشف', featRank: 'ترتيب', featRankDesc: 'نافس', featTasks: 'مهام', featTasksDesc: 'يومية', featChat: 'دردشة', featChatDesc: 'تواصل', featStore: 'متجر', featStoreDesc: 'تاجر', featWarehouse: 'خزنة', featWarehouseDesc: 'أمّن', downloadTitle: 'تحميل', downloadSub: 'الآن', downloadQuickDeploy: 'QR', downloadQuickDeploySub: 'امسح', supportTitle: 'الدعم', supportSub: 'اتصل', supportBtnSend: 'إرسال', footerDesc: 'عصر الهامور', storeAppStore: 'App Store', storeGooglePlay: 'Google Play', storeBadge: 'رسمي' }
};

const DEFAULT_SETTINGS: SiteSettings = {
  logoUrl: 'assets/asr_alhamour_logo_text.png', heroBgUrl: 'assets/island_skull_sunset.png', siteBgColor: '#050505',
  primaryColor: '#10b981', secondaryColor: '#b45309', siteTitle: 'عصر الهامور',
  androidUrl: '#', iosUrl: '#', isMaintenanceMode: false, maintenanceMessage: 'الأسطول في مهمة صيانة سريعة، سنعود قريباً!',
  qrData: '', customQrUrl: '',
  showcaseImages: { map: 'assets/old_map_texture.png', rank: 'assets/swords_crossed.png', tasks: 'assets/scroll_paper.png', chat: 'assets/chat_bubble.png', store: 'assets/fish_market_isometric.png', warehouse: 'assets/house_isometric.png' },
  translations: DEFAULT_TRANSLATIONS,
  socialLinks: {
    showSocials: true, whatsapp: '', whatsappGroup: '', telegram: '', discord: '', instagram: '', twitter: '', youtube: '', facebook: '', tiktok: '', snapchat: '',
    activeLinks: { whatsapp: true, whatsappGroup: true, telegram: true, discord: true, instagram: true, twitter: true, youtube: true, facebook: true, tiktok: true, snapchat: true }
  }
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<'site' | 'admin' | 'login'>('site');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [lang, setLang] = useState<Language>('ar');
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);

  const fetchUserProfile = async (id: string, email: string) => {
    try {
      // محاولة جلب البروفايل، إذا لم يكن موجوداً، لا ننتظره للأبد
      const { data, error } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
      if (data) {
        setUser({ id, email, role: data.role as 'admin' | 'user', display_name: data.display_name, avatar_url: data.avatar_url });
      } else {
        // إذا لم يوجد بروفايل (ربما تأخر التريجر)، نضعه كمستخدم عادي مبدئياً
        setUser({ id, email, role: email.toLowerCase() === 'aaatay3@gmail.com' ? 'admin' : 'user' });
      }
    } catch (e) {
      console.error("Profile fetch error:", e);
      setUser({ id, email, role: 'user' });
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        // 1. جلب الجلسة أولاً
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await fetchUserProfile(session.user.id, session.user.email!);
        }
        
        // 2. جلب بقية البيانات بالتوازي
        // نستخدم catch لكل طلب لمنع تعليق كل العملية إذا فشل جدول واحد
        const fetchSettings = apiService.getSettings().catch(err => { console.warn("Settings fetch failed:", err); return null; });
        const fetchTickets = apiService.getTickets().catch(err => { console.warn("Tickets fetch failed:", err); return []; });
        const fetchNews = apiService.getNews().catch(err => { console.warn("News fetch failed:", err); return []; });

        const [s, t, n] = await Promise.all([fetchSettings, fetchTickets, fetchNews]);
        
        if (s) setSettings({ ...DEFAULT_SETTINGS, ...s });
        if (t) setTickets(t);
        if (n) setNews(n);

      } catch (e) {
        console.error("General Initialization error:", e);
      } finally {
        // نضمن إغلاق شاشة التحميل مهما حدث
        setIsLoading(false);
      }
    };

    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user.id, session.user.email!);
      } else {
        setUser(null);
        if (currentPage === 'admin') setCurrentPage('site');
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    return await supabase.auth.signInWithPassword({ email, password: pass });
  };

  const signup = async (email: string, pass: string) => {
    return await supabase.auth.signUp({ 
      email, 
      password: pass,
      options: { data: { display_name: email.split('@')[0] } }
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('site');
  };

  const navigateTo = (p: any) => {
    if (p === 'admin' && (!user || user.role !== 'admin')) {
       setCurrentPage(user ? 'site' : 'login');
    } else {
       setCurrentPage(p);
    }
    window.scrollTo(0, 0);
  };

  const currentTranslations = useMemo(() => settings.translations[lang] || DEFAULT_TRANSLATIONS[lang], [settings, lang]);

  return (
    <SettingsContext.Provider value={{ 
      settings, tickets, news, isLoading, currentPage, navigateTo,
      user, isAdmin: user?.role === 'admin', lang, setLang, t: currentTranslations,
      login, signup, logout,
      updateSettings: async (ns) => { 
        const updated = { ...settings, ...ns }; 
        setSettings(updated); 
        await apiService.updateSettings(updated); 
      },
      updateUserProfile: async (u) => { 
        if(!user) return; 
        const d = await apiService.updateProfile(user.id, u); 
        setUser(prev => prev ? { ...prev, ...d } : null); 
      },
      getAllUsers: apiService.getAllProfiles,
      updateUserRole: apiService.updateUserRole,
      addTicket: async (tk) => { await apiService.submitTicket(tk); setTickets(await apiService.getTickets()); },
      addNews: async (nw) => { await apiService.addNews(nw); setNews(await apiService.getNews()); },
      deleteNews: async (id) => { await apiService.deleteNews(id); setNews(prev => prev.filter(n => n.id !== id)); },
      deleteTicket: async (id) => { await apiService.deleteTicket(id); setTickets(prev => prev.filter(t => t.id !== id)); }
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const c = useContext(SettingsContext);
  if (!c) throw new Error('useSettings error');
  return c;
};
