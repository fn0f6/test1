
import React, { useState, useEffect } from 'react';
import { useSettings, SiteSettings } from '../context/SettingsContext';
import { apiService } from '../services/api';
import { 
  BarChart3, Newspaper, Mail, Settings, LogOut, Trash2, ShieldCheck, 
  Loader2, CheckCircle2, Save, Type, Share2, ImageIcon,
  User, ExternalLink, Users, Crown, PlusCircle, Smartphone, QrCode,
  Link as LinkIcon, Activity, MessageSquare, History, AlertTriangle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { 
    settings, updateSettings, tickets, news, addNews, deleteNews, deleteTicket,
    logout, user, getAllUsers, updateUserRole, navigateTo, lang, setLang
  } = useSettings();
  
  const [activeTab, setActiveTab] = useState<'stats' | 'news' | 'users' | 'system' | 'social' | 'content' | 'profile' | 'inbox'>('stats');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  const [newNews, setNewNews] = useState({ title: '', excerpt: '', category: 'تحديث', thumbnailUrl: '' });
  
  useEffect(() => {
    if (activeTab === 'users' || activeTab === 'stats') fetchUsers();
    setLocalSettings(settings);
  }, [activeTab, settings]);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsersList(data);
    } catch (e) {
      console.error("Failed to fetch users", e);
    }
  };

  const showSuccess = () => { 
    setSaveSuccess(true); 
    setTimeout(() => setSaveSuccess(false), 3000); 
  };

  const handleImageUpload = async (file: File, field: string, subKey?: string) => {
    setIsSaving(true);
    try {
      const url = await apiService.uploadImage(file);
      if (url) {
        if (field === 'user') {
          await apiService.updateProfile(user!.id, { [subKey!]: url });
          window.location.reload();
        } else if (subKey) {
          const updatedSub = { ...(localSettings as any)[field], [subKey]: url };
          setLocalSettings(prev => ({ ...prev, [field]: updatedSub }));
        } else {
          setLocalSettings(prev => ({ ...prev, [field]: url }));
        }
        showSuccess();
      }
    } catch (e: any) {
      alert(`خطأ في الرفع: تأكد من إعداد مخزن الملفات`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings(localSettings);
      showSuccess();
    } catch (e) {
      alert("خطأ أثناء الحفظ");
    } finally {
      setIsSaving(false);
    }
  };

  const menuItems = [
    { id: 'stats', label: 'القيادة العامة', icon: BarChart3 },
    { id: 'users', label: 'طاقم السفينة', icon: Users },
    { id: 'news', label: 'سجلات الأخبار', icon: Newspaper },
    { id: 'inbox', label: 'صندوق الوارد', icon: Mail },
    { id: 'social', label: 'شبكة التواصل', icon: Share2 },
    { id: 'content', label: 'المحتوى والترجمة', icon: Type },
    { id: 'system', label: 'إعدادات الأسطول', icon: Settings },
    { id: 'profile', label: 'قمرة القيادة', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#020202] text-white font-arabic h-screen overflow-hidden" dir="rtl">
      {saveSuccess && (
        <div className="fixed top-6 left-6 z-[300] bg-gold text-black px-6 py-3 rounded-xl shadow-2xl animate-fade-in flex items-center gap-2 font-black">
          <CheckCircle2 size={18} /> تم تحديث البيانات بنجاح
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-black border-l border-white/5 flex flex-col p-6 overflow-y-auto shrink-0 z-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 bg-gold rounded-2xl flex items-center justify-center rotate-3 shadow-lg shadow-gold/10 border border-white/10">
            <ShieldCheck className="text-black" size={28} />
          </div>
          <div>
            <span className="text-xl font-display font-black uppercase block leading-none">Command</span>
            <span className="text-[10px] text-gold font-black tracking-[0.2em] uppercase">Fleet Control</span>
          </div>
        </div>
        
        <nav className="space-y-1.5 flex-1">
          {menuItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id as any)} 
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black transition-all ${activeTab === item.id ? 'bg-gold text-black shadow-xl shadow-gold/5 translate-x-1' : 'text-slate-500 hover:bg-white/5'}`}
            >
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>
        
        <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-emerald-500 uppercase">الخادم متصل</span>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-4 text-red-500 font-black text-xs hover:bg-red-500/10 rounded-2xl transition-all">
            <LogOut size={18} /> مغادرة النظام
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#050505]">
        <header className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-xl z-10">
           <div className="flex items-center gap-4">
             <div className="p-2 bg-white/5 rounded-lg lg:hidden">
               <ShieldCheck className="text-gold" size={20} />
             </div>
             <h1 className="text-lg font-black text-white">{menuItems.find(m => m.id === activeTab)?.label}</h1>
             {isSaving && <Loader2 className="animate-spin text-gold" size={16} />}
           </div>
           <div className="flex items-center gap-3">
             <button onClick={handleSave} className="hidden sm:flex items-center gap-2 bg-white/10 hover:bg-gold hover:text-black px-6 py-2.5 rounded-xl text-[10px] font-black border border-white/10 transition-all uppercase tracking-widest"><Save size={16} /> حفظ التغييرات</button>
             <button onClick={() => navigateTo('site')} className="px-5 py-2.5 bg-white text-black rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:scale-105 transition-all"><ExternalLink size={14} /> معاينة الموقع</button>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 custom-scrollbar pb-32">
          
          {activeTab === 'stats' && (
            <div className="space-y-10 animate-fade-in-up">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[ 
                  { l: 'إجمالي البحارة', v: usersList.length, c: 'text-sky-500', icon: Users, sub: 'عضو مسجل' }, 
                  { l: 'سجلات الأخبار', v: news.length, c: 'text-gold', icon: Newspaper, sub: 'منشور عام' }, 
                  { l: 'رسائل الدعم', v: tickets.length, c: 'text-emerald-500', icon: Mail, sub: 'طلب مساعدة' }, 
                  { l: 'حالة النظام', v: settings.isMaintenanceMode ? 'مغلق' : 'نشط', c: settings.isMaintenanceMode ? 'text-red-500' : 'text-emerald-400', icon: Activity, sub: 'وضع الصيانة' } 
                ].map((s,i)=>(
                  <div key={i} className="glass-card p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group hover:border-white/10 transition-all">
                     <s.icon className="absolute -right-4 -bottom-4 text-white/5 w-32 h-32 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                     <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2 relative z-10">{s.l}</p>
                     <p className={`text-4xl font-black ${s.c} relative z-10 mb-1`}>{s.v}</p>
                     <p className="text-[9px] font-bold text-slate-600 uppercase relative z-10">{s.sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div className="glass-card p-10 rounded-[3rem] border-white/5 space-y-6">
                  <h3 className="text-xl font-black flex items-center gap-3"><History size={20} className="text-gold" /> آخر النشاطات</h3>
                  <div className="space-y-4">
                    {tickets.slice(0, 3).map(t => (
                      <div key={t.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><MessageSquare size={18}/></div>
                          <div>
                            <p className="text-xs font-black">رسالة جديدة من {t.name}</p>
                            <p className="text-[10px] text-slate-500">{new Date(t.createdAt).toLocaleDateString('ar-EG')}</p>
                          </div>
                        </div>
                        <button onClick={() => setActiveTab('inbox')} className="text-[10px] font-black text-gold hover:underline">عرض</button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="glass-card p-10 rounded-[3rem] border-white/5 flex flex-col justify-center items-center text-center space-y-4">
                   <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center text-gold border border-gold/20 mb-2">
                     <Smartphone size={40} />
                   </div>
                   <h3 className="text-xl font-black">تطبيق الأسطول</h3>
                   <p className="text-xs text-slate-500 max-w-xs">نظام عصر الهامور يعمل بكفاءة على كافة المنصات. يمكنك تحديث روابط المتاجر من إعدادات النظام.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'news' && (
            <div className="space-y-10 animate-fade-in">
              <div className="glass-card p-10 rounded-[3rem] border-white/5 space-y-8 bg-gold/5">
                <h2 className="text-2xl font-black flex items-center gap-4"><PlusCircle className="text-gold" size={32} /> نشر خبر جديد</h2>
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest mr-2">عنوان الخبر</label>
                     <input type="text" placeholder="ماذا حدث في الأسطول؟" className="w-full bg-black/60 border border-white/10 p-5 rounded-2xl outline-none focus:border-gold/50" value={newNews.title} onChange={e=>setNewNews({...newNews, title:e.target.value})} />
                   </div>
                   <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest mr-2">التصنيف</label>
                     <select className="w-full bg-black/60 border border-white/10 p-5 rounded-2xl outline-none text-xs font-black" value={newNews.category} onChange={e=>setNewNews({...newNews, category:e.target.value})}>
                        <option>تحديث</option><option>حدث</option><option>تنبيه</option><option>عاجل</option>
                     </select>
                   </div>
                   <div className="md:col-span-2 space-y-3">
                     <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest mr-2">موجز الخبر</label>
                     <textarea placeholder="اكتب تفاصيل الخبر هنا..." className="w-full bg-black/60 border border-white/10 p-5 rounded-2xl outline-none h-40 resize-none" value={newNews.excerpt} onChange={e=>setNewNews({...newNews, excerpt:e.target.value})} />
                   </div>
                   
                   <div className="md:col-span-2 space-y-4">
                     <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest mr-2">صورة الخبر (اختياري)</label>
                     <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-8 border-2 border-dashed border-white/10 rounded-3xl text-center space-y-4 hover:border-gold/30 transition-colors cursor-pointer" onClick={() => document.getElementById('news-img')?.click()}>
                           <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-500"><ImageIcon size={24}/></div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">رفع صورة من الجهاز</p>
                           <input id="news-img" type="file" className="hidden" onChange={async e => { if(e.target.files?.[0]) { const url = await apiService.uploadImage(e.target.files[0]); setNewNews({...newNews, thumbnailUrl: url}); }}} />
                        </div>
                        <div className="p-8 bg-black/40 border border-white/10 rounded-3xl space-y-4">
                           <div className="flex items-center gap-2 text-slate-500 mb-2">
                             <LinkIcon size={16} />
                             <span className="text-[10px] font-black uppercase tracking-widest">أو ضع رابط مباشر</span>
                           </div>
                           <input 
                             type="text" 
                             placeholder="https://image-url.com/pic.jpg" 
                             className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none text-[11px]" 
                             value={newNews.thumbnailUrl} 
                             onChange={e => setNewNews({...newNews, thumbnailUrl: e.target.value})} 
                           />
                        </div>
                     </div>
                     {newNews.thumbnailUrl && (
                       <div className="relative inline-block mt-4">
                         <img src={newNews.thumbnailUrl} className="h-40 rounded-2xl shadow-2xl" alt="Preview" />
                         <button onClick={()=>setNewNews({...newNews, thumbnailUrl:''})} className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"><Trash2 size={14}/></button>
                       </div>
                     )}
                   </div>
                </div>
                <button disabled={!newNews.title || isSaving} onClick={async ()=>{ setIsSaving(true); await addNews(newNews); setNewNews({title:'',excerpt:'',category:'تحديث',thumbnailUrl:''}); setIsSaving(false); showSuccess(); }} className="bg-gold text-black font-black px-8 py-5 rounded-2xl w-full text-lg shadow-xl hover:scale-[1.01] transition-all uppercase tracking-widest">تثبيت الخبر في السجلات</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {news.map(n => (
                  <div key={n.id} className="flex items-center gap-6 p-5 bg-white/5 rounded-3xl border border-white/5 group hover:bg-white/10 transition-all">
                    <div className="w-24 h-24 bg-black rounded-2xl overflow-hidden shrink-0 border border-white/5">
                      <img src={n.thumbnailUrl || 'https://placehold.co/400x400/111111/ffd700?text=News'} className="w-full h-full object-cover" alt="Thumb" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-white group-hover:text-gold transition-colors line-clamp-1">{n.title}</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">{n.category} • {n.date}</p>
                    </div>
                    <button onClick={() => { if(confirm("حذف هذا السجل نهائياً؟")) deleteNews(n.id); }} className="p-3 text-red-500 hover:bg-red-500/20 rounded-xl transition-all"><Trash2 size={18}/></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'inbox' && (
            <div className="grid grid-cols-1 gap-6 animate-fade-in">
               {tickets.length === 0 ? (
                 <div className="py-40 text-center glass-card border-dashed border-2 border-white/10 rounded-[4rem]">
                   <Mail className="mx-auto text-slate-800 mb-6" size={64} />
                   <p className="text-slate-500 font-black text-2xl uppercase tracking-[0.4em] opacity-30">صندوق الرسائل فارغ</p>
                 </div>
               ) : (
                 <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4 px-2">
                       <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">{tickets.length} رسالة واردة</h3>
                    </div>
                    {tickets.map(t => (
                      <div key={t.id} className="glass-card p-10 rounded-[3rem] border-white/5 space-y-6 hover:border-gold/30 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -z-0"></div>
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-6">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-gold shrink-0 border border-white/10 shadow-xl group-hover:scale-110 transition-transform"><Mail size={32}/></div>
                            <div>
                              <p className="text-2xl font-black text-white group-hover:text-gold transition-colors">{t.subject}</p>
                              <div className="flex flex-wrap gap-4 mt-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full"><User size={12}/> {t.name}</span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full"><Mail size={12}/> {t.email}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                             <a href={`mailto:${t.email}?subject=Re: ${t.subject}`} className="bg-white/5 hover:bg-gold hover:text-black p-4 rounded-2xl border border-white/10 transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2">الرد عبر البريد</a>
                             <button onClick={async () => { if(confirm("أرشفة وحذف الرسالة؟")) { await deleteTicket(t.id); showSuccess(); } }} className="text-red-500 hover:bg-red-500 p-4 rounded-2xl border border-red-500/20 hover:text-white transition-all"><Trash2 size={20}/></button>
                          </div>
                        </div>
                        <div className="relative z-10 bg-black/40 p-8 rounded-3xl border border-white/5">
                          <p className="text-sm text-slate-300 leading-relaxed font-medium whitespace-pre-line">{t.message}</p>
                        </div>
                        <div className="flex justify-between items-center px-2">
                           <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">{new Date(t.createdAt).toLocaleString('ar-EG', { day:'numeric', month:'long', hour:'2-digit', minute:'2-digit' })}</p>
                           <span className="w-2 h-2 rounded-full bg-gold/40"></span>
                        </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>
          )}

          {activeTab === 'system' && (
            <div className="grid lg:grid-cols-2 gap-10 animate-fade-in">
               <div className="glass-card p-10 rounded-[3rem] border-white/5 space-y-10">
                  <h3 className="text-xl font-black flex items-center gap-3 border-b border-white/5 pb-6"><Settings className="text-gold" /> الهوية المرئية</h3>
                  
                  <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">شعار الموقع (Logo)</label>
                    <div className="space-y-4">
                       <div className="flex items-center gap-6 p-6 bg-black/40 rounded-2xl border border-white/10 group">
                         <div className="w-20 h-20 bg-black rounded-xl flex items-center justify-center p-2 shrink-0 border border-white/10 group-hover:border-gold/30 transition-all">
                           <img src={localSettings.logoUrl} className="max-h-full max-w-full object-contain" alt="Logo" />
                         </div>
                         <div className="flex-1 space-y-3">
                            <input 
                              type="text" 
                              placeholder="رابط الشعار المباشر..." 
                              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none text-[11px] focus:border-gold/30 transition-all" 
                              value={localSettings.logoUrl} 
                              onChange={e => setLocalSettings({...localSettings, logoUrl: e.target.value})} 
                            />
                            <div className="flex items-center gap-3">
                               <input type="file" id="logo-file" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'logoUrl')} />
                               <button onClick={() => document.getElementById('logo-file')?.click()} className="text-[10px] font-black text-gold uppercase tracking-widest hover:underline flex items-center gap-2"><ImageIcon size={14}/> أو ارفع ملف</button>
                            </div>
                         </div>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">خلفية الواجهة (Hero BG)</label>
                    <div className="space-y-4">
                       <div className="p-6 bg-black/40 rounded-2xl border border-white/10 space-y-4">
                         <div className="h-32 w-full rounded-xl overflow-hidden border border-white/5">
                            <img src={localSettings.heroBgUrl} className="w-full h-full object-cover" alt="Hero BG" />
                         </div>
                         <div className="space-y-3">
                            <input 
                              type="text" 
                              placeholder="رابط الخلفية المباشر..." 
                              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none text-[11px] focus:border-gold/30 transition-all" 
                              value={localSettings.heroBgUrl} 
                              onChange={e => setLocalSettings({...localSettings, heroBgUrl: e.target.value})} 
                            />
                            <div className="flex items-center gap-3">
                               <input type="file" id="hero-file" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'heroBgUrl')} />
                               <button onClick={() => document.getElementById('hero-file')?.click()} className="text-[10px] font-black text-gold uppercase tracking-widest hover:underline flex items-center gap-2"><ImageIcon size={14}/> أو ارفع ملف</button>
                            </div>
                         </div>
                       </div>
                    </div>
                  </div>

                  <button onClick={handleSave} className="w-full bg-gold text-black font-black py-5 rounded-2xl shadow-xl uppercase tracking-widest text-sm">تحديث الهوية البصرية</button>
               </div>

               <div className="space-y-10">
                 <div className="glass-card p-10 rounded-[3rem] border-red-500/10 space-y-8">
                    <h3 className="text-xl font-black flex items-center gap-3"><QrCode className="text-gold" /> روابط الوصول السريع</h3>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <AlertTriangle className="text-red-500" size={24} />
                          <div>
                            <p className="font-black text-red-500 text-sm">وضع الصيانة</p>
                            <p className="text-[9px] text-slate-500 uppercase tracking-widest">إغلاق الموقع للزوار</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={localSettings.isMaintenanceMode} onChange={e => setLocalSettings({...localSettings, isMaintenanceMode: e.target.checked})} />
                          <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-red-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">رسالة الصيانة</label>
                        <textarea className="w-full bg-black/60 border border-white/10 p-5 rounded-2xl h-24 text-xs font-medium outline-none" value={localSettings.maintenanceMessage} onChange={e => setLocalSettings({...localSettings, maintenanceMessage: e.target.value})} />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">رابط QR الأساسي</label>
                           <input type="text" className="w-full bg-black/60 border border-white/10 p-4 rounded-xl text-[11px] outline-none" value={localSettings.qrData} onChange={e => setLocalSettings({...localSettings, qrData: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">صورة QR مخصصة</label>
                           <input type="text" placeholder="https://..." className="w-full bg-black/60 border border-white/10 p-4 rounded-xl text-[11px] outline-none" value={localSettings.customQrUrl} onChange={e => setLocalSettings({...localSettings, customQrUrl: e.target.value})} />
                        </div>
                      </div>
                    </div>
                 </div>

                 <div className="glass-card p-10 rounded-[3rem] border-white/5 space-y-6">
                    <h3 className="text-xl font-black flex items-center gap-3"><Smartphone className="text-gold" /> روابط المتاجر</h3>
                    <div className="grid gap-4">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">متجر Android</label>
                          <input type="text" className="w-full bg-black/60 border border-white/10 p-4 rounded-xl text-[11px] outline-none" value={localSettings.androidUrl} onChange={e => setLocalSettings({...localSettings, androidUrl: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">متجر iOS</label>
                          <input type="text" className="w-full bg-black/60 border border-white/10 p-4 rounded-xl text-[11px] outline-none" value={localSettings.iosUrl} onChange={e => setLocalSettings({...localSettings, iosUrl: e.target.value})} />
                       </div>
                    </div>
                    <button onClick={handleSave} className="w-full bg-white text-black font-black py-5 rounded-2xl shadow-xl uppercase tracking-widest text-sm hover:bg-slate-200 transition-colors">تحديث روابط المتاجر</button>
                 </div>
               </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6 animate-fade-in">
              <div className="glass-card rounded-[3rem] overflow-hidden border border-white/5 bg-black/40">
                <table className="w-full text-right">
                  <thead className="bg-white/5 text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">
                    <tr>
                      <th className="p-8">العضو / البريد</th>
                      <th className="p-8">الرتبة العسكرية</th>
                      <th className="p-8">تاريخ الانضمام</th>
                      <th className="p-8 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {usersList.map(u => (
                      <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                        <td className="p-8 flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-wood-900 overflow-hidden flex items-center justify-center shrink-0 border border-white/10 shadow-lg group-hover:scale-105 transition-transform">
                            {u.avatar_url ? <img src={u.avatar_url} className="w-full h-full object-cover" /> : <User size={24} className="text-gold/40" />}
                          </div>
                          <div>
                            <p className="font-black text-base group-hover:text-gold transition-colors">{u.display_name || u.email.split('@')[0]}</p>
                            <p className="text-[11px] text-slate-500 font-medium">{u.email}</p>
                          </div>
                        </td>
                        <td className="p-8">
                           <div className="inline-flex items-center gap-3 bg-black/60 border border-white/10 rounded-xl px-4 py-2">
                             <select 
                              value={u.role} 
                              onChange={async (e) => { 
                                await updateUserRole(u.id, e.target.value); 
                                fetchUsers(); 
                                showSuccess();
                              }}
                              className="bg-transparent text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer text-gold"
                             >
                               <option value="user" className="bg-[#050505]">SAILOR</option>
                               <option value="admin" className="bg-[#050505]">CAPTAIN</option>
                             </select>
                           </div>
                        </td>
                        <td className="p-8 text-[11px] text-slate-500 font-bold uppercase">{new Date(u.created_at).toLocaleDateString('ar-EG', { year:'numeric', month:'short', day:'numeric'})}</td>
                        <td className="p-8 text-center">
                          <button className="text-red-500 hover:bg-red-500/10 p-3 rounded-xl transition-all"><Trash2 size={18}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-xl mx-auto glass-card p-12 rounded-[4rem] text-center space-y-10 animate-fade-in-up border-white/5 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-gold/30"></div>
               <div className="relative inline-block mt-4">
                  <div className="w-48 h-48 rounded-[3.5rem] border-4 border-gold p-1 bg-black overflow-hidden shadow-2xl mx-auto group relative">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} className="w-full h-full object-cover rounded-[3rem] group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-wood-950 flex items-center justify-center text-gold/20"><User size={80}/></div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity cursor-pointer" onClick={()=>document.getElementById('av-up')?.click()}>
                      <ImageIcon size={40} className="text-gold mb-2" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">تغيير الصورة</span>
                    </div>
                  </div>
                  <input id="av-up" type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'user', 'avatar_url')} />
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gold rounded-2xl flex items-center justify-center text-black shadow-xl border-4 border-[#050505]"><Crown size={24}/></div>
               </div>
               
               <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter">{user?.display_name || user?.email.split('@')[0]}</h2>
                    <p className="text-gold font-black text-[10px] uppercase tracking-[0.5em]">{user?.role === 'admin' ? 'CAPTAIN OF THE FLEET' : 'OFFICIAL SAILOR'}</p>
                    <p className="text-slate-500 font-medium text-xs mt-2">{user?.email}</p>
                  </div>
               </div>
               
               <div className="pt-10 border-t border-white/5 grid grid-cols-2 gap-4">
                 <button onClick={logout} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-5 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all">مغادرة النظام</button>
                 <button onClick={() => navigateTo('site')} className="bg-white text-black hover:bg-gold py-5 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all">العودة للموقع</button>
               </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
