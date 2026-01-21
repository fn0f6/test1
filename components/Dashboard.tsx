
import React, { useState, useRef, useEffect } from 'react';
import { useSettings, SiteSettings, Language } from '../context/SettingsContext';
import { apiService } from '../services/api';
import { UserProfile } from '../types';
import { 
  BarChart3, Newspaper, Mail, Settings, LogOut, 
  Trash2, ShieldCheck, Globe, 
  Loader2, CheckCircle2, Save,
  Type as TypeIcon, Share2, 
  X, ArrowLeft, Image as ImageIcon,
  User, Camera, ExternalLink, Users, ShieldAlert, Anchor, Crown,
  MessageSquare, Smartphone, Youtube, Facebook, Send, Instagram, Twitter, Music, Ghost
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { 
    settings, updateSettings, tickets, news, addNews, deleteNews, deleteTicket,
    logout, isAdmin, user, updateUserProfile, getAllUsers, updateUserRole, navigateTo, lang
  } = useSettings();
  
  const [activeTab, setActiveTab] = useState<'stats' | 'news' | 'users' | 'system' | 'social' | 'content' | 'profile' | 'media' | 'inbox'>(isAdmin ? 'stats' : 'profile');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  const [editLang, setEditLang] = useState<Language>(lang);
  
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const refreshUsers = async () => { if (isAdmin) setUsersList(await getAllUsers()); };
  useEffect(() => { setLocalSettings(settings); if (activeTab === 'users' && isAdmin) refreshUsers(); }, [settings, activeTab, isAdmin]);

  const triggerSuccess = () => { setSaveSuccess(true); setTimeout(() => setSaveSuccess(false), 3000); };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, isShowcase = false) => {
    if (e.target.files && e.target.files[0]) {
      setIsSaving(true);
      try {
        const url = await apiService.uploadImage(e.target.files[0], isShowcase ? 'showcase' : 'assets');
        if (field === 'avatar') {
          await updateUserProfile({ avatar_url: url });
        } else if (isShowcase) {
          const updatedShowcase = { ...localSettings.showcaseImages, [field]: url };
          await updateSettings({ showcaseImages: updatedShowcase });
        } else {
          await updateSettings({ [field]: url });
        }
        triggerSuccess();
      } catch (err: any) { alert("Upload failed: " + err.message); } finally { setIsSaving(false); }
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try { await updateSettings(localSettings); triggerSuccess(); } 
    catch (e) { alert("Failed to save"); } finally { setIsSaving(false); }
  };

  const menuItems = isAdmin ? [
    { id: 'stats', label: 'الإحصائيات', icon: BarChart3 },
    { id: 'users', label: 'إدارة الطاقم', icon: Users },
    { id: 'news', label: 'الأخبار', icon: Newspaper },
    { id: 'inbox', label: 'الرسائل', icon: Mail },
    { id: 'media', label: 'الصور', icon: ImageIcon },
    { id: 'social', label: 'التواصل', icon: Share2 },
    { id: 'content', label: 'النصوص', icon: TypeIcon },
    { id: 'system', label: 'النظام', icon: Settings },
    { id: 'profile', label: 'ملفي', icon: User },
  ] : [{ id: 'profile', label: 'ملفي الشخصي', icon: User }];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#030303] text-slate-100 h-screen overflow-hidden font-arabic" dir="rtl">
      {saveSuccess && (
        <div className="fixed top-6 left-6 z-[200] flex items-center gap-3 bg-gold text-black px-6 py-4 rounded-2xl shadow-2xl animate-fade-in font-black uppercase text-[10px]">
          <CheckCircle2 size={16} /> تم التحديث بنجاح
        </div>
      )}
      
      <aside className={`fixed inset-y-0 right-0 w-72 bg-black border-l border-white/5 flex flex-col p-6 z-[150] transition-transform lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('site')}>
            <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center rotate-12 shadow-lg">
              <ShieldCheck className="text-black -rotate-12" size={24} />
            </div>
            <span className="font-display font-black text-xl uppercase text-white tracking-tighter">الأسطول</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-500"><X size={24} /></button>
        </div>

        <nav className="space-y-1 flex-1 overflow-y-auto custom-scrollbar">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id as any); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === item.id ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-slate-500 hover:bg-white/5'}`}>
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>
        
        <button onClick={logout} className="mt-4 flex items-center gap-4 px-4 py-4 text-red-500 font-black uppercase text-[10px] w-full hover:bg-red-500/10 rounded-2xl transition-all">
          <LogOut size={18} /> مغادرة السفينة
        </button>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-[#050505]">
        <header className="flex items-center justify-between p-6 border-b border-white/5 bg-black/40 backdrop-blur-xl shrink-0">
           <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 bg-white/5 rounded-lg"><ArrowLeft size={20} className="rotate-180" /></button>
           <h1 className="text-lg font-black uppercase text-white tracking-widest">{menuItems.find(m => m.id === activeTab)?.label}</h1>
           <div className="flex items-center gap-4">
              {isSaving && <Loader2 size={16} className="animate-spin text-gold" />}
              <button onClick={() => navigateTo('site')} className="px-4 py-2 bg-white/5 rounded-xl text-[9px] font-black uppercase border border-white/10 flex items-center gap-2 hover:bg-white/10">
                <ExternalLink size={14} /> معاينة الموقع
              </button>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 pb-32 custom-scrollbar">
          
          {activeTab === 'stats' && isAdmin && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
              <div className="glass-card p-8 rounded-[2.5rem] border-white/5 group hover:border-gold/30 transition-all">
                <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform"><Newspaper size={24}/></div>
                <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-2 font-black">أخبار الأسطول</p>
                <p className="text-5xl font-black text-white">{news.length}</p>
              </div>
              <div className="glass-card p-8 rounded-[2.5rem] border-white/5 group hover:border-emerald-500/30 transition-all">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform"><Mail size={24}/></div>
                <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-2 font-black">رسائل الدعم</p>
                <p className="text-5xl font-black text-white">{tickets.length}</p>
              </div>
              <div className="glass-card p-8 rounded-[2.5rem] border-white/5 group hover:border-sky-500/30 transition-all">
                <div className="w-12 h-12 bg-sky-500/10 rounded-2xl flex items-center justify-center text-sky-500 mb-6 group-hover:scale-110 transition-transform"><Users size={24}/></div>
                <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-2 font-black">إجمالي الطاقم</p>
                <p className="text-5xl font-black text-white">{usersList.length || '...'}</p>
              </div>
            </div>
          )}

          {activeTab === 'users' && isAdmin && (
            <div className="grid gap-4 animate-fade-in">
              {usersList.map(u => (
                <div key={u.id} className="glass-card p-6 rounded-3xl border-white/5 flex flex-col md:flex-row items-center gap-6">
                  <div className={`w-16 h-16 rounded-2xl bg-wood-900 border-2 overflow-hidden shrink-0 ${u.role === 'admin' ? 'border-gold shadow-lg shadow-gold/20' : 'border-white/10'}`}>
                    {u.avatar_url ? <img src={u.avatar_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-700"><User size={24}/></div>}
                  </div>
                  <div className="flex-1 text-center md:text-right">
                    <p className="font-black text-white text-lg flex items-center justify-center md:justify-start gap-2">
                      {u.display_name || 'قبطان'} 
                      {u.role === 'admin' && <Crown size={14} className="text-gold" />}
                    </p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </div>
                  <button 
                    onClick={() => {
                      if (u.id === user?.id) return alert("لا يمكنك تغيير رتبة نفسك!");
                      const nextRole = u.role === 'admin' ? 'user' : 'admin';
                      if (confirm(`تغيير رتبة المستخدم إلى ${nextRole === 'admin' ? 'قبطان' : 'بحار'}؟`)) {
                        updateUserRole(u.id, nextRole).then(refreshUsers);
                      }
                    }} 
                    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${u.role === 'admin' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-gold text-black shadow-lg shadow-gold/20'}`}
                  >
                    {u.role === 'admin' ? 'خفض الرتبة ⚓' : 'ترقية لقبطان 👑'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'media' && isAdmin && (
            <div className="space-y-10 animate-fade-in">
              <div className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-8">
                 <h3 className="text-xl font-black text-white">إدارة صور الموقع</h3>
                 <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">شعار الموقع (Logo)</label>
                      <div className="relative aspect-video rounded-3xl bg-black/40 border-2 border-dashed border-white/10 overflow-hidden flex items-center justify-center group cursor-pointer" onClick={() => fileRefs.current.logo?.click()}>
                        {localSettings.logoUrl ? <img src={localSettings.logoUrl} className="max-h-24 object-contain" /> : <ImageIcon size={32} className="text-slate-700" />}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Camera size={24} className="text-gold" /></div>
                        {/* Fix: Wrap ref assignment in braces to ensure it returns void, fixing TS error on line 180 */}
                        <input type="file" ref={el => { fileRefs.current.logo = el; }} className="hidden" onChange={e => handleFileUpload(e, 'logoUrl')} />
                      </div>
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">خلفية الواجهة (Hero BG)</label>
                      <div className="relative aspect-video rounded-3xl bg-black/40 border-2 border-dashed border-white/10 overflow-hidden group cursor-pointer" onClick={() => fileRefs.current.hero?.click()}>
                        {localSettings.heroBgUrl ? <img src={localSettings.heroBgUrl} className="w-full h-full object-cover" /> : <ImageIcon size={32} className="text-slate-700" />}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Camera size={24} className="text-gold" /></div>
                        {/* Fix: Wrap ref assignment in braces to ensure it returns void, fixing TS error on line 188 */}
                        <input type="file" ref={el => { fileRefs.current.hero = el; }} className="hidden" onChange={e => handleFileUpload(e, 'heroBgUrl')} />
                      </div>
                   </div>
                 </div>
                 <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">صور عرض اللعبة (Showcase Images)</label>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                      {Object.keys(localSettings.showcaseImages).map((key) => (
                        <div key={key} className="space-y-2">
                          <p className="text-[8px] font-black uppercase text-center text-slate-600">{key}</p>
                          <div className="relative aspect-[9/16] rounded-xl bg-black/40 border border-white/5 overflow-hidden group cursor-pointer" onClick={() => (fileRefs.current as any)[key]?.click()}>
                             <img src={(localSettings.showcaseImages as any)[key]} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Camera size={16} className="text-gold" /></div>
                             {/* Fix: Wrap ref assignment in braces to ensure it returns void, fixing TS error on line 201 */}
                             <input type="file" ref={el => { (fileRefs.current as any)[key] = el; }} className="hidden" onChange={e => handleFileUpload(e, key, true)} />
                          </div>
                        </div>
                      ))}
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'inbox' && isAdmin && (
            <div className="space-y-6 animate-fade-in">
              {tickets.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                   <Mail className="mx-auto text-slate-800 mb-4" size={48} />
                   <p className="text-slate-500 font-black uppercase text-xs tracking-widest">صندوق الوارد فارغ</p>
                </div>
              ) : (
                tickets.map(t => (
                  <div key={t.id} className="glass-card p-6 md:p-8 rounded-[2.5rem] border-white/5 flex flex-col md:flex-row items-start gap-6 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-1.5 h-full bg-gold/40"></div>
                    <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0"><MessageSquare size={24} /></div>
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-center">
                         <h4 className="text-xl font-black text-white">{t.subject}</h4>
                         <span className="text-[9px] font-black text-slate-500 uppercase">{new Date(t.createdAt).toLocaleDateString('ar-EG')}</span>
                      </div>
                      <p className="text-xs text-gold font-bold">{t.name} ({t.email})</p>
                      <p className="text-slate-400 text-sm leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5 italic">{t.message}</p>
                    </div>
                    <button onClick={() => { if(confirm("حذف الرسالة؟")) deleteTicket(t.id); }} className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"><Trash2 size={20}/></button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'social' && isAdmin && (
            <div className="max-w-4xl space-y-10 animate-fade-in">
              <div className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-10">
                 <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-white">روابط التواصل الاجتماعي</h3>
                    <div className="flex items-center gap-3 p-1.5 bg-black/40 rounded-xl border border-white/10">
                       <span className="text-[9px] font-black text-slate-500 uppercase px-2">عرض في الموقع</span>
                       <button onClick={() => setLocalSettings({...localSettings, socialLinks: {...localSettings.socialLinks, showSocials: !localSettings.socialLinks.showSocials}})} className={`w-12 h-6 rounded-full transition-all relative ${localSettings.socialLinks.showSocials ? 'bg-gold' : 'bg-slate-800'}`}>
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${localSettings.socialLinks.showSocials ? 'right-7' : 'right-1'}`}></div>
                       </button>
                    </div>
                 </div>

                 <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                    {[
                      { key: 'whatsapp', icon: MessageSquare, color: 'text-emerald-500' },
                      { key: 'whatsappGroup', icon: Users, color: 'text-emerald-400' },
                      { key: 'telegram', icon: Send, color: 'text-sky-500' },
                      { key: 'instagram', icon: Instagram, color: 'text-pink-500' },
                      { key: 'twitter', icon: Twitter, color: 'text-white' },
                      { key: 'youtube', icon: Youtube, color: 'text-red-500' },
                      { key: 'facebook', icon: Facebook, color: 'text-blue-500' },
                      { key: 'tiktok', icon: Music, color: 'text-white' },
                      { key: 'snapchat', icon: Ghost, color: 'text-yellow-400' }
                    ].map(platform => (
                      <div key={platform.key} className="space-y-3">
                         <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                               <platform.icon size={14} className={platform.color} /> {platform.key}
                            </label>
                            <input type="checkbox" checked={(localSettings.socialLinks.activeLinks as any)[platform.key]} onChange={e => {
                               const newActive = { ...localSettings.socialLinks.activeLinks, [platform.key]: e.target.checked };
                               setLocalSettings({ ...localSettings, socialLinks: { ...localSettings.socialLinks, activeLinks: newActive as any } });
                            }} className="accent-gold w-4 h-4" />
                         </div>
                         <input type="text" value={(localSettings.socialLinks as any)[platform.key]} onChange={e => {
                            setLocalSettings({ ...localSettings, socialLinks: { ...localSettings.socialLinks, [platform.key]: e.target.value } });
                         }} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs outline-none focus:border-gold/30" placeholder="Username / Link" />
                      </div>
                    ))}
                 </div>
                 <button onClick={handleSaveSettings} className="w-full py-4 bg-gold text-black font-black uppercase rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-gold/10 hover:scale-[1.02] transition-all"><Save size={18}/> حفظ الروابط</button>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
             <div className="max-w-xl mx-auto space-y-10 animate-fade-in text-center">
              <div className="relative inline-block mb-10">
                <div className={`w-36 h-36 rounded-[3rem] bg-wood-900 border-4 overflow-hidden shadow-2xl transition-all ${isAdmin ? 'border-gold scale-110 shadow-gold/20' : 'border-white/10'}`}>
                   {user?.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gold/10"><User size={56} /></div>}
                </div>
                <button onClick={() => fileRefs.current.avatar?.click()} className="absolute -bottom-2 -right-2 w-12 h-12 bg-gold text-black rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-all border-4 border-black"><Camera size={20} /></button>
                <input type="file" ref={el => { fileRefs.current.avatar = el; }} className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'avatar')} />
              </div>

              <div className="glass-card p-8 rounded-[3rem] border-white/5 space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                     {isAdmin ? <Crown size={14} className="text-gold" fill="currentColor" /> : <Anchor size={14} className="text-slate-500" />}
                     <span className={`text-[10px] font-black uppercase tracking-widest ${isAdmin ? 'text-gold' : 'text-slate-500'}`}>{isAdmin ? 'قبطان الأسطول' : 'عضو في الطاقم'}</span>
                  </div>
                  <h2 className="text-3xl font-black text-white">{user?.display_name || 'قبطان'}</h2>
                  <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
                </div>

                <div className="space-y-3 text-right">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 mr-2">تغيير اسم العرض</label>
                  <input type="text" defaultValue={user?.display_name} onBlur={e => updateUserProfile({ display_name: e.target.value }).then(triggerSuccess)} className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-gold/30" />
                </div>
              </div>
            </div>
          )}

          {/* ... بقية الأقسام (News, Content, System) ... */}
          {activeTab === 'news' && isAdmin && (
            <div className="space-y-10 animate-fade-in">
              <div className="glass-card p-8 rounded-[2rem] border-white/5 space-y-6">
                <h3 className="text-lg font-black text-white">إضافة خبر جديد</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <input type="text" placeholder="عنوان الخبر" className="bg-black/40 border border-white/10 rounded-xl px-4 py-3" id="n_title" />
                  <input type="text" placeholder="التصنيف" className="bg-black/40 border border-white/10 rounded-xl px-4 py-3" id="n_cat" defaultValue="تحديث" />
                </div>
                <textarea placeholder="مقتطف الخبر..." rows={3} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3" id="n_exc"></textarea>
                <button onClick={async () => {
                  const t = (document.getElementById('n_title') as any).value;
                  const c = (document.getElementById('n_cat') as any).value;
                  const e = (document.getElementById('n_exc') as any).value;
                  if(!t) return alert("العنوان مطلوب");
                  await addNews({ title: t, category: c, excerpt: e, thumbnailUrl: 'https://images.unsplash.com/photo-1589710780350-12acb8925529?auto=format&fit=crop&q=80&w=800' });
                  triggerSuccess();
                  (document.getElementById('n_title') as any).value = '';
                }} className="w-full py-4 bg-gold text-black font-black uppercase rounded-xl shadow-lg">نشر الخبر</button>
              </div>
              <div className="grid gap-4">
                {news.map(n => (
                  <div key={n.id} className="glass-card p-4 rounded-2xl border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4"><img src={n.thumbnailUrl} className="w-16 h-16 rounded-xl object-cover" /><div><p className="font-bold text-sm">{n.title}</p><p className="text-[10px] text-slate-500">{n.date}</p></div></div>
                    <button onClick={() => deleteNews(n.id)} className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl"><Trash2 size={18}/></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'content' && isAdmin && (
            <div className="space-y-8 animate-fade-in">
               <div className="flex gap-4 p-2 bg-black/40 rounded-2xl border border-white/10 w-fit">
                  <button onClick={() => setEditLang('ar')} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${editLang === 'ar' ? 'bg-gold text-black' : 'text-slate-500 hover:text-white'}`}>العربية</button>
                  <button onClick={() => setEditLang('en')} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${editLang === 'en' ? 'bg-gold text-black' : 'text-slate-500 hover:text-white'}`}>English</button>
               </div>
               <div className="grid md:grid-cols-2 gap-6">
                  {Object.keys(localSettings.translations[editLang] || {}).map(key => (
                    <div key={key} className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-600 tracking-widest mr-1">{key}</label>
                      <input type="text" value={localSettings.translations[editLang][key]} onChange={e => {
                        const newTrans = { ...localSettings.translations };
                        newTrans[editLang][key] = e.target.value;
                        setLocalSettings({ ...localSettings, translations: newTrans });
                      }} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs" />
                    </div>
                  ))}
               </div>
               <button onClick={handleSaveSettings} className="w-full py-4 bg-gold text-black font-black uppercase rounded-2xl shadow-xl flex items-center justify-center gap-2"><Save size={18}/> حفظ النصوص</button>
            </div>
          )}

          {activeTab === 'system' && isAdmin && (
            <div className="max-w-3xl space-y-10 animate-fade-in">
               <div className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-8">
                  <h3 className="text-xl font-black text-white">إعدادات النظام والروابط</h3>
                  <div className="space-y-6">
                    <label className="flex items-center gap-4 p-5 bg-black/40 rounded-3xl border border-white/5 cursor-pointer hover:border-gold/30 transition-all">
                      <input type="checkbox" checked={localSettings.isMaintenanceMode} onChange={e => setLocalSettings({...localSettings, isMaintenanceMode: e.target.checked})} className="w-6 h-6 accent-gold" />
                      <div className="flex-1">
                        <p className="text-sm font-black text-white uppercase tracking-wider">وضع الصيانة (Maintenance Mode)</p>
                        <p className="text-[10px] text-slate-500 uppercase mt-0.5">عند تفعيله، لن يتمكن البحارة من دخول الموقع.</p>
                      </div>
                    </label>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest mr-1">رسالة الصيانة</label>
                       <textarea placeholder="رسالة الصيانة..." value={localSettings.maintenanceMessage} onChange={e => setLocalSettings({...localSettings, maintenanceMessage: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-sm"></textarea>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest flex items-center gap-2"><Smartphone size={12}/> رابط الأندرويد</label>
                          <input type="text" placeholder="Android Store Link" value={localSettings.androidUrl} onChange={e => setLocalSettings({...localSettings, androidUrl: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-xs" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest flex items-center gap-2"><Smartphone size={12}/> رابط الـ iOS</label>
                          <input type="text" placeholder="iOS Store Link" value={localSettings.iosUrl} onChange={e => setLocalSettings({...localSettings, iosUrl: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-xs" />
                       </div>
                    </div>
                  </div>
                  <button onClick={handleSaveSettings} className="w-full py-4 bg-gold text-black font-black uppercase rounded-2xl shadow-xl flex items-center justify-center gap-2"><Save size={18}/> حفظ النظام</button>
               </div>
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
