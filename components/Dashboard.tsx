
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
  Edit3, ExternalLink
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { 
    settings, updateSettings, tickets, news, addNews, deleteNews, deleteTicket, 
    logout, isAdmin, user, updateUserProfile, getAllUsers, updateUserRole, navigateTo 
  } = useSettings();
  
  const [activeTab, setActiveTab] = useState<'stats' | 'news' | 'users' | 'media' | 'system' | 'social' | 'inbox'>('stats');
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
          const updated = { ...localSettings.showcaseImages, [fieldKey]: url };
          setLocalSettings(prev => ({ ...prev, showcaseImages: updated }));
          await updateSettings({ showcaseImages: updated });
        } else if (fieldKey === 'news') {
          setNewNews(prev => ({ ...prev, thumbnailUrl: url }));
        } else {
          setLocalSettings(prev => ({ ...prev, [fieldKey]: url }));
          await updateSettings({ [fieldKey]: url });
        }
        triggerSuccess();
      } catch (err: any) {
        alert(err.message);
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

  const handleToggleLink = (key: string) => {
    const updated = {
      ...localSettings.socialLinks,
      activeLinks: {
        ...localSettings.socialLinks.activeLinks,
        [key as any]: !(localSettings.socialLinks.activeLinks as any)[key]
      }
    };
    setLocalSettings(prev => ({ ...prev, socialLinks: updated }));
    updateSettings({ socialLinks: updated });
  };

  const handleUpdateLink = (key: string, value: string) => {
    const updated = {
      ...localSettings.socialLinks,
      [key]: value
    };
    setLocalSettings(prev => ({ ...prev, socialLinks: updated }));
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#030303] text-slate-100 h-screen overflow-hidden font-arabic">
      {saveSuccess && <div className="fixed top-6 right-6 z-[200] flex items-center gap-3 bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl animate-fade-in-up"><CheckCircle2 size={20} /><span>تمت العملية بنجاح</span></div>}
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-black border-r border-white/5 flex flex-col p-6 z-[70] transition-transform lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('site')}>
            <ShieldCheck className="text-gold" size={28} />
            <span className="font-display font-black text-xl uppercase text-white">إدارة الأسطول</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-500"><X size={24} /></button>
        </div>
        <nav className="space-y-2 flex-1">
          {[
            { id: 'stats', label: 'الإحصائيات', icon: BarChart3 },
            { id: 'news', label: 'الأخبار', icon: Newspaper },
            { id: 'inbox', label: 'الرسائل', icon: Mail },
            { id: 'users', label: 'المستخدمين', icon: Users },
            { id: 'media', label: 'الوسائط', icon: Layers },
            { id: 'social', label: 'التواصل', icon: Share2 },
            { id: 'system', label: 'النظام', icon: Settings },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold uppercase text-[10px] transition-all ${activeTab === t.id ? 'bg-gold text-black shadow-lg shadow-gold/10' : 'text-slate-500 hover:bg-white/5'}`}>
              <t.icon size={18} /> {t.label}
            </button>
          ))}
        </nav>
        <button onClick={logout} className="mt-auto flex items-center gap-4 px-4 py-3 text-red-500 font-bold uppercase text-[10px] w-full hover:bg-red-500/10 rounded-xl"><LogOut size={18} /> تسجيل الخروج</button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#050505]">
        <header className="flex items-center justify-between p-8 border-b border-white/5">
           <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 bg-white/5 rounded-lg text-gold"><ArrowLeft size={20} /></button>
           <h1 className="text-2xl font-display font-black uppercase text-white tracking-widest">{activeTab}</h1>
           <div className="flex items-center gap-4">
              {isSaving && <Loader2 size={18} className="animate-spin text-gold" />}
              <button onClick={() => navigateTo('site')} className="px-6 py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase border border-white/10 hover:border-gold/50 transition-all flex items-center gap-2"><ExternalLink size={14} /> معاينة</button>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12 pb-32">
          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 hover:border-gold/20 transition-all">
                <p className="text-slate-500 text-[10px] uppercase font-black mb-2 tracking-widest">الأخبار المنشورة</p>
                <h3 className="text-4xl font-display font-black text-white">{news.length}</h3>
              </div>
              <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 hover:border-gold/20 transition-all">
                <p className="text-slate-500 text-[10px] uppercase font-black mb-2 tracking-widest">الرسائل الواردة</p>
                <h3 className="text-4xl font-display font-black text-white">{tickets.length}</h3>
              </div>
              <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 hover:border-gold/20 transition-all">
                <p className="text-slate-500 text-[10px] uppercase font-black mb-2 tracking-widest">المستخدمين</p>
                <h3 className="text-4xl font-display font-black text-white">{usersList.length || '...'}</h3>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
               <h2 className="text-xl font-bold">قائمة الطاقم</h2>
               <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden">
                  <table className="w-full text-right text-sm">
                    <thead className="bg-black text-slate-500 uppercase text-[10px] font-black">
                      <tr>
                        <th className="p-4">المستخدم</th>
                        <th className="p-4">البريد</th>
                        <th className="p-4">الرتبة</th>
                        <th className="p-4">تاريخ الانضمام</th>
                        <th className="p-4">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map(u => (
                        <tr key={u.id} className="border-t border-white/5 hover:bg-white/5 transition-all">
                          <td className="p-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-wood-800 border border-gold/20 flex items-center justify-center overflow-hidden">
                              {u.avatar_url ? <img src={u.avatar_url} className="w-full h-full object-cover" /> : <User size={14} className="text-gold" />}
                            </div>
                            <span className="font-bold">{u.display_name || u.email?.split('@')[0]}</span>
                          </td>
                          <td className="p-4 text-slate-400">{u.email}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${u.role === 'admin' ? 'bg-gold text-black' : 'bg-white/10 text-slate-400'}`}>
                              {u.role === 'admin' ? 'مشرف' : 'مستخدم'}
                            </span>
                          </td>
                          <td className="p-4 text-[10px] text-slate-500">{new Date().toLocaleDateString()}</td>
                          <td className="p-4">
                            <button 
                              onClick={() => updateUserRole(u.id, u.role === 'admin' ? 'user' : 'admin').then(() => getAllUsers().then(setUsersList))}
                              className="text-gold hover:underline text-[10px] font-black uppercase"
                            >
                              تبديل الرتبة
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-12">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 space-y-6">
                     <h3 className="font-bold flex items-center gap-2 text-gold"><Monitor size={18} /> صور الواجهة</h3>
                     <div className="space-y-4">
                        <p className="text-xs text-slate-400">الشعار الرئيسي (الرابط: {localSettings.logoUrl})</p>
                        <div className="flex items-center gap-4">
                           <button onClick={() => logoFileRef.current?.click()} className="flex-1 bg-black border border-white/10 rounded-xl p-4 flex items-center justify-center gap-2 hover:border-gold transition-all"><Upload size={16} /> رفع شعار</button>
                           <input type="file" ref={logoFileRef} className="hidden" onChange={(e) => handleFileUpload(e, 'logoUrl')} />
                           <img src={localSettings.logoUrl} className="w-16 h-16 object-contain bg-black rounded-xl p-2" />
                        </div>
                        <p className="text-xs text-slate-400">خلفية البطل (Hero Background)</p>
                        <div className="flex items-center gap-4">
                           <button onClick={() => heroBgFileRef.current?.click()} className="flex-1 bg-black border border-white/10 rounded-xl p-4 flex items-center justify-center gap-2 hover:border-gold transition-all"><Upload size={16} /> رفع خلفية</button>
                           <input type="file" ref={heroBgFileRef} className="hidden" onChange={(e) => handleFileUpload(e, 'heroBgUrl')} />
                           <img src={localSettings.heroBgUrl} className="w-20 h-12 object-cover bg-black rounded-xl" />
                        </div>
                     </div>
                  </div>

                  <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 space-y-6">
                     <h3 className="font-bold flex items-center gap-2 text-gold"><Layers size={18} /> لقطات اللعبة (Showcase)</h3>
                     <div className="grid grid-cols-2 gap-4">
                        {Object.entries(localSettings.showcaseImages).map(([key, url]) => (
                          <div key={key} className="space-y-2">
                             <p className="text-[10px] uppercase font-black text-slate-500">{key}</p>
                             <div className="relative group rounded-xl overflow-hidden border border-white/10 aspect-[9/16] bg-black">
                                <img src={url} className="w-full h-full object-cover opacity-50 group-hover:opacity-100" />
                                <button 
                                  onClick={() => showcaseFileRefs.current[key]?.click()}
                                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white"
                                >
                                  <Camera size={24} />
                                </button>
                                {/* Fix: Wrapping the callback assignment in braces to return void */}
                                <input 
                                  type="file" 
                                  ref={el => { showcaseFileRefs.current[key] = el; }}
                                  className="hidden" 
                                  onChange={(e) => handleFileUpload(e, key, true)} 
                                />
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="max-w-4xl space-y-8">
               <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="font-bold flex items-center gap-2 text-gold"><Share2 size={18} /> روابط التواصل الاجتماعي</h3>
                    <button 
                      onClick={() => updateSettings({ socialLinks: localSettings.socialLinks }).then(triggerSuccess)}
                      className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-black uppercase text-xs flex items-center gap-2"
                    >
                      <Save size={16} /> حفظ الكل
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(localSettings.socialLinks.activeLinks).map(([key, isActive]) => (
                      <div key={key} className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{key}</label>
                          <button onClick={() => handleToggleLink(key)} className={`w-10 h-5 rounded-full transition-colors p-1 ${isActive ? 'bg-gold' : 'bg-white/10'}`}>
                            <div className={`w-3 h-3 bg-white rounded-full transition-transform ${isActive ? 'translate-x-5' : 'translate-x-0'}`}></div>
                          </button>
                        </div>
                        <input 
                          type="text" 
                          placeholder={`رابط أو اسم مستخدم ${key}`}
                          value={(localSettings.socialLinks as any)[key] || ''} 
                          onChange={(e) => handleUpdateLink(key, e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-gold/30"
                        />
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}

          {/* ... بقية الأقسام (Stats, News, Inbox, System) كما في التعديل السابق ... */}
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
                  <textarea placeholder="وصف مختصر..." value={newNews.excerpt} onChange={e => setNewNews({...newNews, excerpt: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 h-24 text-sm"></textarea>
                  <div className="flex items-center gap-4">
                    <button onClick={() => newsFileRef.current?.click()} className="bg-white/10 px-6 py-3 rounded-xl text-xs font-bold uppercase flex items-center gap-2"><ImageIcon size={16} /> رفع صورة الخبر</button>
                    <input type="file" ref={newsFileRef} className="hidden" onChange={e => handleFileUpload(e, 'news')} />
                    {newNews.thumbnailUrl && <img src={newNews.thumbnailUrl} className="h-12 w-20 object-cover rounded-lg border border-gold" />}
                  </div>
                  <div className="flex justify-end gap-4">
                    <button onClick={() => setShowNewsForm(false)} className="px-6 py-3 text-xs font-bold uppercase text-slate-500">إلغاء</button>
                    <button onClick={handleAddNews} className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-black uppercase text-xs">نشر الآن</button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map(item => (
                  <div key={item.id} className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 group">
                    <img src={item.thumbnailUrl} className="w-full h-40 object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="p-6">
                      <h4 className="font-bold mb-2">{item.title}</h4>
                      <p className="text-xs text-slate-500 mb-4 line-clamp-2">{item.excerpt}</p>
                      <button onClick={() => deleteNews(item.id)} className="text-red-500 hover:text-red-400 p-2"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'inbox' && (
            <div className="space-y-4">
              {tickets.length === 0 ? <p className="text-center py-20 text-slate-500">لا توجد رسائل واردة حالياً</p> : 
                tickets.map(t => (
                  <div key={t.id} className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-gold/30 transition-all flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="bg-gold/10 text-gold text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest">{t.subject}</span>
                        <span className="text-[10px] text-slate-500">{t.createdAt}</span>
                      </div>
                      <h4 className="font-bold text-lg">{t.name} <span className="text-slate-500 font-normal text-sm">&lt;{t.email}&gt;</span></h4>
                      <p className="text-slate-300 text-sm leading-relaxed">{t.message}</p>
                    </div>
                    <button onClick={() => deleteTicket(t.id)} className="text-red-500/40 hover:text-red-500 transition-colors p-2"><Trash2 size={20} /></button>
                  </div>
                ))
              }
            </div>
          )}

          {activeTab === 'system' && (
            <div className="max-w-4xl space-y-8">
              <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 space-y-6">
                <h3 className="font-bold text-gold uppercase text-xs flex items-center gap-2"><Power size={16} /> نظام الصيانة</h3>
                <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl">
                  <div>
                    <p className="font-bold">تفعيل وضع الصيانة</p>
                    <p className="text-xs text-slate-500">سيظهر الموقع كصفحة صيانة للزوار العاديين</p>
                  </div>
                  <button onClick={() => updateSettings({ isMaintenanceMode: !settings.isMaintenanceMode })} className={`w-14 h-8 rounded-full p-1 transition-colors ${settings.isMaintenanceMode ? 'bg-red-500' : 'bg-white/10'}`}><div className={`w-6 h-6 bg-white rounded-full transition-transform ${settings.isMaintenanceMode ? 'translate-x-6' : 'translate-x-0'}`}></div></button>
                </div>
                <textarea value={localSettings.maintenanceMessage} onChange={e => setLocalSettings({...localSettings, maintenanceMessage: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white h-32 text-sm" placeholder="رسالة الصيانة..."></textarea>
                <button onClick={() => updateSettings({ maintenanceMessage: localSettings.maintenanceMessage })} className="bg-gold text-black px-8 py-3 rounded-xl font-black uppercase text-xs">حفظ الرسالة</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
