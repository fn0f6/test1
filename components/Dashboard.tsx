
import React, { useState, useRef, useEffect } from 'react';
import { useSettings, SiteSettings, Language } from '../context/SettingsContext';
import { apiService } from '../services/api';
import { UserProfile } from '../types';
import { 
  BarChart3, Newspaper, Mail, Settings, LogOut, 
  Trash2, ShieldCheck, Globe, 
  Upload, Loader2, CheckCircle2, Save,
  Type as TypeIcon, Share2, 
  X, ArrowLeft, Image as ImageIcon,
  User, Camera, ExternalLink, MessageCircle, Send, Youtube, Facebook, Music, Ghost, Users, Smartphone, Apple
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
  
  const [newsForm, setNewsForm] = useState({ title: '', excerpt: '', category: 'تحديث', thumbnailUrl: '' });
  const [profileData, setProfileData] = useState({ display_name: user?.display_name || '', avatar_url: user?.avatar_url || '' });
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
          setNewsForm(prev => ({ ...prev, thumbnailUrl: url }));
        } else if (isShowcase) {
          const updatedShowcase = { ...localSettings.showcaseImages, [field]: url };
          setLocalSettings(prev => ({ ...prev, showcaseImages: updatedShowcase }));
          await updateSettings({ showcaseImages: updatedShowcase });
        } else {
          setLocalSettings(prev => ({ ...prev, [field]: url }));
          await updateSettings({ [field]: url });
        }
        triggerSuccess();
      } catch (err: any) {
        alert("فشل الرفع: " + err.message);
      } finally { setIsSaving(false); }
    }
  };

  const handleSaveSocials = async () => {
    setIsSaving(true);
    try {
      await updateSettings({ socialLinks: localSettings.socialLinks });
      triggerSuccess();
    } catch (e) {
      alert("فشل الحفظ");
    } finally { setIsSaving(false); }
  };

  const menuItems = isAdmin ? [
    { id: 'stats', label: 'الإحصائيات', icon: BarChart3 },
    { id: 'content', label: 'محرر النصوص', icon: TypeIcon },
    { id: 'news', label: 'الأخبار', icon: Newspaper },
    { id: 'inbox', label: 'الرسائل', icon: Mail },
    { id: 'users', label: 'الطاقم', icon: Users },
    { id: 'media', label: 'الوسائط', icon: ImageIcon },
    { id: 'social', label: 'التواصل', icon: Share2 },
    { id: 'system', label: 'النظام', icon: Settings },
    { id: 'profile', label: 'ملفي', icon: User },
  ] : [
    { id: 'profile', label: 'ملفي الشخصي', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#030303] text-slate-100 h-screen overflow-hidden font-arabic" dir="rtl">
      {saveSuccess && (
        <div className="fixed top-6 left-6 z-[200] flex items-center gap-3 bg-gold text-black px-6 py-4 rounded-2xl shadow-2xl animate-fade-in font-black uppercase text-[10px]">
          <CheckCircle2 size={16} /> تم الحفظ بنجاح
        </div>
      )}
      
      <aside className={`fixed inset-y-0 right-0 w-72 bg-black border-l border-white/5 flex flex-col p-6 z-[150] transition-transform lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('site')}>
            <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center rotate-12 shadow-lg shadow-gold/20">
              <ShieldCheck className="text-black -rotate-12" size={24} />
            </div>
            <span className="font-display font-black text-xl uppercase text-white tracking-tighter">الأسطول</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-500"><X size={24} /></button>
        </div>

        <nav className="space-y-1 flex-1 overflow-y-auto">
          {menuItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => { setActiveTab(item.id as any); setIsSidebarOpen(false); }} 
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === item.id ? 'bg-gold text-black' : 'text-slate-500 hover:bg-white/5'}`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
        
        <button onClick={logout} className="mt-4 flex items-center gap-4 px-4 py-4 text-red-500 font-black uppercase text-[10px] w-full hover:bg-red-500/10 rounded-2xl">
          <LogOut size={18} /> تسجيل الخروج
        </button>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-[#050505] relative">
        <header className="flex items-center justify-between p-6 border-b border-white/5 bg-black/40 backdrop-blur-xl">
           <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 bg-white/5 rounded-lg"><ArrowLeft size={20} className="rotate-180" /></button>
           <h1 className="text-lg font-black uppercase text-white">{menuItems.find(m => m.id === activeTab)?.label}</h1>
           <div className="flex items-center gap-4">
              {isSaving && <Loader2 size={16} className="animate-spin text-gold" />}
              <button onClick={() => navigateTo('site')} className="px-4 py-2 bg-white/5 rounded-xl text-[9px] font-black uppercase border border-white/10 flex items-center gap-2">
                <ExternalLink size={14} /> المعاينة
              </button>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 pb-32">
          {activeTab === 'profile' && (
            <div className="max-w-xl mx-auto space-y-10">
              <div className="text-center space-y-6">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-wood-900 border-2 border-gold/20 overflow-hidden">
                     {profileData.avatar_url ? <img src={profileData.avatar_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gold/10"><User size={48} /></div>}
                  </div>
                  <button onClick={() => fileRefs.current.avatar?.click()} className="absolute -bottom-2 -right-2 w-10 h-10 bg-gold text-black rounded-xl flex items-center justify-center"><Camera size={18} /></button>
                  <input type="file" ref={el => { fileRefs.current.avatar = el; }} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
                </div>
                <h2 className="text-2xl font-black text-white">{profileData.display_name || 'قبطان'}</h2>
              </div>
              <div className="glass-card p-8 rounded-3xl border-white/5 space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-500">اسم العرض</label>
                  <input type="text" value={profileData.display_name} onChange={e => setProfileData({...profileData, display_name: e.target.value})} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white" />
                </div>
                <button onClick={async () => { setIsSaving(true); try { await updateUserProfile({ display_name: profileData.display_name }); triggerSuccess(); } finally { setIsSaving(false); } }} className="w-full py-4 bg-gold text-black font-black uppercase rounded-xl flex items-center justify-center gap-2">
                  <Save size={18} /> حفظ الملف
                </button>
              </div>
            </div>
          )}

          {activeTab === 'social' && isAdmin && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-white">روابط التواصل</h2>
                <button onClick={handleSaveSocials} className="bg-emerald-500 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2">
                  <Save size={16} /> حفظ الروابط
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {Object.keys(localSettings.socialLinks.activeLinks).map((platform) => (
                  <div key={platform} className="glass-card p-6 rounded-2xl border-white/5 flex items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[9px] font-black uppercase text-gold">{platform}</label>
                        <input 
                          type="checkbox" 
                          checked={(localSettings.socialLinks.activeLinks as any)[platform]} 
                          onChange={(e) => {
                            const newActive = { ...localSettings.socialLinks.activeLinks, [platform]: e.target.checked };
                            setLocalSettings({ ...localSettings, socialLinks: { ...localSettings.socialLinks, activeLinks: newActive } });
                          }}
                        />
                      </div>
                      <input 
                        type="text" 
                        value={(localSettings.socialLinks as any)[platform] || ''} 
                        placeholder={`رابط ${platform}`}
                        onChange={(e) => {
                          const newLinks = { ...localSettings.socialLinks, [platform]: e.target.value };
                          setLocalSettings({ ...localSettings, socialLinks: newLinks });
                        }}
                        className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'system' && isAdmin && (
            <div className="max-w-3xl mx-auto space-y-8">
               <div className="glass-card p-8 rounded-3xl border-white/5 space-y-8">
                  <h3 className="text-lg font-black text-white border-b border-white/5 pb-4">الإعدادات العامة</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                      <div>
                        <p className="text-xs font-black text-white">وضع الصيانة</p>
                        <p className="text-[10px] text-slate-500">إغلاق الموقع للزوار العاديين</p>
                      </div>
                      <button 
                        onClick={() => {
                          const newState = !localSettings.isMaintenanceMode;
                          setLocalSettings({ ...localSettings, isMaintenanceMode: newState });
                          updateSettings({ isMaintenanceMode: newState });
                          triggerSuccess();
                        }}
                        className={`w-14 h-8 rounded-full transition-all relative ${localSettings.isMaintenanceMode ? 'bg-red-500' : 'bg-slate-700'}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${localSettings.isMaintenanceMode ? 'right-7' : 'right-1'}`}></div>
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-500">عنوان الموقع</label>
                      <input type="text" value={localSettings.siteTitle} onChange={e => setLocalSettings({...localSettings, siteTitle: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white text-sm" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-slate-500 flex items-center gap-2"><Smartphone size={12}/> Android URL</label>
                        <input type="text" value={localSettings.androidUrl} onChange={e => setLocalSettings({...localSettings, androidUrl: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white text-xs" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-slate-500 flex items-center gap-2"><Apple size={12}/> iOS URL</label>
                        <input type="text" value={localSettings.iosUrl} onChange={e => setLocalSettings({...localSettings, iosUrl: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white text-xs" />
                      </div>
                    </div>

                    <button onClick={async () => { setIsSaving(true); try { await updateSettings(localSettings); triggerSuccess(); } finally { setIsSaving(false); } }} className="w-full py-4 bg-emerald-500 text-white font-black uppercase rounded-xl flex items-center justify-center gap-2 mt-4">
                      <Save size={18} /> حفظ إعدادات النظام
                    </button>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'stats' && isAdmin && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
              <div className="glass-card p-8 rounded-3xl border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">إجمالي الأخبار</p>
                <p className="text-5xl font-display font-black text-gold">{news.length}</p>
              </div>
              <div className="glass-card p-8 rounded-3xl border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">تذاكر الدعم</p>
                <p className="text-5xl font-display font-black text-emerald-500">{tickets.length}</p>
              </div>
              <div className="glass-card p-8 rounded-3xl border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">حالة الخادم</p>
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <p className="text-emerald-500 font-bold">متصل ومستقر</p>
                </div>
              </div>
            </div>
          )}
          
          {/* محتوى افتراضي لمنع الفراغ في البداية */}
          {activeTab === 'inbox' && isAdmin && (
             <div className="space-y-6">
                {tickets.length === 0 ? (
                  <div className="text-center py-20 text-slate-500">لا توجد رسائل حالياً</div>
                ) : (
                  tickets.map(t => (
                    <div key={t.id} className="glass-card p-6 rounded-2xl border-white/5 flex justify-between items-start">
                       <div className="space-y-1">
                          <p className="font-bold text-white">{t.subject}</p>
                          <p className="text-xs text-slate-500">من: {t.name} ({t.email})</p>
                          <p className="text-sm text-slate-300 mt-4">{t.message}</p>
                       </div>
                       <button onClick={() => deleteTicket(t.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 size={18} /></button>
                    </div>
                  ))
                )}
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
