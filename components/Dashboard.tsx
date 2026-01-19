
import React, { useState, useRef, useEffect } from 'react';
import { useSettings, SiteSettings } from '../context/SettingsContext';
import { apiService } from '../services/api';
import { UserProfile } from '../types';
import { 
  BarChart3, Newspaper, Mail, Settings, LogOut, 
  Trash2, ShieldCheck, Globe, 
  Upload, Loader2, CheckCircle2, Save,
  Type as TypeIcon, Share2, 
  Plus, X, ArrowLeft, Image as ImageIcon,
  Shield, Power, QrCode, Monitor, Layers, Users, User, Camera,
  Edit3, ExternalLink, Smartphone, Download
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { 
    settings, updateSettings, tickets, news, addNews, deleteNews, deleteTicket, 
    logout, isAdmin, user, updateUserProfile, getAllUsers, updateUserRole, navigateTo, lang
  } = useSettings();
  
  // Added 'inbox' to the activeTab union type to match navigation items
  const [activeTab, setActiveTab] = useState<'stats' | 'news' | 'users' | 'media' | 'system' | 'social' | 'content' | 'inbox'>('stats');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [newNews, setNewNews] = useState({ title: '', excerpt: '', thumbnailUrl: '', category: 'تحديث' });

  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  
  const logoFileRef = useRef<HTMLInputElement>(null);
  const heroBgFileRef = useRef<HTMLInputElement>(null);
  const newsFileRef = useRef<HTMLInputElement>(null);
  const showcaseFileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => { 
    setLocalSettings(settings); 
    if (activeTab === 'users') {
      getAllUsers().then(setUsersList);
    }
  }, [settings, activeTab]);

  const triggerSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldKey: string, isShowcase = false) => {
    if (e.target.files && e.target.files[0]) {
      setIsSaving(true);
      try {
        const url = await apiService.uploadImage(e.target.files[0], isShowcase ? 'showcase' : 'assets');
        if (isShowcase) {
          const updatedShowcase = { ...localSettings.showcaseImages, [fieldKey]: url };
          setLocalSettings(prev => ({ ...prev, showcaseImages: updatedShowcase }));
          await updateSettings({ showcaseImages: updatedShowcase });
        } else if (fieldKey === 'news') {
          setNewNews(prev => ({ ...prev, thumbnailUrl: url }));
        } else {
          setLocalSettings(prev => ({ ...prev, [fieldKey]: url }));
          await updateSettings({ [fieldKey]: url });
        }
        triggerSuccess();
      } catch (err: any) {
        alert("فشل الرفع: " + err.message);
      } finally { setIsSaving(false); }
    }
  };

  const handleAddNews = async () => {
    if (!newNews.title || !newNews.thumbnailUrl) return alert("يرجى ملء العنوان ورفع الصورة");
    setIsSaving(true);
    try {
      await addNews(newNews);
      setShowNewsForm(false);
      setNewNews({ title: '', excerpt: '', thumbnailUrl: '', category: 'تحديث' });
      triggerSuccess();
    } catch (e) { alert("فشل إضافة الخبر"); }
    finally { setIsSaving(false); }
  };

  const handleUpdateTranslation = (langKey: 'ar' | 'en', field: string, value: string) => {
    const updatedTranslations = {
      ...localSettings.translations,
      [langKey]: {
        ...localSettings.translations[langKey],
        [field]: value
      }
    };
    setLocalSettings(prev => ({ ...prev, translations: updatedTranslations }));
  };

  const saveAllContent = async () => {
    setIsSaving(true);
    try {
      await updateSettings(localSettings);
      triggerSuccess();
    } catch (e) {
      alert("فشل الحفظ");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#030303] text-slate-100 h-screen overflow-hidden font-arabic">
      {saveSuccess && <div className="fixed top-6 right-6 z-[200] flex items-center gap-3 bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl animate-fade-in-up"><CheckCircle2 size={20} /><span>تم حفظ التغييرات</span></div>}
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-black border-r border-white/5 flex flex-col p-6 z-[70] transition-transform lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('site')}>
            <ShieldCheck className="text-gold" size={28} />
            <span className="font-display font-black text-xl uppercase text-white">إدارة الأسطول</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-500"><X size={24} /></button>
        </div>
        <nav className="space-y-1 flex-1 overflow-y-auto">
          {[
            { id: 'stats', label: 'الإحصائيات', icon: BarChart3 },
            { id: 'content', label: 'نصوص الموقع', icon: TypeIcon },
            { id: 'news', label: 'الأخبار', icon: Newspaper },
            { id: 'inbox', label: 'الرسائل', icon: Mail },
            { id: 'users', label: 'المستخدمين', icon: Users },
            { id: 'media', label: 'الوسائط والصور', icon: Layers },
            { id: 'social', label: 'التواصل الاجتماعي', icon: Share2 },
            { id: 'system', label: 'إعدادات النظام', icon: Settings },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold uppercase text-[10px] transition-all ${activeTab === t.id ? 'bg-gold text-black shadow-lg shadow-gold/10' : 'text-slate-500 hover:bg-white/5'}`}>
              <t.icon size={18} /> {t.label}
            </button>
          ))}
        </nav>
        <button onClick={logout} className="mt-4 flex items-center gap-4 px-4 py-3 text-red-500 font-bold uppercase text-[10px] w-full hover:bg-red-500/10 rounded-xl"><LogOut size={18} /> تسجيل الخروج</button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#050505]">
        <header className="flex items-center justify-between p-8 border-b border-white/5 bg-black/20 backdrop-blur-md">
           <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 bg-white/5 rounded-lg text-gold"><ArrowLeft size={20} /></button>
           <h1 className="text-xl font-display font-black uppercase text-white tracking-widest">{activeTab}</h1>
           <div className="flex items-center gap-4">
              {isSaving && <Loader2 size={18} className="animate-spin text-gold" />}
              <button onClick={() => navigateTo('site')} className="px-6 py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase border border-white/10 hover:border-gold/50 transition-all flex items-center gap-2"><ExternalLink size={14} /> معاينة الموقع</button>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12 pb-32">
          
          {/* CONTENT TAB: Edit Site Text */}
          {activeTab === 'content' && (
            <div className="space-y-10 max-w-5xl">
              <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/10">
                <div>
                  <h2 className="text-xl font-bold text-white">تعديل نصوص الموقع</h2>
                  <p className="text-xs text-slate-500 mt-1 text-right">قم بتعديل العناوين والنصوص التي تظهر للزوار</p>
                </div>
                <button onClick={saveAllContent} className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-black uppercase text-xs flex items-center gap-2 hover:bg-emerald-600 transition-all">
                  <Save size={16} /> حفظ كافة النصوص
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Arabic Content */}
                <div className="space-y-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
                  <h3 className="font-black text-gold border-b border-white/5 pb-4 flex items-center gap-2"><Globe size={18} /> المحتوى العربي</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase">عنوان الهيرو (Headline)</label>
                      <input type="text" value={localSettings.translations.ar.heroHeadline} onChange={e => handleUpdateTranslation('ar', 'heroHeadline', e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase">وصف الهيرو (Subheadline)</label>
                      <textarea value={localSettings.translations.ar.heroSubheadline} onChange={e => handleUpdateTranslation('ar', 'heroSubheadline', e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm h-24" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase">عنوان قسم الأخبار</label>
                      <input type="text" value={localSettings.translations.ar.newsTitle} onChange={e => handleUpdateTranslation('ar', 'newsTitle', e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm" />
                    </div>
                  </div>
                </div>

                {/* English Content */}
                <div className="space-y-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
                  <h3 className="font-black text-gold border-b border-white/5 pb-4 flex items-center gap-2"><Globe size={18} /> English Content</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase">Hero Headline</label>
                      <input type="text" value={localSettings.translations.en.heroHeadline} onChange={e => handleUpdateTranslation('en', 'heroHeadline', e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase">Hero Subheadline</label>
                      <textarea value={localSettings.translations.en.heroSubheadline} onChange={e => handleUpdateTranslation('en', 'heroSubheadline', e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm h-24" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase">News Title</label>
                      <input type="text" value={localSettings.translations.en.newsTitle} onChange={e => handleUpdateTranslation('en', 'newsTitle', e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STATS TAB */}
          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'الأخبار المنشورة', value: news.length, icon: Newspaper },
                { label: 'الرسائل الواردة', value: tickets.length, icon: Mail },
                { label: 'إجمالي الطاقم', value: usersList.length || '...', icon: Users },
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 p-8 rounded-[2rem] border border-white/10 hover:border-gold/20 transition-all flex items-center justify-between group">
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase font-black mb-2 tracking-widest">{stat.label}</p>
                    <h3 className="text-5xl font-display font-black text-white">{stat.value}</h3>
                  </div>
                  <stat.icon size={48} className="text-gold/20 group-hover:text-gold/40 transition-colors" />
                </div>
              ))}
            </div>
          )}

          {/* MEDIA TAB */}
          {activeTab === 'media' && (
            <div className="space-y-12">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Global Assets */}
                  <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 space-y-8">
                     <h3 className="font-bold flex items-center gap-2 text-gold"><Monitor size={18} /> الهوية البصرية (Storage Assets)</h3>
                     <div className="grid gap-8">
                        <div className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-4">
                           <div className="flex justify-between items-center">
                              <p className="text-xs font-black uppercase text-slate-400">الشعار الرئيسي (Logo)</p>
                              <button onClick={() => logoFileRef.current?.click()} className="text-[10px] bg-gold text-black px-4 py-2 rounded-lg font-black uppercase">تغيير الشعار</button>
                           </div>
                           <div className="h-32 bg-black rounded-2xl flex items-center justify-center p-4 border border-white/5">
                              <img src={localSettings.logoUrl} className="max-h-full max-w-full object-contain" />
                           </div>
                           <input type="file" ref={logoFileRef} className="hidden" onChange={(e) => handleFileUpload(e, 'logoUrl')} />
                        </div>

                        <div className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-4">
                           <div className="flex justify-between items-center">
                              <p className="text-xs font-black uppercase text-slate-400">خلفية الموقع (Hero BG)</p>
                              <button onClick={() => heroBgFileRef.current?.click()} className="text-[10px] bg-gold text-black px-4 py-2 rounded-lg font-black uppercase">تغيير الخلفية</button>
                           </div>
                           <div className="h-40 bg-black rounded-2xl overflow-hidden border border-white/5">
                              <img src={localSettings.heroBgUrl} className="w-full h-full object-cover" />
                           </div>
                           <input type="file" ref={heroBgFileRef} className="hidden" onChange={(e) => handleFileUpload(e, 'heroBgUrl')} />
                        </div>
                     </div>
                  </div>

                  {/* Showcase Assets */}
                  <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 space-y-8">
                     <h3 className="font-bold flex items-center gap-2 text-gold"><Layers size={18} /> لقطات اللعبة (Showcase Storage)</h3>
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {Object.entries(localSettings.showcaseImages).map(([key, url]) => (
                          <div key={key} className="space-y-2 group">
                             <div className="relative aspect-[9/18] bg-black rounded-2xl overflow-hidden border border-white/5 group-hover:border-gold/50 transition-all">
                                <img src={url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100" />
                                <button onClick={() => showcaseFileRefs.current[key]?.click()} className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <Camera size={24} className="text-gold" />
                                </button>
                                <input type="file" ref={el => { showcaseFileRefs.current[key] = el; }} className="hidden" onChange={(e) => handleFileUpload(e, key, true)} />
                             </div>
                             <p className="text-[10px] font-black uppercase text-center text-slate-500">{key}</p>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* NEWS TAB */}
          {activeTab === 'news' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">إدارة الأخبار</h2>
                <button onClick={() => setShowNewsForm(true)} className="bg-gold text-black px-6 py-3 rounded-xl font-black uppercase text-xs flex items-center gap-2"><Plus size={16} /> إضافة خبر جديد</button>
              </div>

              {showNewsForm && (
                <div className="bg-white/5 p-8 rounded-3xl border border-gold/20 animate-fade-in-up space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" placeholder="عنوان الخبر" value={newNews.title} onChange={e => setNewNews({...newNews, title: e.target.value})} className="bg-black border border-white/10 rounded-xl px-4 py-3 text-sm" />
                    <select value={newNews.category} onChange={e => setNewNews({...newNews, category: e.target.value})} className="bg-black border border-white/10 rounded-xl px-4 py-3 text-sm">
                      <option>تحديث</option><option>فعالية</option><option>تنبيه</option>
                    </select>
                  </div>
                  <textarea placeholder="وصف مختصر للخبر..." value={newNews.excerpt} onChange={e => setNewNews({...newNews, excerpt: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 h-24 text-sm"></textarea>
                  <div className="flex items-center gap-4">
                    <button onClick={() => newsFileRef.current?.click()} className="bg-white/10 px-6 py-3 rounded-xl text-xs font-bold uppercase flex items-center gap-2 hover:bg-white/20"><ImageIcon size={16} /> رفع صورة الخبر</button>
                    <input type="file" ref={newsFileRef} className="hidden" onChange={e => handleFileUpload(e, 'news')} />
                    {newNews.thumbnailUrl && <img src={newNews.thumbnailUrl} className="h-16 w-24 object-cover rounded-lg border border-gold shadow-lg" />}
                  </div>
                  <div className="flex justify-end gap-4 border-t border-white/5 pt-6">
                    <button onClick={() => setShowNewsForm(false)} className="px-6 py-3 text-xs font-bold uppercase text-slate-500">إلغاء</button>
                    <button onClick={handleAddNews} className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-black uppercase text-xs hover:bg-emerald-600 transition-all">نشر الخبر الآن</button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map(item => (
                  <div key={item.id} className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 group hover:border-gold/30 transition-all">
                    <div className="relative h-40 overflow-hidden">
                       <img src={item.thumbnailUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                       <button onClick={() => deleteNews(item.id)} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                    </div>
                    <div className="p-6">
                      <div className="text-[10px] text-gold font-bold uppercase mb-2">{item.category}</div>
                      <h4 className="font-bold mb-2 text-white">{item.title}</h4>
                      <p className="text-xs text-slate-500 mb-4 line-clamp-2">{item.excerpt}</p>
                      <div className="text-[9px] text-slate-600 uppercase font-black">{item.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SYSTEM TAB */}
          {activeTab === 'system' && (
            <div className="max-w-4xl space-y-8">
              {/* Links & Meta */}
              <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 space-y-8">
                <h3 className="font-bold text-gold uppercase text-xs flex items-center gap-2"><Smartphone size={16} /> روابط التطبيقات</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase">رابط Android (Google Play)</label>
                    <input type="text" value={localSettings.androidUrl} onChange={e => setLocalSettings({...localSettings, androidUrl: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase">رابط iOS (App Store)</label>
                    <input type="text" value={localSettings.iosUrl} onChange={e => setLocalSettings({...localSettings, iosUrl: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase">اسم الموقع (Site Title)</label>
                    <input type="text" value={localSettings.siteTitle} onChange={e => setLocalSettings({...localSettings, siteTitle: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm" />
                  </div>
                </div>
                <button onClick={saveAllContent} className="bg-gold text-black px-8 py-3 rounded-xl font-black uppercase text-xs">حفظ إعدادات الموقع</button>
              </div>

              {/* Maintenance */}
              <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="font-bold text-red-500 uppercase text-xs flex items-center gap-2"><Power size={16} /> نظام الصيانة</h3>
                   <button onClick={() => updateSettings({ isMaintenanceMode: !settings.isMaintenanceMode })} className={`w-14 h-8 rounded-full p-1 transition-colors ${settings.isMaintenanceMode ? 'bg-red-500' : 'bg-white/10'}`}>
                      <div className={`w-6 h-6 bg-white rounded-full transition-transform ${settings.isMaintenanceMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                   </button>
                </div>
                <p className="text-xs text-slate-500">عند تفعيل وضع الصيانة، سيتم حجب الموقع عن الزوار وظهور رسالة تنبيه.</p>
                <textarea value={localSettings.maintenanceMessage} onChange={e => setLocalSettings({...localSettings, maintenanceMessage: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white h-32 text-sm" placeholder="رسالة الصيانة..."></textarea>
                <button onClick={() => updateSettings({ maintenanceMessage: localSettings.maintenanceMessage })} className="bg-white/10 text-white border border-white/10 px-8 py-3 rounded-xl font-black uppercase text-xs hover:border-white/30">تحديث رسالة الصيانة</button>
              </div>
            </div>
          )}

          {/* INBOX TAB */}
          {activeTab === 'inbox' && (
            <div className="space-y-4">
              {tickets.length === 0 ? <p className="text-center py-20 text-slate-500">صندوق الوارد فارغ</p> : 
                tickets.map(t => (
                  <div key={t.id} className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-gold/30 transition-all flex justify-between items-start group">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="bg-gold/10 text-gold text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest">{t.subject}</span>
                        {/* Corrected property access to t.createdAt to match SupportTicket interface */}
                        <span className="text-[10px] text-slate-500">{new Date(t.createdAt).toLocaleString()}</span>
                      </div>
                      <h4 className="font-bold text-lg text-white">{t.name} <span className="text-slate-500 font-normal text-sm">&lt;{t.email}&gt;</span></h4>
                      <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">{t.message}</p>
                    </div>
                    <button onClick={() => deleteTicket(t.id)} className="text-red-500/40 hover:text-red-500 transition-colors p-2"><Trash2 size={20} /></button>
                  </div>
                ))
              }
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden">
                <table className="w-full text-right text-sm">
                  <thead className="bg-black text-slate-500 uppercase text-[10px] font-black">
                    <tr>
                      <th className="p-6">المستخدم</th>
                      <th className="p-6">البريد</th>
                      <th className="p-6">الرتبة</th>
                      <th className="p-6">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {usersList.map(u => (
                      <tr key={u.id} className="hover:bg-white/5 transition-all">
                        <td className="p-6 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-wood-800 border border-gold/20 flex items-center justify-center overflow-hidden">
                            {u.avatar_url ? <img src={u.avatar_url} className="w-full h-full object-cover" /> : <User size={18} className="text-gold" />}
                          </div>
                          <span className="font-bold text-white">{u.display_name || u.email?.split('@')[0]}</span>
                        </td>
                        <td className="p-6 text-slate-400">{u.email}</td>
                        <td className="p-6">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${u.role === 'admin' ? 'bg-gold text-black' : 'bg-white/10 text-slate-400'}`}>
                            {u.role === 'admin' ? 'مشرف' : 'مستخدم'}
                          </span>
                        </td>
                        <td className="p-6">
                          <button 
                            onClick={() => updateUserRole(u.id, u.role === 'admin' ? 'user' : 'admin').then(() => getAllUsers().then(setUsersList))}
                            className="text-gold hover:text-white text-[10px] font-black uppercase border border-gold/20 px-4 py-2 rounded-lg hover:bg-gold/10 transition-all"
                          >
                            تعديل الصلاحية
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          )}

          {/* SOCIAL TAB */}
          {activeTab === 'social' && (
            <div className="max-w-4xl bg-white/5 p-10 rounded-[2.5rem] border border-white/10 space-y-10">
               <div className="flex justify-between items-center border-b border-white/5 pb-6">
                  <h3 className="font-bold flex items-center gap-2 text-gold"><Share2 size={24} /> روابط التواصل</h3>
                  <button onClick={saveAllContent} className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-black uppercase text-xs">حفظ الروابط</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(localSettings.socialLinks.activeLinks).map(([key, isActive]) => (
                    <div key={key} className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{key}</label>
                        <button onClick={() => {
                          const updated = { ...localSettings.socialLinks.activeLinks, [key]: !isActive };
                          setLocalSettings({ ...localSettings, socialLinks: { ...localSettings.socialLinks, activeLinks: updated as any } });
                        }} className={`w-12 h-6 rounded-full transition-all p-1 ${isActive ? 'bg-emerald-500' : 'bg-white/10'}`}>
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isActive ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                      </div>
                      <input 
                        type="text" 
                        value={(localSettings.socialLinks as any)[key] || ''} 
                        onChange={(e) => {
                          const updated = { ...localSettings.socialLinks, [key]: e.target.value };
                          setLocalSettings({ ...localSettings, socialLinks: updated as any });
                        }}
                        placeholder={`رابط ${key}`}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-gold/30"
                      />
                    </div>
                  ))}
               </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
