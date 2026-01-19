
import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { Instagram, Twitter, MessageCircle, Send, Youtube, Globe, Facebook, Music, Ghost, Users } from 'lucide-react';

const Footer: React.FC = () => {
  const { settings, navigateTo, t } = useSettings();

  const socialPlatforms = [
    { key: 'whatsapp', icon: MessageCircle, color: 'hover:text-emerald-500', label: 'WhatsApp' },
    { key: 'whatsappGroup', icon: Users, color: 'hover:text-emerald-400', label: 'WhatsApp Group' },
    { key: 'telegram', icon: Send, color: 'hover:text-sky-500', label: 'Telegram' },
    { key: 'discord', icon: Globe, color: 'hover:text-indigo-500', label: 'Discord' },
    { key: 'instagram', icon: Instagram, color: 'hover:text-pink-500', label: 'Instagram' },
    { key: 'twitter', icon: Twitter, color: 'hover:text-slate-100', label: 'Twitter' },
    { key: 'youtube', icon: Youtube, color: 'hover:text-red-500', label: 'YouTube' },
    { key: 'facebook', icon: Facebook, color: 'hover:text-blue-600', label: 'Facebook' },
    { key: 'tiktok', icon: Music, color: 'hover:text-pink-400', label: 'TikTok' },
    { key: 'snapchat', icon: Ghost, color: 'hover:text-yellow-400', label: 'Snapchat' },
  ];

  return (
    <footer className="bg-wood-900 border-t border-wood-700 py-12 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-wood-pattern opacity-20 pointer-events-none"></div>
      
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
        <svg className="relative block w-[calc(100%+1.3px)] h-[30px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill={settings.siteBgColor} opacity="0.3"></path>
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill={settings.siteBgColor}></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center gap-16">
          
          <div className="flex flex-col items-center gap-6">
              <img src={settings.logoUrl} alt={settings.siteTitle} className="h-24 w-auto object-contain drop-shadow-2xl animate-float" />
              <div className="text-center space-y-2">
                <p className="text-wood-400 text-xs font-black uppercase tracking-[0.4em]">
                  {t.footerDesc}
                </p>
                <div className="h-1 w-20 bg-gold/40 mx-auto rounded-full"></div>
              </div>
          </div>

          {settings.socialLinks.showSocials && (
            <div className="w-full flex flex-col items-center gap-8">
               <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-gold/60">Connect With The Fleet</h4>
               <div className="flex flex-wrap justify-center gap-5 md:gap-6">
                 {socialPlatforms.map((platform) => {
                   const link = (settings.socialLinks as any)[platform.key];
                   const isActive = (settings.socialLinks.activeLinks as any)[platform.key];
                   
                   if (!link || !isActive) return null;
                   
                   return (
                     <a 
                       key={platform.key}
                       href={link.startsWith('http') ? link : platform.key === 'whatsapp' ? `https://wa.me/${link}` : `https://${link}`}
                       target="_blank"
                       rel="noopener noreferrer"
                       className={`w-14 h-14 flex items-center justify-center rounded-2xl bg-black/40 border border-white/5 text-wood-400 transition-all duration-300 transform hover:-translate-y-3 hover:border-gold/30 hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)] ${platform.color}`}
                       title={platform.label}
                     >
                       <platform.icon size={26} />
                     </a>
                   );
                 })}
               </div>
            </div>
          )}
          
          <div className="w-full border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
               <div className="text-wood-300 text-sm font-bold tracking-tight">
                 &copy; {new Date().getFullYear()} {settings.siteTitle}.
               </div>
               <p className="text-[10px] text-wood-500 font-medium uppercase tracking-[0.2em] mt-1">Authorized Official Portal</p>
            </div>
            
            <div className="flex gap-8 text-[10px] text-wood-500/40 font-black uppercase tracking-[0.3em]">
              <button onClick={() => navigateTo('login')} className="hover:text-gold/50 transition-colors">Access Cipher</button>
              <a href="#" className="hover:text-gold transition-colors">Ship Protocols</a>
              <a href="#" className="hover:text-gold transition-colors">Support Deck</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
