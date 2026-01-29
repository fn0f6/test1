
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Languages, Anchor, Shield, LogOut, User, Crown } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings, lang, setLang, t, user, isAdmin, navigateTo, logout } = useSettings();
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      lastScrollY.current = window.scrollY;
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          setIsScrolled(lastScrollY.current > 50);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
        isScrolled ? 'py-4' : 'py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div 
          className={`flex items-center justify-between h-16 md:h-20 px-8 transition-all duration-500 rounded-[2rem] border ${
            isScrolled 
              ? 'glass-card border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' 
              : 'bg-transparent border-transparent'
          }`}
        >
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => scrollToSection('hero')}>
             <img src={settings.logoUrl} alt="Logo" className="h-10 md:h-12 w-auto group-hover:scale-110 transition-transform duration-500" />
             <div className="h-8 w-[1px] bg-white/10 mx-2 hidden sm:block"></div>
             <img src="assets/icon-home.png" className="w-6 h-6 opacity-60 group-hover:opacity-100 transition-opacity hidden sm:block" alt="Home" onError={(e) => e.currentTarget.style.display = 'none'} />
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {['hero', 'news', 'showcase', 'downloads', 'support'].map((id) => (
              <button 
                key={id}
                onClick={() => scrollToSection(id)} 
                className="px-5 py-2 text-white/60 hover:text-gold font-bold text-[10px] uppercase tracking-[0.2em] transition-all"
              >
                {t[`nav${id.charAt(0).toUpperCase() + id.slice(1)}` as keyof typeof t]}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:border-gold/50 transition-all flex items-center gap-2"
            >
              <Languages size={16} className="text-gold" />
              <span className="text-[10px] font-black">{lang === 'en' ? 'AR' : 'EN'}</span>
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigateTo('admin')}
                  className={`hidden md:flex items-center gap-3 px-2 py-1.5 pr-5 rounded-2xl border transition-all ${isAdmin ? 'bg-gold/10 border-gold/30 hover:bg-gold/20' : 'bg-white/5 border-white/10 hover:border-gold/30'}`}
                >
                  <div className={`w-9 h-9 rounded-xl overflow-hidden border-2 flex items-center justify-center shrink-0 ${isAdmin ? 'border-gold shadow-lg shadow-gold/20' : 'border-white/20'}`}>
                    {user.avatar_url ? (
                      <img src={user.avatar_url} className="w-full h-full object-cover" alt="User" />
                    ) : (
                      <div className={isAdmin ? 'text-gold' : 'text-slate-400'}><User size={16} /></div>
                    )}
                  </div>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] font-black text-white uppercase tracking-wider mb-1 line-clamp-1">{user.display_name || user.email?.split('@')[0]}</span>
                    <div className="flex items-center gap-1">
                      {isAdmin ? <Crown size={10} className="text-gold" fill="currentColor" /> : <Anchor size={10} className="text-slate-500" />}
                      <span className={`text-[8px] font-black uppercase tracking-tighter ${isAdmin ? 'text-gold' : 'text-slate-500'}`}>
                        {isAdmin ? (lang === 'en' ? 'CAPTAIN' : 'قبطان') : (lang === 'en' ? 'SAILOR' : 'بحار')}
                      </span>
                    </div>
                  </div>
                </button>
                <button 
                  onClick={logout}
                  className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-all"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigateTo('login')}
                className="hidden md:flex btn-modern items-center gap-2 bg-gold px-8 h-12 rounded-xl text-black font-black text-xs tracking-widest shadow-xl hover:scale-105"
              >
                <Anchor size={14} />
                {lang === 'en' ? 'ENLIST / LOGIN' : 'دخول / تسجيل'}
              </button>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 bg-white/5 rounded-xl text-white"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 p-6 animate-fade-in-up">
          <div className="glass-card rounded-[2.5rem] p-8 border-white/10 space-y-4 shadow-2xl">
             {['hero', 'news', 'showcase', 'downloads', 'support'].map((id) => (
                <button 
                  key={id}
                  onClick={() => scrollToSection(id)} 
                  className="w-full py-4 text-left text-white font-black text-xl border-b border-white/5 uppercase tracking-widest hover:text-gold transition-colors"
                >
                  {t[`nav${id.charAt(0).toUpperCase() + id.slice(1)}` as keyof typeof t]}
                </button>
              ))}
              
              {!user && (
                <button 
                  onClick={() => navigateTo('login')}
                  className="w-full py-4 text-left text-gold font-black text-xl uppercase tracking-widest hover:text-white transition-colors"
                >
                  {lang === 'en' ? 'Enlist Now' : 'سجل الآن'}
                </button>
              )}
              
              {user && (
                <>
                  <button 
                    onClick={() => navigateTo('admin')}
                    className="w-full py-4 text-left text-gold font-black text-xl uppercase tracking-widest hover:text-white transition-colors"
                  >
                    {isAdmin ? (lang === 'en' ? 'Command Deck' : 'لوحة القيادة') : (lang === 'en' ? 'My Quarters' : 'ملفي الشخصي')}
                  </button>
                  <button 
                    onClick={logout}
                    className="w-full py-4 text-left text-red-500 font-black text-xl uppercase tracking-widest hover:text-white transition-colors"
                  >
                    {lang === 'en' ? 'Abandon Ship' : 'مغادرة السفينة'}
                  </button>
                </>
              )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
