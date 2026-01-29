
import React, { useState, useEffect, useRef } from 'react';
import { useSettings, SiteSettings, Language } from '../context/SettingsContext';
import { apiService } from '../services/api';
import { 
  BarChart3, Newspaper, Mail, Settings, LogOut, Trash2, ShieldCheck, 
  Loader2, CheckCircle2, Save, Type, Share2, X, ArrowLeft, Image as ImageIcon,
  User, ExternalLink, Users, Crown, MessageSquare, Anchor, PlusCircle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { 
    settings, updateSettings, tickets, news, addNews, deleteNews, deleteTicket,
    logout, isAdmin, user, getAllUsers, updateUserRole, navigateTo, lang, updateUserProfile
  } = useSettings();
  
  const [activeTab, setActiveTab] = useState<'stats' | 'news' | 'users' | 'system' | 'social' | 'content' | 'profile' | 'inbox'>('stats');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [localSettings, setLocalSettings] = useState<any>(settings);
  const [newNews, setNewNews] = useState({ title: '', excerpt: '', category: 'تحديث', thumbnailUrl: '' });
  
  useEffect(() => {
    if (activeTab === 'users') getAllUsers().then(setUsersList);
    setLocalSettings(settings);
  }, [activeTab, settings]);

  const showSuccess = () => { setSaveSuccess(true); setTimeout(() => setSaveSuccess(false), 3000); };

  const handleUpload = async (file: File, field: string, subField?: string) => {
    setIsSaving(true);
    try {
      const url = await apiService.uploadImage(file);
      if (subField) {
        const updated = { ...localSettings[field], [subField]: url };
        await updateSettings({ [field]: updated });
      } else {
        await updateSettings({ [field]: url });
      }
      showSuccess();
    } catch (e) { alert("فشل الرفع"); }
    setIsSaving(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await updateSettings(localSettings);
    showSuccess();
    setIsSaving(false);
  };

  const menuItems = [
    { id: 'stats', label: 'الإحصائيات', icon: BarChart3 },
    { id: 'users', label: 'الطاقم', icon: Users },
    { id: 'news', label: 'الأخبار', icon: Newspaper },
    { id: 'inbox', label: 'الرسائل', icon: Mail },
    { id: 'social', label: 'التواصل', icon: Share2 },
    { id: 'content', label: 'المحتوى', icon: Type },
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
      <aside className="w-full lg:w-72 bg-black border-l border-white/5 flex flex-col p-6 overflow-y-auto">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center rotate-12"><ShieldCheck className="text-black -rotate-12" /></div>
          <span className="text-xl font-black uppercase">Command Deck</span>
        </div>
        <nav className="space-y-1 flex-1">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-xs font-black transition-all ${activeTab === item.id ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-slate-500 hover:bg-white/5'}`}>
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>
        <button onClick={logout} className="mt-8 flex items-center gap-4 px-4 py-4 text-red-500 font-black text-xs hover:bg-red-500/5 rounded-xl"><LogOut size={18} /> مغادرة</button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="p-6 border-b border-white/5 flex items-center justify-between bg-black/50 backdrop-blur-md">
           <h1 className="text-lg font-black">{menuItems.find(m => m.id === activeTab)?.label}</h1>
           <button onClick={() => navigateTo('site')} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase flex items-center gap-2"><ExternalLink size={14} /> عرض الموقع</button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar space-y-10">
          
          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[ { l: 'أخبار منشورة', v: news.length, c: 'text-gold' }, { l: 'رسائل دعم', v: tickets.length, c: 'text-emerald-500' }, { l: 'أعضاء الطاقم', v: usersList.length, c: 'text-sky-500' } ].map((s,i)=>(
                <div key={i} className="glass-card p-8 rounded-[2rem] border-white/5">
                   <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">{s.l}</p>
                   <p className={`text-5xl font-black ${s.c}`}>{s.v}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'news' && (
            <div className="space-y-8 animate-fade-in">
              <div className="glass-card p-8 rounded-[2rem] border-white/5 space-y-6">
                <h2 className="text-xl font-black flex items-center gap-3"><PlusCircle className="text-gold" /> إضافة خبر جديد</h2>
                <div className="grid md:grid-cols-2 gap-6">
                   <input type="text" placeholder="عنوان الخبر" className="bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-gold/50" value={newNews.title} onChange={e=>setNewNews({...newNews, title:e.target.value})} />
                   <select className="bg-black/40 border border-white/10 p-4 rounded-xl outline-none" value={newNews.category} onChange={e=>setNewNews({...newNews, category:e.target.value})}>
                      <option>تحديث</option><option>حدث</option><option>تنبيه</option>
                   </select>
                   <textarea placeholder="موجز الخبر..." className="md:col-span-2 bg-black/40 border border-white/10 p-4 rounded-xl outline-none h-32" value={newNews.excerpt} onChange={e=>setNewNews({...newNews, excerpt:e.target.value})} />
                   <div className="md:col-span-2 space-y-2">
                     <p className="text-[10px] font-black text-slate-500">صورة الخبر</p>
                     <input type="file" onChange={async e => { if(e.target.files?.[0]) { const url = await apiService.uploadImage(e.target.files[0]); setNewNews({...newNews, thumbnailUrl: url}); }}} />
                   </div>
                </div>
                <button disabled={!newNews.title || isSaving} onClick={async ()=>{ setIsSaving(true); await addNews(newNews); setNewNews({title:'',excerpt:'',category:'تحديث',thumbnailUrl:''}); setIsSaving(false); showSuccess(); }} className="bg-gold text-black font-black px-8 py-4 rounded-xl w-full">نشر الخبر الآن</button>
              </div>

              <div className="space-y-4">
                <h3 className="font-black text-slate-500 uppercase text-[10px] tracking-widest">إدارة الأخبار الحالية</h3>
                {news.map(n => (
                  <div key={n.id} className="flex items-center gap-6 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <img src={n.thumbnailUrl} className="w-20 h-20 object-cover rounded-xl" />
                    <div className="flex-1">
                      <p className="font-black text-white">{n.title}</p>
                      <p className="text-xs text-slate-500">{n.date}</p>
                    </div>
                    <button onClick={() => { if(confirm("حذف الخبر؟")) deleteNews(n.id); }} className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl"><Trash2 size={20}/></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'inbox' && (
            <div className="space-y-6">
               {tickets.length === 0 ? <div className="py-20 text-center opacity-30">لا يوجد رسائل</div> : tickets.map(t => (
                 <div key={t.id} className="glass-card p-6 rounded-2xl border-white/5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-black text-gold">{t.subject}</p>
                        <p className="text-xs text-slate-400">{t.name} ({t.email})</p>
                      </div>
                      <button onClick={() => deleteTicket(t.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg"><Trash2 size={16}/></button>
                    </div>
                    <p className="text-sm bg-black/20 p-4 rounded-xl text-slate-300 leading-relaxed">{t.message}</p>
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'social' && (
            <div className="glass-card p-8 rounded-[2rem] border-white/5 space-y-10">
               <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black">روابط التواصل الاجتماعي</h3>
                  <button onClick={handleSave} className="flex items-center gap-2 bg-gold text-black font-black px-6 py-2 rounded-lg text-xs"><Save size={16}/> حفظ التغييرات</button>
               </div>
               <div className="grid md:grid-cols-2 gap-8">
                  {Object.keys(localSettings.socialLinks.activeLinks).map(key => (
                    <div key={key} className="space-y-2">
                       <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black uppercase text-slate-400">{key}</label>
                          <input type="checkbox" checked={localSettings.socialLinks.activeLinks[key]} onChange={e => {
                            const updated = { ...localSettings.socialLinks.activeLinks, [key]: e.target.checked };
                            setLocalSettings({...localSettings, socialLinks: { ...localSettings.socialLinks, activeLinks: updated }});
                          }} />
                       </div>
                       <input type="text" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none" value={(localSettings.socialLinks as any)[key]} onChange={e => {
                          setLocalSettings({...localSettings, socialLinks: { ...localSettings.socialLinks, [key]: e.target.value }});
                       }} />
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-10">
               <div className="glass-card p-8 rounded-[2rem] border-white/5 space-y-6">
                  <h3 className="text-xl font-black">إعدادات النظام</h3>
                  <div className="flex items-center justify-between p-6 bg-red-500/5 border border-red-500/10 rounded-2xl">
                    <div>
                      <p className="font-black text-red-500">وضع الصيانة (Maintenance Mode)</p>
                      <p className="text-xs text-slate-500">سيتم منع جميع المستخدمين من دخول الموقع عدا القادة.</p>
                    </div>
                    <input type="checkbox" className="w-6 h-6" checked={localSettings.isMaintenanceMode} onChange={e => setLocalSettings({...localSettings, isMaintenanceMode: e.target.checked})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400">رسالة الصيانة</label>
                    <textarea className="w-full bg-black/40 border border-white/10 p-4 rounded-xl h-24" value={localSettings.maintenanceMessage} onChange={e => setLocalSettings({...localSettings, maintenanceMessage: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400">عنوان الموقع الرسمي</label>
                    <input type="text" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl" value={localSettings.siteTitle} onChange={e => setLocalSettings({...localSettings, siteTitle: e.target.value})} />
                  </div>
                  <button onClick={handleSave} className="w-full bg-white text-black font-black py-4 rounded-xl">تطبيق إعدادات النظام</button>
               </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-md mx-auto text-center space-y-8">
               <div className="relative inline-block group">
                  <div className="w-32 h-32 rounded-[2.5rem] border-4 border-gold overflow-hidden shadow-2xl">
                    {user?.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-wood-900 flex items-center justify-center text-gold"><User size={48}/></div>}
                  </div>
                  <button onClick={()=>document.getElementById('av-up')?.click()} className="absolute -bottom-2 -right-2 w-10 h-10 bg-gold text-black rounded-xl border-4 border-black flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg"><ImageIcon size={18}/></button>
                  <input id="av-up" type="file" accept="image/*" className="hidden" onChange={e => { if(e.target.files?.[0]) handleUpload(e.target.files[0], 'avatar'); }} />
               </div>
               <div className="space-y-2">
                  <h2 className="text-2xl font-black">{user?.display_name || 'قبطان'}</h2>
                  <p className="text-slate-500">{user?.email}</p>
                  <div className="inline-flex items-center gap-2 px-4 py-1 bg-gold text-black rounded-full text-[10px] font-black uppercase"><Crown size={12}/> {user?.role}</div>
               </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
