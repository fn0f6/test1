
import React, { useEffect, useState } from 'react';
import { useSettings } from '../context/SettingsContext';

const Hero: React.FC = () => {
  const { settings, t } = useSettings();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const headline = t?.heroHeadline || "Rule the Seas";
  const subheadline = t?.heroSubheadline || "Your adventure starts here.";

  return (
    <section id="hero" className={`relative min-h-[90vh] md:min-h-[95vh] flex items-center pt-24 overflow-hidden transition-all duration-1000 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-gold/10 rounded-full blur-[80px] md:blur-[120px] animate-glow-pulse pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 md:w-64 h-48 md:h-64 bg-emerald-500/10 rounded-full blur-[60px] md:blur-[100px] animate-glow-pulse delay-700 pointer-events-none"></div>

      <div className={`max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center reveal-on-scroll ${isMounted ? 'active' : ''}`}>
        <div className="space-y-8 md:space-y-10 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-gold/20 text-gold text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] mx-auto lg:mx-0">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
            Official Fleet Portal
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-display font-black text-white leading-[1.1] md:leading-[0.95] tracking-tighter drop-shadow-2xl">
            {headline.split(' ').map((word: string, i: number, arr: string[]) => (
               <React.Fragment key={i}>
                 <span className={i >= arr.length - 2 ? "text-gold text-glow" : "text-white"}>
                   {word}{' '}
                 </span>
               </React.Fragment>
            ))}
          </h1>
          
          <p className="text-base md:text-lg lg:text-xl text-slate-200 max-w-lg mx-auto lg:mx-0 leading-relaxed font-bold drop-shadow-lg">
            {subheadline}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 md:gap-5">
            <button 
              onClick={() => document.getElementById('downloads')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto btn-modern px-10 h-14 md:h-16 rounded-2xl bg-gold text-black font-display font-black tracking-widest text-base md:text-lg hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,215,0,0.3)]"
            >
              {t?.heroBtnDownload || "Get App"}
            </button>
            <button 
              onClick={() => document.getElementById('news')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto btn-modern px-10 h-14 md:h-16 rounded-2xl bg-white/10 border border-white/20 text-white font-display font-black tracking-widest text-base md:text-lg hover:bg-white/20 transition-all backdrop-blur-sm"
            >
              {t?.heroBtnLogs || "Logs"}
            </button>
          </div>
        </div>

        <div className="relative hidden lg:flex justify-end">
           <div className="animate-float">
             <div className="relative p-1 bg-gradient-to-tr from-gold/40 to-transparent rounded-[3rem] shadow-2xl overflow-hidden backdrop-blur-sm">
                <div className="w-[300px] h-[600px] bg-black/40 rounded-[2.8rem] border border-white/10 flex items-center justify-center overflow-hidden">
                   <img 
                      src={settings.logoUrl} 
                      className="w-40 h-auto animate-pulse" 
                      alt="Game Logo" 
                   />
                </div>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
