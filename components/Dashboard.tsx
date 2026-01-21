
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
  User, Camera, ExternalLink, Users, ShieldAlert, ShieldCheck as ShieldOk, Anchor, Crown
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { 
    settings, updateSettings, tickets, news, addNews, deleteNews, 
    logout, isAdmin, user, updateUserProfile, getAllUsers, updateUserRole, navigateTo, lang
  } = useSettings();
  
  const [activeTab, setActiveTab] = useState<'stats' | 'news' | 'users' | 'system' | 'social' | 'content' | 'profile'>(isAdmin ? 'stats' : 'profile');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const refreshUsers = async () => { 
    if (isAdmin) {
      const data = await getAllUsers();
      setUsersList(data);
    }
  };

  useEffect(() => { 
    setLocalSettings(settings); 
    if (activeTab === 'users' && isAdmin) refreshUsers(); 
  }, [settings, activeTab, isAdmin]);

  const triggerSuccess = () => { setSaveSuccess(true); setTimeout(() => setSaveSuccess(false), 3000); };

  const handleUpdateRole = async (targetUserId: string, currentRole: string) => {
    if (targetUserId === user?.id) {
      alert("⚠️ لا يمكنك خفض رتبة نفسك، يجب أن يقوم أدمن آخر بذلك!");
      return;
    }
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const confirmMsg = newRole === 'admin' 
      ? "هل أنت متأكد من ترقية هذا العضو إلى (قبطان - أدمن)؟ سيملك صلاحيات كاملة." 
      : "هل أنت متأكد من خفض رتبة هذا العضو إلى (بحار - مستخدم عادي)؟";

    if (window.confirm(confirmMsg)) {
      setIsSaving(true);
      try { 
        await updateUserRole(targetUserId, newRole); 
        await refreshUsers(); 
        triggerSuccess(); 
      } catch (e) { 
        alert("فشل تحديث الرتبة"); 
      } finally { 
        setIsSaving(false); 
      }
    }
  };

  const menuItems = isAdmin ? [
    { id: 'stats', label: 'الإحصائيات', icon: BarChart3 },
    { id: 'users', label: 'إدارة الطاقم', icon: Users },
    { id: 'news', label: 'الأخبار', icon: Newspaper },
    { id: 'content', label: 'نصوص الموقع', icon: TypeIcon },
    { id: 'system', label: 'إعدادات النظام', icon: Settings },
    { id: 'profile', label: 'ملفي الشخصي', icon: User },
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
          
          {activeTab === 'users' && isAdmin && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-white">إدارة طاقم السفينة</h2>
                  <p className="text-slate-500 text-xs mt-1">يمكنك ترقية البحارة أو خفض رتبهم من هنا.</p>
                </div>
                <button onClick={refreshUsers} className="p-3 bg-white/5 rounded-xl text-gold hover:bg-gold hover:text-black transition-all">
                  <BarChart3 size={20} />
                </button>
              </div>

              <div className="grid gap-4">
                {usersList.length === 0 ? (
                  <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
                    <Loader2 className="animate-spin mx-auto text-gold mb-4" size={32} />
                    <p className="text-slate-500 font-black uppercase text-[10px]">جاري استدعاء الطاقم...</p>
                  </div>
                ) : (
                  usersList.map(u => (
                    <div key={u.id} className="glass-card p-5 md:p-6 rounded-[2rem] border-white/5 flex flex-col md:flex-row items-center gap-6 hover:border-white/10 transition-all">
                      {/* الصورة الشخصية */}
                      <div className="relative shrink-0">
                        <div className={`w-16 h-16 rounded-2xl bg-wood-900 border-2 overflow-hidden ${u.role === 'admin' ? 'border-gold shadow-[0_0_15px_rgba(255,215,0,0.2)]' : 'border-white/10'}`}>
                          {u.avatar_url ? <img src={u.avatar_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-700"><User size={28}/></div>}
                        </div>
                        {u.role === 'admin' && (
                          <div className="absolute -top-2 -right-2 bg-gold text-black p-1 rounded-lg shadow-xl">
                            <Crown size={12} fill="currentColor" />
                          </div>
                        )}
                      </div>

                      {/* البيانات */}
                      <div className="flex-1 text-center md:text-right">
                        <div className="flex flex-col md:flex-row items-center gap-2 mb-1">
                          <p className="font-black text-white text-lg">{u.display_name || 'قبطان مجهول'}</p>
                          <span className={`px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter ${u.role === 'admin' ? 'bg-gold text-black' : 'bg-slate-800 text-slate-400'}`}>
                            {u.role === 'admin' ? 'إدارة (Admin)' : 'عضو (User)'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">{u.email}</p>
                        <p className="text-[9px] text-slate-600 mt-1 uppercase tracking-widest">انضم في: {u.created_at ? new Date(u.created_at).toLocaleDateString('ar-EG') : 'غير معروف'}</p>
                      </div>

                      {/* الأزرار والأدلة */}
                      <div className="flex items-center gap-3">
                        {u.role === 'admin' ? (
                          <button 
                            onClick={() => handleUpdateRole(u.id, u.role)}
                            className="flex items-center gap-2 px-5 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all group"
                          >
                            <ShieldAlert size={14} className="group-hover:rotate-12 transition-transform" /> خفض للرتبة ⚓
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleUpdateRole(u.id, u.role)}
                            className="flex items-center gap-2 px-5 py-3 bg-gold/10 text-gold border border-gold/20 rounded-2xl text-[10px] font-black uppercase hover:bg-gold hover:text-black transition-all group shadow-lg"
                          >
                            <Crown size={14} className="group-hover:scale-125 transition-transform" /> ترقية لأدمن 👑
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

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

          {/* ... بقية الأقسام (Content, System, Profile) كما كانت ... */}
          {activeTab === 'profile' && (
             <div className="max-w-xl mx-auto space-y-10 animate-fade-in">
              <div className="text-center space-y-6">
                <div className="relative inline-block">
                  <div className={`w-36 h-36 rounded-[3rem] bg-wood-900 border-4 overflow-hidden shadow-2xl ${isAdmin ? 'border-gold' : 'border-white/10'}`}>
                     {user?.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gold/10"><User size={56} /></div>}
                  </div>
                  <button onClick={() => fileRefs.current.avatar?.click()} className="absolute -bottom-2 -right-2 w-12 h-12 bg-gold text-black rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-all"><Camera size={20} /></button>
                  <input type="file" ref={el => { fileRefs.current.avatar = el; }} className="hidden" accept="image/*" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white mb-2">{user?.display_name || 'قبطان'}</h2>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                     {isAdmin ? <Crown size={14} className="text-gold" /> : <Anchor size={14} className="text-slate-500" />}
                     <span className={`text-[10px] font-black uppercase tracking-widest ${isAdmin ? 'text-gold' : 'text-slate-500'}`}>{isAdmin ? 'قبطان الأسطول (أدمن)' : 'عضو في الطاقم'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
