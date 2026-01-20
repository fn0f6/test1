
import React, { useState, useRef, useEffect } from 'react';
import { useSettings, SiteSettings, Language } from '../context/SettingsContext';
import { apiService } from '../services/api';
import { UserProfile } from '../types';
import { 
  BarChart3, Newspaper, Mail, Settings, LogOut, 
  Trash2, ShieldCheck, Globe, 
  Upload, Loader2, CheckCircle2, Save,
  Type as TypeIcon, Share2, 
  Plus, X, ArrowLeft, Image as ImageIcon,
  Shield, Power, QrCode, Monitor, Layers, Users, User, Camera,
  Edit3, ExternalLink, Smartphone, Download, Lock, Check,
  ChevronRight, Languages
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { 
    settings, updateSettings, tickets, news, addNews, deleteNews, deleteTicket, 
    logout, isAdmin, user, updateUserProfile, getAllUsers, updateUserRole, navigateTo, lang
  } = useSettings();
  
  const [activeTab, setActiveTab] = useState<'stats' | 'news' | 'users' | 'media' | 'system' | 'social' | 'content' | 'inbox' | 'profile'>(isAdmin ? 'stats' : 'profile');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [newsImagePreview, setNewsImagePreview] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    display_name: user?.display_name || '',
    avatar_url: user?.avatar_url || ''
  });

  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  const [editLang, setEditLang] = useState<Language>(lang);
  
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => { 
    setLocalSettings(settings); 
    if (activeTab === 'users' && isAdmin) {
      getAllUsers().then(setUsersList);
    }
  }, [settings, activeTab, isAdmin]);

  const triggerSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, isShowcase = false) => {
    if (e.target.files && e.target.files[0]) {
      setIsSaving(true);
      try {
        const url = await apiService.uploadImage(e.target.files[0], isShowcase ? 'showcase' : 'assets');
        
        if (field === 'avatar') {
          setProfileData(prev => ({ ...prev, avatar_url: url }));
          await updateUserProfile({ avatar_url: url });
        } else if (field === 'news') {
            setNewsImagePreview(url);
        } else if (isShowcase) {
          const updatedShowcase = { ...localSettings.showcaseImages, [field]: url };
          setLocalSettings(prev => ({ ...prev, showcaseImages: updatedShowcase }));
          await updateSettings({ showcaseImages: updatedShowcase });
        } else {
          const updated = { ...localSettings, [field]: url };
          setLocalSettings(updated);
          await updateSettings({ [field]: url });
        }
        triggerSuccess();
      } catch (err: any) {
        alert("Upload error: " + err.message);
      } finally { setIsSaving(false); }
    }
  };

  const saveAllSettings = async () => {
    setIsSaving(true);
    try {
      await updateSettings(localSettings);
      triggerSuccess();
    } catch (e) {
      alert("Save failed");
    } finally { setIsSaving(false); }
  };

  const menuItems = isAdmin ? [
    { id: 'stats', label: 'الإحصائيات', icon: BarChart3 },
    { id: 'content', label: 'محرر النصوص', icon: TypeIcon },
    { id: 'news', label: 'الأخبار', icon: Newspaper },
    { id: 'inbox', label: 'الرسائل', icon: Mail },
    { id: 'users', label: 'الطاقم', icon: Users },
    { id: 'media', label: 'الوسائط', icon: Layers },
    { id: 'social', label: 'التواصل', icon: Share2 },
    { id: 'system', label: 'النظام', icon: Settings },
    { id: 'profile', label: 'ملفي', icon: User },
  ] : [
    { id: 'profile', label: 'ملفي الشخصي', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#030303] text-slate-100 h-screen overflow-hidden font-arabic" dir="rtl">
      {saveSuccess && (
        <div className="fixed top-6 left-6 z-[200] flex items-center gap-3 bg-gold text-black px-6 py-4 rounded-2xl shadow-2xl animate-fade-in-up font-black uppercase text-xs">
          <CheckCircle2 size={18} />
          <span>تم الحفظ بنجاح</span>
        </div>
      )}
      
      <aside className={`fixed inset-y-0 right-0 w-72 bg-black border-l border-white/5 flex flex-col p-6 z-[150] transition-transform lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigateTo('site')}>
            <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform shadow-[0_0_20px_rgba(255,215,0,0.3)]">
              <ShieldCheck className="text-black -rotate-12 group-hover:rotate-0 transition-transform" size={24} />
            </div>
            <span className="font-display font-black text-xl uppercase text-white tracking-tighter">
              {isAdmin ? 'إدارة الأسطول' : 'مقصورة القبطان'}
            </span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-500"><X size={24} /></button>
        </div>

        <nav className="space-y-1 flex-1 overflow-y-auto custom-scrollbar">
          {menuItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => { setActiveTab(item.id as any); setIsSidebarOpen(false); }} 
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === item.id ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
            >
              <div className="flex items-center gap-4">
                <item.icon size={18} />
                {item.label}
              </div>
            </button>
          ))}
        </nav>
        
        <button onClick={logout} className="mt-4 flex items-center gap-4 px-4 py-4 text-red-500 font-black uppercase text-[10px] tracking-widest w-full hover:bg-red-500/10 rounded-2xl transition-colors">
          <LogOut size={18} /> هجر السفينة
        </button>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-[#050505] relative">
        <header className="flex items-center justify-between p-6 md:p-8 border-b border-white/5 bg-black/40 backdrop-blur-xl z-50">
           <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-white/5 rounded-xl text-gold border border-white/10"><ArrowLeft size={20} className="rotate-180" /></button>
           <h1 className="text-xl font-display font-black uppercase text-white tracking-widest hidden md:block">
              {menuItems.find(m => m.id === activeTab)?.label}
           </h1>
           <div className="flex items-center gap-4">
              {isSaving && <Loader2 size={16} className="animate-spin text-gold" />}
              <button onClick={() => navigateTo('site')} className="px-6 py-2.5 bg-white/5 rounded-xl text-[10px] font-black uppercase border border-white/10 hover:border-gold/50 transition-all flex items-center gap-2">
                <ExternalLink size={14} /> معاينة الموقع
              </button>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-12 pb-32 custom-scrollbar">
          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto space-y-12 animate-fade-in">
              <div className="text-center">
                <div className="relative inline-block group">
                  <div className="w-32 h-32 md:w-48 md:h-48 rounded-[3rem] bg-wood-900 border-2 border-gold/20 overflow-hidden shadow-2xl">
                     {profileData.avatar_url ? <img src={profileData.avatar_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gold/10"><User size={80} /></div>}
                  </div>
                  <button onClick={() => fileRefs.current.avatar?.click()} className="absolute -bottom-2 -right-2 w-14 h-14 bg-gold text-black rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 transition-all"><Camera size={22} /></button>
                  <input type="file" ref={el => { fileRefs.current.avatar = el; }} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
                </div>
                <h2 className="text-3xl font-display font-black text-white mt-8 uppercase">{profileData.display_name || 'قبطان مجهول'}</h2>
              </div>

              <div className="glass-card p-10 rounded-[3.5rem] border-white/5 space-y-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 block mr-1">اسم العرض</label>
                  <input type="text" value={profileData.display_name} onChange={e => setProfileData({...profileData, display_name: e.target.value})} className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-5 text-white font-bold text-lg" />
                </div>
                <button onClick={async () => { setIsSaving(true); try { await updateUserProfile({ display_name: profileData.display_name }); triggerSuccess(); } finally { setIsSaving(false); } }} className="w-full h-16 bg-gold text-black font-black uppercase rounded-2xl shadow-xl flex items-center justify-center gap-3">
                  <Save size={20} /> حفظ التغييرات
                </button>
              </div>
            </div>
          )}

          {activeTab === 'content' && isAdmin && (
            <div className="space-y-10 animate-fade-in">
              <div className="flex justify-between items-center bg-black/40 p-8 rounded-[2.5rem] border border-white/5">
                <div className="flex bg-black/60 p-1 rounded-xl">
                  <button onClick={() => setEditLang('ar')} className={`px-4 py-2 rounded-lg text-[9px] font-black transition-all ${editLang === 'ar' ? 'bg-gold text-black' : 'text-slate-500'}`}>العربية</button>
                  <button onClick={() => setEditLang('en')} className={`px-4 py-2 rounded-lg text-[9px] font-black transition-all ${editLang === 'en' ? 'bg-gold text-black' : 'text-slate-500'}`}>English</button>
                </div>
                <button onClick={saveAllSettings} className="bg-emerald-500 text-white px-8 h-12 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                  <Save size={16} /> حفظ الكل
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {Object.keys(localSettings.translations[editLang] || {}).map((key) => (
                  <div key={key} className="glass-card p-6 rounded-3xl border-white/5 space-y-2">
                    <label className="text-[9px] font-black uppercase text-gold/60">{key}</label>
                    <textarea 
                      value={(localSettings.translations[editLang] as any)[key]} 
                      onChange={(e) => {
                        const newTrans = { ...localSettings.translations };
                        newTrans[editLang] = { ...newTrans[editLang], [key]: e.target.value };
                        setLocalSettings({ ...localSettings, translations: newTrans });
                      }}
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-sm text-slate-200 outline-none h-24"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* بقية التبويبات الأخرى يتم ربطها بنفس النمط... */}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
