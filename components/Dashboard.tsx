
import React, { useState, useEffect } from 'react';
import { useSettings, SiteSettings, Language } from '../context/SettingsContext';
import { apiService } from '../services/api';
import { 
  BarChart3, Newspaper, Mail, Settings, LogOut, Trash2, ShieldCheck, 
  Loader2, CheckCircle2, Save, Type, Share2, ImageIcon,
  User, ExternalLink, Users, Crown, PlusCircle, Globe, Smartphone, QrCode
} from 'lucide-react';

const Dashboard: React.FC = () => {
  // Added setLang to the destructuring from useSettings
  const { 
    settings, updateSettings, tickets, news, addNews, deleteNews, deleteTicket,
    logout, user, getAllUsers, updateUserRole, navigateTo, lang, setLang, refreshUserProfile
  } = useSettings();
  
  const [activeTab, setActiveTab] = useState<'stats' | 'news' | 'users' | 'system' | 'social' | 'content' | 'profile' | 'inbox'>('stats');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  const [newNews, setNewNews] = useState({ title: '', excerpt: '', category: 'تحديث', thumbnailUrl: '' });
  
  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    setLocalSettings(settings);
  }, [activeTab, settings]);

  const fetchUsers = async () => {
    const data = await getAllUsers();
    setUsersList(data);
  };

  const showSuccess = () => { 
    setSaveSuccess(true); 
    setTimeout(() => setSaveSuccess(false), 3000); 
  };

  const handleImageUpload = async (file: File, field: string, subKey?: string) => {
    setIsSaving(true);
    try {
      const url = await apiService.uploadImage(file);
      if (subKey) {
        const updatedSub = { ...(localSettings as any)[field], [subKey]: url };
        setLocalSettings(prev => ({ ...prev, [field]: updatedSub }));
      } else {
        setLocalSettings(prev => ({ ...prev, [field]: url }));
      }
      showSuccess();
    } catch (e) {
      alert("فشل رفع الصورة، تأكد من إعدادات Storage في Supabase");
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
    { id: 'stats', label: 'الإحصائيات', icon: BarChart3 },
    { id: 'users', label: 'الطاقم', icon: Users },
    { id: 'news', label: 'الأخبار', icon: Newspaper },
    { id: 'inbox', label: 'الرسائل', icon: Mail },
    { id: 'social', label: 'التواصل', icon: Share2 },
    { id: 'content', label: 'النصوص', icon: Type },
    { id: 'system', label: 'النظام', icon: Settings },
    { id: 'profile', label: 'ملفي', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#020202] text-white font-arabic h-screen overflow-hidden" dir="rtl">
      {saveSuccess && (
        <div className="fixed top-6 left-6 z-[300] bg-gold text-black px-6 py-3 rounded-xl shadow-2xl animate-fade-in flex items-center gap-2 font-black">
          <CheckCircle2 size={18} /> تم الحفظ بنجاح
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-black border-l border-white/5 flex flex-col p-6 overflow-y-auto shrink-0">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center rotate-12 shadow-lg shadow-gold/20">
            <ShieldCheck className="text-black -rotate-12" size={24} />
          </div>
          <span className="text-xl font-display font-black uppercase tracking-tighter">Command Deck</span>
        </div>
        <nav className="space-y-1 flex-1">
          {menuItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id as any)} 
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-xs font-black transition-all ${activeTab === item.id ? 'bg-gold text-black shadow-lg shadow-gold/20 translate-x-1' : 'text-slate-500 hover:bg-white/5'}`}
            >
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-8 pt-6 border-t border-white/5">
          <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-4 text-red-500 font-black text-xs hover:bg-red-500/5 rounded-xl transition-colors">
            <LogOut size={18} /> مغادرة السفينة
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#050505]">
        <header className="p-6 border-b border-white/5 flex items-center justify-between bg-black/50 backdrop-blur-md z-10">
           <div className="flex items-center gap-4">
             <h1 className="text-lg font-black text-gold">{menuItems.find(m => m.id === activeTab)?.label}</h1>
             {isSaving && <Loader2 className="animate-spin text-gold" size={16} />}
           </div>
           <div className="flex items-center gap-3">
             <button onClick={handleSave} className="hidden sm:flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-2.5 rounded-xl text-xs font-black border border-white/10 transition-all"><Save size={16} /> حفظ الكل</button>
             <button onClick={() => navigateTo('site')} className="px-4 py-2.5 bg-gold text-black rounded-xl text-xs font-black uppercase flex items-center gap-2 hover:scale-105 transition-all"><ExternalLink size={14} /> عرض الموقع</button>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 custom-scrollbar pb-32">
          
          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
              {[ 
                { l: 'أخبار منشورة', v: news.length, c: 'text-gold', icon: Newspaper }, 
                { l: 'رسائل دعم', v: tickets.length, c: 'text-emerald-500', icon: Mail }, 
                { l: 'أعضاء الطاقم', v: usersList.length, c: 'text-sky-500', icon: Users } 
              ].map((s,i)=>(
                <div key={i} className="glass-card p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group">
                   <s.icon className="absolute -right-4 -bottom-4 text-white/5 w-32 h-32 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                   <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2 relative z-10">{s.l}</p>
                   <p className={`text-6xl font-black ${s.c} relative z-10`}>{s.v}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white/5 rounded-3xl overflow-hidden border border-white/5">
                <table className="w-full text-right">
                  <thead className="bg-white/5 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                    <tr>
                      <th className="p-6">العضو</th>
                      <th className="p-6">الرتبة</th>
                      <th className="p-6">تاريخ الانضمام</th>
                      <th className="p-6">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {usersList.map(u => (
                      <tr key={u.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-6 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-wood-900 overflow-hidden flex items-center justify-center shrink-0 border border-white/10">
                            {u.avatar_url ? <img src={u.avatar_url} className="w-full h-full object-cover" /> : <User size={18} className="text-gold/40" />}
                          </div>
                          <div>
                            <p className="font-black text-sm">{u.display_name || u.email.split('@')[0]}</p>
                            <p className="text-[10px] text-slate-500">{u.email}</p>
                          </div>
                        </td>
                        <td className="p-6">
                           <select 
                            value={u.role} 
                            onChange={(e) => { updateUserRole(u.id, e.target.value); fetchUsers(); }}
                            className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold outline-none"
                           >
                             <option value="user">SAILOR</option>
                             <option value="admin">CAPTAIN</option>
                           </select>
                        </td>
                        <td className="p-6 text-xs text-slate-500">{new Date(u.created_at).toLocaleDateString('ar-EG')}</td>
                        <td className="p-6">
                          <button className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'news' && (
            <div className="space-y-10 animate-fade-in">
              <div className="glass-card p-10 rounded-[3rem] border-white/5 space-y-8 bg-gold/5">
                <h2 className="text-2xl font-black flex items-center gap-4"><PlusCircle className="text-gold" size={32} /> نشر خبر جديد</h2>
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                     <label className="text-xs font-black text-slate-400 mr-2">عنوان الخبر</label>
                     <input type="text" placeholder="ماذا حدث في الأسطول؟" className="w-full bg-black/60 border border-white/10 p-5 rounded-2xl outline-none focus:border-gold/50" value={newNews.title} onChange={e=>setNewNews({...newNews, title:e.target.value})} />
                   </div>
                   <div className="space-y-3">
                     <label className="text-xs font-black text-slate-400 mr-2">التصنيف</label>
                     <select className="w-full bg-black/60 border border-white/10 p-5 rounded-2xl outline-none" value={newNews.category} onChange={e=>setNewNews({...newNews, category:e.target.value})}>
                        <option>تحديث</option><option>حدث</option><option>تنبيه</option><option>عاجل</option>
                     </select>
                   </div>
                   <div className="md:col-span-2 space-y-3">
                     <label className="text-xs font-black text-slate-400 mr-2">موجز الخبر</label>
                     <textarea placeholder="اكتب تفاصيل الخبر هنا..." className="w-full bg-black/60 border border-white/10 p-5 rounded-2xl outline-none h-40 resize-none" value={newNews.excerpt} onChange={e=>setNewNews({...newNews, excerpt:e.target.value})} />
                   </div>
                   <div className="md:col-span-2 p-8 border-2 border-dashed border-white/10 rounded-3xl text-center space-y-4 hover:border-gold/30 transition-colors">
                     {newNews.thumbnailUrl ? (
                       <div className="relative inline-block">
                         <img src={newNews.thumbnailUrl} className="h-48 rounded-2xl shadow-2xl mx-auto" />
                         <button onClick={()=>setNewNews({...newNews, thumbnailUrl:''})} className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full shadow-lg"><Trash2 size={16}/></button>
                       </div>
                     ) : (
                       <div className="cursor-pointer" onClick={() => document.getElementById('news-img')?.click()}>
                         <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500"><ImageIcon size={32}/></div>
                         <p className="font-black text-slate-400">انقر لرفع صورة الخبر</p>
                       </div>
                     )}
                     <input id="news-img" type="file" className="hidden" onChange={async e => { if(e.target.files?.[0]) { const url = await apiService.uploadImage(e.target.files[0]); setNewNews({...newNews, thumbnailUrl: url}); }}} />
                   </div>
                </div>
                <button disabled={!newNews.title || isSaving} onClick={async ()=>{ setIsSaving(true); await addNews(newNews); setNewNews({title:'',excerpt:'',category:'تحديث',thumbnailUrl:''}); setIsSaving(false); showSuccess(); }} className="bg-gold text-black font-black px-8 py-5 rounded-2xl w-full text-lg shadow-xl hover:scale-[1.01] transition-all">نشر الخبر في المجلدات الرسمية</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {news.map(n => (
                  <div key={n.id} className="flex items-center gap-6 p-5 bg-white/5 rounded-3xl border border-white/5 group hover:bg-white/10 transition-all">
                    <img src={n.thumbnailUrl} className="w-24 h-24 object-cover rounded-2xl" />
                    <div className="flex-1">
                      <p className="font-black text-white group-hover:text-gold transition-colors">{n.title}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{n.category} • {n.date}</p>
                    </div>
                    <button onClick={() => { if(confirm("حذف الخبر نهائياً؟")) deleteNews(n.id); }} className="p-3 text-red-500 hover:bg-red-500/20 rounded-xl transition-all"><Trash2 size={20}/></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-10 animate-fade-in">
              <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5 w-fit">
                <button onClick={() => setLang('ar')} className={`px-8 py-3 rounded-xl font-black text-xs transition-all ${lang === 'ar' ? 'bg-gold text-black shadow-lg' : 'text-slate-500'}`}>العربية</button>
                <button onClick={() => setLang('en')} className={`px-8 py-3 rounded-xl font-black text-xs transition-all ${lang === 'en' ? 'bg-gold text-black shadow-lg' : 'text-slate-500'}`}>English</button>
              </div>

              <div className="glass-card p-10 rounded-[3rem] border-white/5 space-y-10">
                <div className="grid md:grid-cols-2 gap-10">
                   {Object.keys(localSettings.translations[lang] || {}).map(key => (
                     <div key={key} className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-gold tracking-widest">{key.replace('nav', 'Navigation: ').replace('hero', 'Hero Section: ')}</label>
                        <input 
                          type="text" 
                          className="w-full bg-black/60 border border-white/10 p-5 rounded-2xl outline-none focus:border-gold/50" 
                          value={localSettings.translations[lang][key]} 
                          onChange={e => {
                            const updatedTrans = { ...localSettings.translations[lang], [key]: e.target.value };
                            setLocalSettings({ ...localSettings, translations: { ...localSettings.translations, [lang]: updatedTrans } });
                          }} 
                        />
                     </div>
                   ))}
                </div>
                <button onClick={handleSave} className="w-full bg-gold text-black font-black py-5 rounded-2xl text-lg shadow-xl">حفظ تعديلات المحتوى</button>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="glass-card p-10 rounded-[3rem] border-white/5 space-y-10 bg-black/40">
               <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black">روابط أسطول الهامور</h3>
                  <button onClick={handleSave} className="flex items-center gap-2 bg-gold text-black font-black px-8 py-3 rounded-xl text-sm shadow-lg hover:scale-105 transition-all"><Save size={18}/> حفظ التغييرات</button>
               </div>
               <div className="grid md:grid-cols-2 gap-8">
                  {Object.keys(localSettings.socialLinks.activeLinks).map(key => (
                    <div key={key} className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                       <div className="flex justify-between items-center">
                          <label className="text-xs font-black uppercase text-slate-300 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-gold"></span> {key}
                          </label>
                          <label className="relative inline-flex items-center cursor-pointer scale-90">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={localSettings.socialLinks.activeLinks[key]} 
                              onChange={e => {
                                const updatedActive = { ...localSettings.socialLinks.activeLinks, [key]: e.target.checked };
                                setLocalSettings({...localSettings, socialLinks: { ...localSettings.socialLinks, activeLinks: updatedActive }});
                              }} 
                            />
                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                          </label>
                       </div>
                       <input 
                          type="text" 
                          className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-gold/30 transition-all text-sm" 
                          placeholder={`رابط ${key}...`}
                          value={(localSettings.socialLinks as any)[key]} 
                          onChange={e => {
                            setLocalSettings({...localSettings, socialLinks: { ...localSettings.socialLinks, [key]: e.target.value }});
                          }} 
                        />
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="grid lg:grid-cols-2 gap-10 animate-fade-in">
               <div className="glass-card p-10 rounded-[3rem] border-white/5 space-y-8">
                  <h3 className="text-xl font-black flex items-center gap-3"><Settings className="text-gold" /> الهوية والتحميل</h3>
                  
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">شعار الموقع (Logo)</label>
                    <div className="flex items-center gap-6 p-6 bg-black/40 rounded-2xl border border-white/10">
                      <img src={localSettings.logoUrl} className="h-12 w-auto" />
                      <input type="file" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'logoUrl')} className="text-xs" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">خلفية الموقع (Hero BG)</label>
                    <div className="flex items-center gap-6 p-6 bg-black/40 rounded-2xl border border-white/10">
                      <img src={localSettings.heroBgUrl} className="h-12 w-24 object-cover rounded-lg" />
                      <input type="file" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'heroBgUrl')} className="text-xs" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">رابط متجر أندرويد</label>
                    <div className="relative">
                      <Smartphone className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input type="text" className="w-full bg-black/60 border border-white/10 p-5 pr-14 rounded-2xl outline-none" value={localSettings.androidUrl} onChange={e => setLocalSettings({...localSettings, androidUrl: e.target.value})} />
                    </div>
                  </div>

                  <button onClick={handleSave} className="w-full bg-gold text-black font-black py-5 rounded-2xl shadow-lg">تحديث الهوية</button>
               </div>

               <div className="glass-card p-10 rounded-[3rem] border-red-500/10 space-y-8">
                  <h3 className="text-xl font-black flex items-center gap-3"><QrCode className="text-gold" /> إعدادات الـ QR والصيانة</h3>
                  
                  <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="font-black text-red-500">وضع الصيانة</p>
                      <p className="text-[10px] text-slate-500">سيتم إغلاق الموقع أمام الزوار مؤقتاً.</p>
                    </div>
                    <input type="checkbox" className="w-6 h-6 accent-red-500" checked={localSettings.isMaintenanceMode} onChange={e => setLocalSettings({...localSettings, isMaintenanceMode: e.target.checked})} />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">رسالة الصيانة</label>
                    <textarea className="w-full bg-black/60 border border-white/10 p-5 rounded-2xl h-32 resize-none" value={localSettings.maintenanceMessage} onChange={e => setLocalSettings({...localSettings, maintenanceMessage: e.target.value})} />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">رابط الـ QR كود</label>
                    <input type="text" placeholder="https://..." className="w-full bg-black/60 border border-white/10 p-5 rounded-2xl outline-none" value={localSettings.qrData} onChange={e => setLocalSettings({...localSettings, qrData: e.target.value})} />
                  </div>
                  
                  <button onClick={handleSave} className="w-full bg-white text-black font-black py-5 rounded-2xl shadow-lg hover:bg-slate-100 transition-colors">تفعيل التغييرات</button>
               </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-xl mx-auto glass-card p-12 rounded-[3.5rem] text-center space-y-10 animate-fade-in-up border-white/5">
               <div className="relative inline-block">
                  <div className="w-40 h-40 rounded-[3rem] border-4 border-gold p-1 bg-black overflow-hidden shadow-2xl mx-auto group">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} className="w-full h-full object-cover rounded-[2.5rem] group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-wood-950 flex items-center justify-center text-gold/20"><User size={64}/></div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer" onClick={()=>document.getElementById('av-up')?.click()}>
                      <ImageIcon size={32} className="text-gold" />
                    </div>
                  </div>
                  <input id="av-up" type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'user', 'avatar_url')} />
               </div>
               <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black text-white">{user?.display_name || user?.email.split('@')[0]}</h2>
                    <p className="text-slate-500 font-medium">{user?.email}</p>
                  </div>
                  <div className="inline-flex items-center gap-3 px-6 py-2 bg-gold/10 border border-gold/20 text-gold rounded-full text-xs font-black uppercase tracking-widest">
                    <Crown size={14} fill="currentColor"/> {user?.role === 'admin' ? 'CAPTAIN' : 'SAILOR'}
                  </div>
               </div>
               <div className="pt-8 border-t border-white/5 flex gap-4">
                 <button onClick={logout} className="flex-1 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-4 rounded-2xl font-black transition-all">مغادرة الحساب</button>
                 <button onClick={() => navigateTo('site')} className="flex-1 bg-white/10 hover:bg-white text-white hover:text-black py-4 rounded-2xl font-black transition-all">العودة للسفينة</button>
               </div>
            </div>
          )}

          {activeTab === 'inbox' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
               {tickets.length === 0 ? (
                 <div className="col-span-full py-40 text-center glass-card border-dashed border-2 border-white/10 rounded-[3rem]">
                   <p className="text-slate-500 font-black text-2xl uppercase tracking-[0.3em] opacity-30">صندوق الوارد فارغ</p>
                 </div>
               ) : tickets.map(t => (
                 <div key={t.id} className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-6 hover:border-gold/30 transition-all group">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold shrink-0 border border-gold/20"><Mail size={24}/></div>
                        <div>
                          <p className="font-black text-lg group-hover:text-gold transition-colors">{t.subject}</p>
                          <p className="text-xs text-slate-500 font-bold">{t.name} • {t.email}</p>
                        </div>
                      </div>
                      <button onClick={() => deleteTicket(t.id)} className="text-red-500 hover:bg-red-500/10 p-3 rounded-xl transition-colors"><Trash2 size={20}/></button>
                    </div>
                    <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                      <p className="text-sm text-slate-300 leading-relaxed font-medium">{t.message}</p>
                    </div>
                    {/* Fixed SupportTicket property name from created_at to createdAt */}
                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest text-left">{new Date(t.createdAt).toLocaleString('ar-EG')}</p>
                 </div>
               ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
