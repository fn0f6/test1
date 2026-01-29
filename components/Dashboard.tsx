
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
    logout, user, getAllUsers, updateUserRole, navigateTo, lang
  } = useSettings();
  
  const [activeTab, setActiveTab] = useState<'stats' | 'news' | 'users' | 'system' | 'inbox' | 'profile'>('stats');
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
      setUsersList(data || []);
    } catch (e) {
      console.error("Failed to fetch users", e);
    }
  };

  const showSuccess = () => { 
    setSaveSuccess(true); 
    setTimeout(() => setSaveSuccess(false), 3000); 
  };

  const handleImageUpload = async (file: File, field: string) => {
    setIsSaving(true);
    try {
      const url = await apiService.uploadImage(file);
      if (url) {
        setLocalSettings(prev => ({ ...prev, [field]: url }));
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
      alert("خطأ أثناء الحفظ: تأكد من إعداد الجداول في Supabase");
    } finally {
      setIsSaving(false);
    }
  };

  const menuItems = [
    { id: 'stats', label: 'القيادة العامة', icon: BarChart3 },
    { id: 'users', label: 'طاقم السفينة', icon: Users },
    { id: 'news', label: 'سجلات الأخبار', icon: Newspaper },
    { id: 'inbox', label: 'صندوق الوارد', icon: Mail },
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
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black transition-all ${activeTab === item.id ? 'bg-gold text-black shadow-xl shadow-gold/5' : 'text-slate-500 hover:bg-white/5'}`}
            >
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>
        
        <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
          <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-4 text-red-500 font-black text-xs hover:bg-red-500/10 rounded-2xl transition-all">
            <LogOut size={18} /> مغادرة النظام
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#050505]">
        <header className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-xl z-10">
           <div className="flex items-center gap-4">
             <h1 className="text-lg font-black text-white">{menuItems.find(m => m.id === activeTab)?.label}</h1>
             {isSaving && <Loader2 className="animate-spin text-gold" size={16} />}
           </div>
           <div className="flex items-center gap-3">
             <button onClick={handleSave} className="bg-gold text-black px-6 py-2.5 rounded-xl text-[10px] font-black hover:scale-105 transition-all uppercase tracking-widest flex items-center gap-2"><Save size={16} /> حفظ الكل</button>
             <button onClick={() => navigateTo('site')} className="px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black flex items-center gap-2 hover:bg-white/10 transition-all"><ExternalLink size={14} /> عرض الموقع</button>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 custom-scrollbar pb-32">
          
          {activeTab === 'stats' && (
            <div className="space-y-10 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[ 
                  { l: 'إجمالي البحارة', v: usersList.length, c: 'text-sky-500', icon: Users, sub: 'عضو مسجل' }, 
                  { l: 'سجلات الأخبار', v: news.length, c: 'text-gold', icon: Newspaper, sub: 'منشور عام' }, 
                  { l: 'رسائل الدعم', v: tickets.length, c: 'text-emerald-500', icon: Mail, sub: 'طلب مساعدة' }, 
                  { l: 'حالة النظام', v: settings.isMaintenanceMode ? 'صيانة' : 'نشط', c: settings.isMaintenanceMode ? 'text-red-500' : 'text-emerald-400', icon: Activity, sub: 'وضع الأونلاين' } 
                ].map((s,i)=>(
                  <div key={i} className="glass-card p-8 rounded-[2rem] border-white/5 relative overflow-hidden group">
                     <s.icon className="absolute -right-4 -bottom-4 text-white/5 w-24 h-24 rotate-12" />
                     <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">{s.l}</p>
                     <p className={`text-4xl font-black ${s.c} mb-1`}>{s.v}</p>
                     <p className="text-[9px] font-bold text-slate-600 uppercase">{s.sub}</p>
                  </div>
                ))}
              </div>

              <div className="glass-card p-8 rounded-[2.5rem] border-white/5">
                <h3 className="text-xl font-black mb-6 flex items-center gap-3"><History size={20} className="text-gold" /> آخر النشاطات</h3>
                <div className="space-y-4">
                  {tickets.slice(0, 5).map(t => (
                    <div key={t.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold"><MessageSquare size={18}/></div>
                        <div>
                          <p className="text-xs font-black">رسالة دعم من: {t.name}</p>
                          <p className="text-[10px] text-slate-500">{t.subject}</p>
                        </div>
                      </div>
                      <span className="text-[9px] text-slate-600 font-bold uppercase">{new Date(t.createdAt).toLocaleDateString('ar-EG')}</span>
                    </div>
                  ))}
                  {tickets.length === 0 && <p className="text-center text-slate-500 py-4 italic">لا توجد نشاطات حالية</p>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'news' && (
            <div className="space-y-10 animate-fade-in">
              <div className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-6">
                <h2 className="text-xl font-black text-gold">إضافة خبر جديد</h2>
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase mr-1">عنوان الخبر</label>
                     <input type="text" className="w-full bg-black/60 border border-white/10 p-4 rounded-xl outline-none" value={newNews.title} onChange={e=>setNewNews({...newNews, title:e.target.value})} />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase mr-1">التصنيف</label>
                     <select className="w-full bg-black/60 border border-white/10 p-4 rounded-xl outline-none" value={newNews.category} onChange={e=>setNewNews({...newNews, category:e.target.value})}>
                        <option>تحديث</option><option>حدث</option><option>تنبيه</option>
                     </select>
                   </div>
                   <div className="md:col-span-2 space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase mr-1">موجز الخبر</label>
                     <textarea className="w-full bg-black/60 border border-white/10 p-4 rounded-xl outline-none h-32" value={newNews.excerpt} onChange={e=>setNewNews({...newNews, excerpt:e.target.value})} />
                   </div>
                   <div className="md:col-span-2 space-y-4">
                     <label className="text-[10px] font-black text-slate-500 uppercase mr-1">صورة الخبر (اختياري)</label>
                     <div className="grid md:grid-cols-2 gap-4">
                        <input type="text" placeholder="أو ضع رابط صورة مباشر هنا..." className="w-full bg-black/60 border border-white/10 p-4 rounded-xl outline-none text-xs" value={newNews.thumbnailUrl} onChange={e=>setNewNews({...newNews, thumbnailUrl:e.target.value})} />
                        <button onClick={() => document.getElementById('news-img')?.click()} className="bg-white/5 border border-white/10 rounded-xl p-4 text-[10px] font-black uppercase hover:bg-white/10 transition-all flex items-center justify-center gap-2"><ImageIcon size={16}/> رفع من الجهاز</button>
                        <input id="news-img" type="file" className="hidden" onChange={async e => { if(e.target.files?.[0]) { const url = await apiService.uploadImage(e.target.files[0]); setNewNews({...newNews, thumbnailUrl: url}); }}} />
                     </div>
                   </div>
                </div>
                <button disabled={!newNews.title || isSaving} onClick={async ()=>{ setIsSaving(true); await addNews(newNews); setNewNews({title:'',excerpt:'',category:'تحديث',thumbnailUrl:''}); setIsSaving(false); showSuccess(); }} className="bg-gold text-black font-black px-8 py-4 rounded-xl w-full text-sm">نشر الخبر</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {news.map(n => (
                  <div key={n.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group">
                    <img src={n.thumbnailUrl || 'https://placehold.co/400x300/111111/ffd700?text=News'} className="w-16 h-16 rounded-lg object-cover" alt="n" />
                    <div className="flex-1">
                      <p className="font-black text-sm line-clamp-1">{n.title}</p>
                      <p className="text-[9px] text-slate-500 uppercase">{n.date}</p>
                    </div>
                    <button onClick={() => deleteNews(n.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'inbox' && (
            <div className="space-y-6 animate-fade-in">
              {tickets.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                  <Mail size={48} className="mx-auto text-slate-700 mb-4" />
                  <p className="text-slate-500 uppercase font-black text-xs">صندوق الوارد فارغ</p>
                </div>
              ) : (
                tickets.map(t => (
                  <div key={t.id} className="glass-card p-8 rounded-[2rem] border-white/5 space-y-4 relative overflow-hidden group">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold"><Mail size={24}/></div>
                        <div>
                          <h3 className="text-lg font-black">{t.subject}</h3>
                          <p className="text-xs text-slate-400">{t.name} ({t.email})</p>
                        </div>
                      </div>
                      <button onClick={() => deleteTicket(t.id)} className="text-red-500 hover:bg-red-500/10 p-3 rounded-xl transition-all"><Trash2 size={18}/></button>
                    </div>
                    <div className="bg-black/40 p-5 rounded-xl border border-white/5">
                      <p className="text-sm text-slate-300 leading-relaxed">{t.message}</p>
                    </div>
                    <div className="text-[10px] text-slate-600 font-black uppercase">{new Date(t.createdAt).toLocaleString('ar-EG')}</div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'system' && (
            <div className="grid lg:grid-cols-2 gap-8 animate-fade-in">
               <div className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-8">
                  <h3 className="text-xl font-black flex items-center gap-3"><Settings className="text-gold" /> الهوية المرئية</h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase">شعار الموقع (URL أو رفع)</label>
                      <div className="flex gap-2">
                        <input type="text" className="flex-1 bg-black/60 border border-white/10 p-4 rounded-xl outline-none text-xs" value={localSettings.logoUrl} onChange={e => setLocalSettings({...localSettings, logoUrl: e.target.value})} />
                        <button onClick={() => document.getElementById('logo-up')?.click()} className="bg-white/10 px-4 rounded-xl hover:bg-white/20"><ImageIcon size={18}/></button>
                        <input id="logo-up" type="file" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'logoUrl')} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase">خلفية الموقع (URL أو رفع)</label>
                      <div className="flex gap-2">
                        <input type="text" className="flex-1 bg-black/60 border border-white/10 p-4 rounded-xl outline-none text-xs" value={localSettings.heroBgUrl} onChange={e => setLocalSettings({...localSettings, heroBgUrl: e.target.value})} />
                        <button onClick={() => document.getElementById('bg-up')?.click()} className="bg-white/10 px-4 rounded-xl hover:bg-white/20"><ImageIcon size={18}/></button>
                        <input id="bg-up" type="file" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'heroBgUrl')} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/5">
                     <div className="flex items-center justify-between p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
                        <div className="flex items-center gap-3">
                           <AlertTriangle className="text-red-500" size={20} />
                           <div>
                              <p className="text-xs font-black">وضع الصيانة</p>
                              <p className="text-[9px] text-slate-500">إغلاق الموقع للزوار</p>
                           </div>
                        </div>
                        <input type="checkbox" className="w-5 h-5 accent-red-500" checked={localSettings.isMaintenanceMode} onChange={e => setLocalSettings({...localSettings, isMaintenanceMode: e.target.checked})} />
                     </div>
                     <textarea className="w-full bg-black/60 border border-white/10 p-4 rounded-xl h-24 text-xs" value={localSettings.maintenanceMessage} onChange={e => setLocalSettings({...localSettings, maintenanceMessage: e.target.value})} placeholder="رسالة الصيانة..." />
                  </div>
               </div>

               <div className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-6">
                  <h3 className="text-xl font-black flex items-center gap-3"><Smartphone className="text-gold" /> روابط المتاجر والـ QR</h3>
                  <div className="space-y-4">
                    <input type="text" placeholder="رابط Android" className="w-full bg-black/60 border border-white/10 p-4 rounded-xl text-xs" value={localSettings.androidUrl} onChange={e => setLocalSettings({...localSettings, androidUrl: e.target.value})} />
                    <input type="text" placeholder="رابط iOS" className="w-full bg-black/60 border border-white/10 p-4 rounded-xl text-xs" value={localSettings.iosUrl} onChange={e => setLocalSettings({...localSettings, iosUrl: e.target.value})} />
                    <input type="text" placeholder="بيانات الـ QR" className="w-full bg-black/60 border border-white/10 p-4 rounded-xl text-xs" value={localSettings.qrData} onChange={e => setLocalSettings({...localSettings, qrData: e.target.value})} />
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/5 animate-fade-in">
               <table className="w-full text-right">
                  <thead className="bg-white/5 text-[10px] font-black uppercase text-slate-500">
                    <tr>
                      <th className="p-6">البحار</th>
                      <th className="p-6">الرتبة</th>
                      <th className="p-6">تاريخ الانضمام</th>
                      <th className="p-6">تحكم</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {usersList.map(u => (
                      <tr key={u.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-6 flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold font-black">{u.email[0].toUpperCase()}</div>
                           <span className="text-sm">{u.email}</span>
                        </td>
                        <td className="p-6">
                           <select className="bg-black border border-white/10 rounded-lg text-[10px] p-2" value={u.role} onChange={async (e) => { await updateUserRole(u.id, e.target.value); fetchUsers(); showSuccess(); }}>
                              <option value="user">SAILOR</option>
                              <option value="admin">CAPTAIN</option>
                           </select>
                        </td>
                        <td className="p-6 text-[10px] text-slate-500">{new Date(u.created_at).toLocaleDateString('ar-EG')}</td>
                        <td className="p-6"><button className="text-red-500"><Trash2 size={16}/></button></td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-md mx-auto glass-card p-10 rounded-[3rem] text-center space-y-6 animate-fade-in">
               <div className="w-32 h-32 bg-gold/10 border-2 border-gold rounded-[2rem] flex items-center justify-center text-gold mx-auto relative group">
                  <User size={64} />
                  <div className="absolute -bottom-2 -right-2 bg-gold text-black p-2 rounded-xl"><Crown size={20}/></div>
               </div>
               <div>
                  <h2 className="text-2xl font-black">{user?.email}</h2>
                  <p className="text-gold text-[10px] font-black uppercase tracking-[0.3em] mt-1">{user?.role === 'admin' ? 'CAPTAIN OF THE FLEET' : 'SAILOR'}</p>
               </div>
               <button onClick={logout} className="w-full bg-red-500/10 text-red-500 py-4 rounded-2xl font-black text-xs uppercase hover:bg-red-500 hover:text-white transition-all">مغادرة السفينة</button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
