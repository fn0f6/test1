
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

  useEffect(() => {
    if (user) {
      setProfileData({
        display_name: user.display_name || '',
        avatar_url: user.avatar_url || ''
      });
    }
  }, [user]);

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

  const handleUpdateProfile = async () => {
    setIsSaving(true);
    try {
      await updateUserProfile({ display_name: profileData.display_name });
      triggerSuccess();
    } catch (e) {
      alert("فشل تحديث البيانات");
    } finally { setIsSaving(false); }
  };

  const saveAllSettings = async () => {
    setIsSaving(true);
    try {
      await updateSettings(localSettings);
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
          <span>تم تحديث الأسطول بنجاح</span>
        </div>
      )}
      
      {/* Sidebar */}
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

        <div className="mb-8 p-4 bg-white/5 rounded-3xl border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-wood-800 border border-gold/20 flex items-center justify-center shrink-0">
             {user?.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" /> : <User size={20} className="text-gold" />}
          </div>
          <div className="overflow-hidden">
             <p className="text-xs font-black text-white truncate">{user?.display_name || user?.email?.split('@')[0]}</p>
             <p className="text-[9px] text-gold/60 font-black uppercase tracking-widest">{isAdmin ? 'أميرال' : 'عضو طاقم'}</p>
          </div>
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
              {activeTab === item.id && <ChevronRight size={14} className="rotate-180" />}
            </button>
          ))}
        </nav>
        
        <button onClick={logout} className="mt-4 flex items-center gap-4 px-4 py-4 text-red-500 font-black uppercase text-[10px] tracking-widest w-full hover:bg-red-500/10 rounded-2xl transition-colors border border-transparent hover:border-red-500/20">
          <LogOut size={18} /> هجر السفينة
        </button>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#050505] relative">
        <header className="flex items-center justify-between p-6 md:p-8 border-b border-white/5 bg-black/40 backdrop-blur-xl z-50">
           <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-white/5 rounded-xl text-gold border border-white/10"><ArrowLeft size={20} className="rotate-180" /></button>
           
           <div className="hidden md:block">
              <h1 className="text-xl font-display font-black uppercase text-white tracking-widest">
                {menuItems.find(m => m.id === activeTab)?.label}
              </h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-1">مركز العمليات المركزية</p>
           </div>

           <div className="flex items-center gap-4">
              {isSaving && <div className="flex items-center gap-2 px-3 py-1.5 bg-gold/10 rounded-full border border-gold/20 animate-pulse"><Loader2 size={14} className="animate-spin text-gold" /><span className="text-[9px] font-black text-gold">جاري المزامنة...</span></div>}
              <button onClick={() => navigateTo('site')} className="px-6 py-2.5 bg-white/5 rounded-xl text-[10px] font-black uppercase border border-white/10 hover:border-gold/50 hover:bg-gold/5 transition-all flex items-center gap-2">
                <ExternalLink size={14} /> معاينة الموقع
              </button>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-12 pb-32 custom-scrollbar">
          
          {/* STATS TAB */}
          {activeTab === 'stats' && isAdmin && (
            <div className="space-y-12 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'الأخبار', value: news.length, icon: Newspaper, color: 'text-blue-500' },
                  { label: 'الرسائل', value: tickets.length, icon: Mail, color: 'text-emerald-500' },
                  { label: 'الطاقم', value: usersList.length || '...', icon: Users, color: 'text-gold' },
                  { label: 'الرتبة العليا', value: 'أدمين', icon: Shield, color: 'text-red-500' },
                ].map((stat, i) => (
                  <div key={i} className="glass-card p-8 rounded-[2.5rem] border-white/5 hover:border-white/10 transition-all group relative overflow-hidden">
                    <div className="relative z-10 flex flex-col gap-4">
                      <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                        <stat.icon size={24} />
                      </div>
                      <div>
                        <p className="text-slate-500 text-[10px] uppercase font-black mb-1 tracking-widest">{stat.label}</p>
                        <h3 className="text-4xl font-display font-black text-white tracking-tighter">{stat.value}</h3>
                      </div>
                    </div>
                    <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity ${stat.color}`}>
                       <stat.icon size={120} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div className="glass-card p-8 rounded-[3rem] border-white/5">
                   <h3 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-3"><Mail className="text-gold" size={20} /> آخر الرسائل</h3>
                   <div className="space-y-4">
                      {tickets.slice(0, 4).map(t => (
                        <div key={t.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center hover:bg-white/10 transition-colors">
                           <div>
                              <p className="text-xs font-black text-white">{t.subject}</p>
                              <p className="text-[10px] text-slate-500">{t.name} • {new Date(t.createdAt).toLocaleDateString('ar-EG')}</p>
                           </div>
                           <ChevronRight size={16} className="text-slate-700 rotate-180" />
                        </div>
                      ))}
                   </div>
                </div>
                <div className="glass-card p-8 rounded-[3rem] border-white/5">
                   <h3 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-3"><Newspaper className="text-gold" size={20} /> أحدث الأخبار</h3>
                   <div className="space-y-4">
                      {news.slice(0, 4).map(n => (
                        <div key={n.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex gap-4 items-center">
                           <div className="w-12 h-12 rounded-xl bg-black overflow-hidden shrink-0 border border-white/10">
                              <img src={n.thumbnailUrl} className="w-full h-full object-cover" />
                           </div>
                           <div className="overflow-hidden">
                              <p className="text-xs font-black text-white truncate">{n.title}</p>
                              <p className="text-[10px] text-gold/60">{n.category}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto space-y-12 animate-fade-in">
              <div className="text-center relative">
                <div className="relative inline-block group">
                  <div className="w-32 h-32 md:w-48 md:h-48 rounded-[3rem] bg-wood-900 border-2 border-gold/20 overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] transition-transform group-hover:scale-105 group-hover:rotate-2">
                     {profileData.avatar_url ? (
                       <img src={profileData.avatar_url} className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-gold/10"><User size={80} /></div>
                     )}
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => fileRefs.current.avatar?.click()}>
                        <Camera className="text-white" size={32} />
                     </div>
                  </div>
                  <button 
                    onClick={() => fileRefs.current.avatar?.click()}
                    className="absolute -bottom-2 -right-2 w-14 h-14 bg-gold text-black rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-20"
                  >
                    <Upload size={22} />
                  </button>
                  {/* Fixed Ref Callback */}
                  <input type="file" ref={el => { fileRefs.current.avatar = el; }} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
                </div>
                <h2 className="text-3xl font-display font-black text-white mt-8 uppercase tracking-tight">{profileData.display_name || 'قبطان مجهول'}</h2>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 rounded-full border border-gold/20 text-gold text-[10px] font-black uppercase tracking-widest mt-3">
                  {isAdmin ? <Shield size={12} /> : <User size={12} />}
                  {isAdmin ? 'أميرال الأسطول' : 'بحار في الطاقم'}
                </div>
              </div>

              <div className="glass-card p-10 md:p-14 rounded-[3.5rem] border-white/5 space-y-10">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 block mr-1">اسم العرض (سيظهر للجميع)</label>
                    <div className="relative">
                      <Edit3 className="absolute right-5 top-1/2 -translate-y-1/2 text-gold/40" size={20} />
                      <input 
                        type="text" 
                        value={profileData.display_name}
                        onChange={e => setProfileData({...profileData, display_name: e.target.value})}
                        className="w-full bg-black/60 border border-white/10 rounded-2xl pr-14 pl-6 py-5 outline-none focus:border-gold/50 transition-all text-white font-bold text-lg"
                        placeholder="أدخل اسمك هنا..."
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 block mr-1">البريد الإلكتروني (محمي)</label>
                    <div className="relative">
                      <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-700" size={20} />
                      <input 
                        type="email" 
                        value={user?.email || ''}
                        disabled
                        className="w-full bg-black/20 border border-white/5 rounded-2xl pr-14 pl-6 py-5 text-slate-500 cursor-not-allowed italic font-medium"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleUpdateProfile}
                  disabled={isSaving}
                  className="w-full h-16 bg-gold text-black font-black uppercase tracking-[0.3em] text-xs rounded-2xl shadow-xl shadow-gold/10 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> تثبيت البيانات</>}
                </button>
              </div>
            </div>
          )}

          {/* CONTENT (TRANSLATIONS) TAB */}
          {activeTab === 'content' && isAdmin && (
            <div className="space-y-10 animate-fade-in">
               <div className="flex flex-col md:flex-row justify-between items-center bg-black/40 p-8 rounded-[2.5rem] border border-white/5 gap-6">
                  <div>
                    <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">محرر نصوص الموقع</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">تحكم في كل كلمة تظهر للمستخدم</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex bg-black/60 p-1 rounded-xl border border-white/10">
                       <button onClick={() => setEditLang('ar')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${editLang === 'ar' ? 'bg-gold text-black' : 'text-slate-500'}`}>العربية</button>
                       <button onClick={() => setEditLang('en')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${editLang === 'en' ? 'bg-gold text-black' : 'text-slate-500'}`}>English</button>
                    </div>
                    <button onClick={saveAllSettings} className="bg-emerald-500 text-white px-8 h-12 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/10">
                       <Save size={16} /> حفظ الكل
                    </button>
                  </div>
               </div>

               <div className="grid md:grid-cols-2 gap-8">
                  {Object.keys(localSettings.translations[editLang] || {}).map((key) => (
                    <div key={key} className="glass-card p-6 rounded-3xl border-white/5 space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-widest text-gold/60 mr-1">{key}</label>
                       <textarea 
                         value={(localSettings.translations[editLang] as any)[key]}
                         onChange={(e) => {
                            const newTrans = { ...localSettings.translations };
                            newTrans[editLang] = { ...newTrans[editLang], [key]: e.target.value };
                            setLocalSettings({ ...localSettings, translations: newTrans });
                         }}
                         className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-sm text-slate-200 outline-none focus:border-gold/30 transition-all resize-none min-h-[80px]"
                       />
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* NEWS TAB */}
          {activeTab === 'news' && isAdmin && (
            <div className="space-y-10 animate-fade-in">
               <div className="flex justify-between items-center bg-black/40 p-8 rounded-[2.5rem] border border-white/5">
                  <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">إدارة الأخبار</h2>
                  <button className="bg-gold text-black px-8 h-12 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2" onClick={() => alert("استخدم نموذج 'إضافة خبر جديد' بالأسفل")}>
                     <Plus size={16} /> خبر جديد
                  </button>
               </div>

               <div className="glass-card p-10 rounded-[3rem] border-white/5">
                  <h3 className="text-lg font-black uppercase tracking-widest mb-8 text-gold border-b border-gold/10 pb-4">إضافة خبر جديد للأسطول</h3>
                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                     <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase">عنوان الخبر</label>
                           <input id="news-title" type="text" className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-gold/50" placeholder="عاصفة قادمة..." />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase">التصنيف</label>
                           <input id="news-cat" type="text" className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-gold/50" placeholder="تحديث، معركة، استكشاف..." />
                        </div>
                     </div>
                     <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase">صورة الخبر</label>
                           <div className="flex gap-4">
                              <button onClick={() => fileRefs.current.news?.click()} className="flex-1 h-14 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2 text-slate-500 hover:text-gold hover:border-gold/50 transition-all">
                                 <ImageIcon size={20} /> رفع صورة
                              </button>
                              {/* Fixed Ref Callback */}
                              <input type="file" ref={el => { fileRefs.current.news = el; }} className="hidden" accept="image/*" />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase">محتوى الخبر المختصر</label>
                           <textarea id="news-excerpt" className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-gold/50 resize-none h-14" />
                        </div>
                     </div>
                  </div>
                  <button onClick={async () => {
                      const title = (document.getElementById('news-title') as HTMLInputElement).value;
                      const excerpt = (document.getElementById('news-excerpt') as HTMLTextAreaElement).value;
                      const category = (document.getElementById('news-cat') as HTMLInputElement).value;
                      if (!title) return alert("العنوان مطلوب");
                      setIsSaving(true);
                      try {
                        const file = fileRefs.current.news?.files?.[0];
                        let thumb = 'https://images.unsplash.com/photo-1596529896791-537449298538';
                        if (file) thumb = await apiService.uploadImage(file, 'assets');
                        await addNews({ title, excerpt, category, thumbnailUrl: thumb });
                        triggerSuccess();
                        (document.getElementById('news-title') as HTMLInputElement).value = '';
                        (document.getElementById('news-excerpt') as HTMLTextAreaElement).value = '';
                      } catch (e) { alert("فشل الحفظ"); } finally { setIsSaving(false); }
                  }} className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-xs tracking-[0.4em] hover:bg-gold hover:text-black transition-all">
                      إرسال الخبر للأفق
                  </button>
               </div>

               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                  {news.map(n => (
                    <div key={n.id} className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden group">
                       <div className="h-40 overflow-hidden relative">
                          <img src={n.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          <button onClick={() => deleteNews(n.id)} className="absolute top-4 right-4 w-10 h-10 bg-red-500/20 backdrop-blur-md border border-red-500/40 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                       </div>
                       <div className="p-6">
                          <div className="text-[9px] font-black text-gold/60 uppercase tracking-widest mb-2">{n.category}</div>
                          <h4 className="text-sm font-black text-white line-clamp-1">{n.title}</h4>
                          <p className="text-[10px] text-slate-500 mt-2 line-clamp-2">{n.excerpt}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && isAdmin && (
            <div className="space-y-10 animate-fade-in">
               <div className="bg-black/40 p-8 rounded-[2.5rem] border border-white/5">
                  <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">إدارة الطاقم</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">تعديل رتب وصلاحيات المستخدمين</p>
               </div>

               <div className="glass-card rounded-[3rem] border-white/5 overflow-hidden">
                  <table className="w-full text-right">
                     <thead>
                        <tr className="bg-white/5 border-b border-white/5">
                           <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">المستخدم</th>
                           <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">البريد</th>
                           <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">الرتبة</th>
                           <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">التسجيل</th>
                           <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">إجراء</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {usersList.map(u => (
                          <tr key={u.id} className="hover:bg-white/5 transition-colors">
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 rounded-xl bg-wood-800 border border-gold/10 overflow-hidden flex items-center justify-center">
                                      {u.avatar_url ? <img src={u.avatar_url} className="w-full h-full object-cover" /> : <User size={16} className="text-gold/40" />}
                                   </div>
                                   <span className="text-xs font-black text-white">{u.display_name || 'قبطان جديد'}</span>
                                </div>
                             </td>
                             <td className="px-8 py-6 text-[10px] text-slate-500 font-medium">{u.email}</td>
                             <td className="px-8 py-6">
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                                   {u.role === 'admin' ? <Shield size={10} /> : <User size={10} />}
                                   {u.role === 'admin' ? 'أدمين' : 'عضو'}
                                </div>
                             </td>
                             <td className="px-8 py-6 text-[10px] text-slate-500">منذ زمن بعيد</td>
                             <td className="px-8 py-6">
                                <button 
                                  onClick={async () => {
                                    if(u.email === 'aaatay3@gmail.com') return alert("لا يمكنك تغيير رتبة الأدمين الرئيسي");
                                    const newRole = u.role === 'admin' ? 'user' : 'admin';
                                    await updateUserRole(u.id, newRole);
                                    setUsersList(prev => prev.map(usr => usr.id === u.id ? { ...usr, role: newRole as any } : usr));
                                    triggerSuccess();
                                  }}
                                  className="text-[9px] font-black uppercase text-gold hover:underline"
                                >
                                   تغيير الرتبة
                                </button>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {/* MEDIA TAB */}
          {activeTab === 'media' && isAdmin && (
            <div className="space-y-12 animate-fade-in">
               <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h3 className="text-lg font-black uppercase tracking-widest text-gold flex items-center gap-3"><Monitor size={20} /> هويّة الموقع الرئيسية</h3>
                    <div className="grid gap-6">
                       <div className="glass-card p-6 rounded-[2.5rem] border-white/5">
                          <p className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">شعار الموقع (Logo)</p>
                          <div className="flex items-center gap-6">
                             <div className="w-24 h-24 bg-black rounded-3xl border border-white/10 p-4 flex items-center justify-center">
                                <img src={localSettings.logoUrl} className="max-w-full max-h-full object-contain" />
                             </div>
                             <button onClick={() => fileRefs.current.logo?.click()} className="flex-1 h-14 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:border-gold/50 transition-all flex items-center justify-center gap-3">
                                <Upload size={16} /> تغيير الشعار
                             </button>
                             {/* Fixed Ref Callback */}
                             <input type="file" ref={el => { fileRefs.current.logo = el; }} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'logoUrl')} />
                          </div>
                       </div>
                       <div className="glass-card p-6 rounded-[2.5rem] border-white/5">
                          <p className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">خلفية الموقع الرئيسية (Hero)</p>
                          <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 group">
                             <img src={localSettings.heroBgUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => fileRefs.current.heroBg?.click()} className="bg-gold text-black px-6 py-3 rounded-xl font-black uppercase text-[10px] flex items-center gap-2">
                                   <ImageIcon size={16} /> تغيير الخلفية
                                </button>
                             </div>
                          </div>
                          {/* Fixed Ref Callback */}
                          <input type="file" ref={el => { fileRefs.current.heroBg = el; }} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'heroBgUrl')} />
                       </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-black uppercase tracking-widest text-gold flex items-center gap-3"><Layers size={20} /> صور قسم المميزات (Showcase)</h3>
                    <div className="grid grid-cols-2 gap-4">
                       {Object.keys(localSettings.showcaseImages).map((key) => (
                         <div key={key} className="glass-card p-4 rounded-3xl border-white/5 text-center space-y-3">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{key}</p>
                            <div className="aspect-[9/16] rounded-2xl bg-black overflow-hidden border border-white/10 relative group">
                               <img src={(localSettings.showcaseImages as any)[key]} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                               <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => fileRefs.current[key]?.click()} className="p-3 bg-gold text-black rounded-xl"><Upload size={16} /></button>
                               </div>
                            </div>
                            {/* Fixed Ref Callback */}
                            <input type="file" ref={el => { fileRefs.current[key] = el; }} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, key, true)} />
                         </div>
                       ))}
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* SOCIAL & SYSTEM TABS */}
          {activeTab === 'social' && isAdmin && (
            <div className="max-w-3xl mx-auto space-y-10 animate-fade-in">
               <div className="bg-black/40 p-8 rounded-[2.5rem] border border-white/5">
                  <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">روابط التواصل</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">إدارة منصات التواجد الاجتماعي للأسطول</p>
               </div>
               
               <div className="glass-card p-10 rounded-[3rem] border-white/5 space-y-8">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 mb-8">
                     <span className="text-xs font-black uppercase text-white tracking-widest">تفعيل قسم التواصل في التذييل</span>
                     <button 
                        onClick={() => setLocalSettings({...localSettings, socialLinks: {...localSettings.socialLinks, showSocials: !localSettings.socialLinks.showSocials}})}
                        className={`w-14 h-8 rounded-full relative transition-all ${localSettings.socialLinks.showSocials ? 'bg-gold' : 'bg-white/10'}`}
                     >
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${localSettings.socialLinks.showSocials ? 'right-7' : 'right-1'}`}></div>
                     </button>
                  </div>

                  <div className="grid gap-6">
                    {Object.keys(localSettings.socialLinks.activeLinks).map(key => (
                      <div key={key} className="flex items-center gap-4">
                        <button 
                          onClick={() => {
                            const newActive = { ...localSettings.socialLinks.activeLinks, [key]: !(localSettings.socialLinks.activeLinks as any)[key] };
                            setLocalSettings({...localSettings, socialLinks: {...localSettings.socialLinks, activeLinks: newActive}});
                          }}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${ (localSettings.socialLinks.activeLinks as any)[key] ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'bg-white/5 text-slate-500 border border-white/10'}`}
                        >
                          <Check size={16} />
                        </button>
                        <div className="flex-1 relative">
                          <input 
                            type="text" 
                            value={(localSettings.socialLinks as any)[key]}
                            onChange={(e) => setLocalSettings({...localSettings, socialLinks: {...localSettings.socialLinks, [key]: e.target.value}})}
                            placeholder={`رابط ${key}...`}
                            className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-gold/40"
                          />
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase text-slate-600 tracking-widest">{key}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button onClick={saveAllSettings} className="w-full h-16 bg-gold text-black font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl mt-6">
                    تحديث كافة الروابط
                  </button>
               </div>
            </div>
          )}

          {activeTab === 'system' && isAdmin && (
            <div className="max-w-3xl mx-auto space-y-10 animate-fade-in">
               <div className="bg-black/40 p-8 rounded-[2.5rem] border border-white/5">
                  <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">إعدادات النظام</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">إدارة حالة الموقع والأمان</p>
               </div>

               <div className="glass-card p-10 rounded-[3rem] border-white/5 space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-red-500/5 rounded-[2rem] border border-red-500/10">
                       <div>
                          <h4 className="text-white font-black uppercase text-xs tracking-widest mb-1 flex items-center gap-2"><Power size={14} className="text-red-500" /> وضع الصيانة</h4>
                          <p className="text-[10px] text-slate-500">منع المستخدمين من تصفح الموقع حالياً</p>
                       </div>
                       <button 
                        onClick={() => setLocalSettings({...localSettings, isMaintenanceMode: !localSettings.isMaintenanceMode})}
                        className={`w-14 h-8 rounded-full relative transition-all ${localSettings.isMaintenanceMode ? 'bg-red-500' : 'bg-white/10'}`}
                       >
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${localSettings.isMaintenanceMode ? 'right-7' : 'right-1'}`}></div>
                       </button>
                    </div>

                    {localSettings.isMaintenanceMode && (
                      <div className="space-y-2 animate-fade-in">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mr-1">رسالة الصيانة</label>
                        <textarea 
                          value={localSettings.maintenanceMessage}
                          onChange={(e) => setLocalSettings({...localSettings, maintenanceMessage: e.target.value})}
                          className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-red-500/30 transition-all resize-none h-32"
                          placeholder="اكتب رسالة للمستخدمين هنا..."
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-6 border-t border-white/5 pt-8">
                    <h4 className="text-white font-black uppercase text-xs tracking-widest flex items-center gap-2"><Smartphone size={14} className="text-gold" /> روابط التحميل</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase">رابط Android (APK)</label>
                          <input 
                            type="text" 
                            value={localSettings.androidUrl}
                            onChange={(e) => setLocalSettings({...localSettings, androidUrl: e.target.value})}
                            className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-4 text-xs text-white outline-none focus:border-gold/40"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase">رابط iOS (App Store)</label>
                          <input 
                            type="text" 
                            value={localSettings.iosUrl}
                            onChange={(e) => setLocalSettings({...localSettings, iosUrl: e.target.value})}
                            className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-4 text-xs text-white outline-none focus:border-gold/40"
                          />
                       </div>
                    </div>
                  </div>

                  <div className="space-y-6 border-t border-white/5 pt-8">
                    <h4 className="text-white font-black uppercase text-xs tracking-widest flex items-center gap-2"><QrCode size={14} className="text-gold" /> إعدادات الـ QR</h4>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase">بيانات الـ QR (اترك فارغاً لاستخدام رابط الموقع)</label>
                       <input 
                        type="text" 
                        value={localSettings.qrData}
                        onChange={(e) => setLocalSettings({...localSettings, qrData: e.target.value})}
                        className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-4 text-xs text-white outline-none focus:border-gold/40"
                       />
                    </div>
                  </div>

                  <button onClick={saveAllSettings} className="w-full h-16 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                    <Save size={18} /> حفظ إعدادات النظام
                  </button>
               </div>
            </div>
          )}

          {/* INBOX TAB */}
          {activeTab === 'inbox' && isAdmin && (
            <div className="space-y-10 animate-fade-in">
               <div className="bg-black/40 p-8 rounded-[2.5rem] border border-white/5">
                  <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">صندوق الرسائل</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">رسائل الدعم والشكاوى من المستخدمين</p>
               </div>

               <div className="grid gap-6">
                  {tickets.length === 0 ? (
                    <div className="py-20 text-center glass-card rounded-[3rem] border-white/5">
                       <p className="text-slate-500 font-black uppercase tracking-widest text-sm">البحر هادئ.. لا رسائل حالياً</p>
                    </div>
                  ) : (
                    tickets.map(t => (
                      <div key={t.id} className="glass-card p-8 rounded-[2.5rem] border-white/5 flex flex-col md:flex-row gap-6 relative group overflow-hidden">
                         <div className="w-14 h-14 rounded-2xl bg-gold/5 border border-gold/10 flex items-center justify-center shrink-0">
                            <Mail className="text-gold" size={24} />
                         </div>
                         <div className="flex-1 space-y-3">
                            <div className="flex justify-between items-start">
                               <div>
                                  <h4 className="text-white font-black uppercase text-sm">{t.subject}</h4>
                                  <p className="text-[10px] text-gold/60 font-bold uppercase tracking-widest">{t.name} • {t.email}</p>
                               </div>
                               <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{new Date(t.createdAt).toLocaleDateString('ar-EG')}</span>
                            </div>
                            <p className="text-slate-400 text-xs leading-relaxed border-t border-white/5 pt-4 italic">"{t.message}"</p>
                         </div>
                         <div className="flex items-center gap-3">
                            <button onClick={() => window.location.href = `mailto:${t.email}`} className="px-6 py-2.5 bg-white/5 rounded-xl text-[10px] font-black uppercase text-white hover:bg-gold hover:text-black transition-all">الرد</button>
                            <button onClick={() => deleteTicket(t.id)} className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                         </div>
                         <div className="absolute right-0 top-0 w-1 h-full bg-gold/20 group-hover:bg-gold transition-colors"></div>
                      </div>
                    ))
                  )}
               </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
