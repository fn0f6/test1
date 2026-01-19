
import React from 'react';
import { useSettings } from '../context/SettingsContext';

const Hero: React.FC = () => {
  const { settings, t } = useSettings();

  // تأمين النص لضمان عدم حدوث خطأ Split
  const headline = t?.heroHeadline || "Rule the Seas";
  const subheadline = t?.heroSubheadline || "Your adventure starts here.";

  return (
    <section id="hero" className="relative min-h-[90vh] md:min-h-[95vh] flex items-center pt-24 overflow-hidden">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[20s] scale-110 animate-fade-in"
        style={{ backgroundImage: `url('${settings.heroBgUrl}')` }} 
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#050505]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-80 md:opacity-100"></div>
      </div>

      <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-gold/5 rounded-full blur-[80px] md:blur-[120px] animate-glow-pulse pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 md:w-64 h-48 md:h-64 bg-emerald-500/5 rounded-full blur-[60px] md:blur-[100px] animate-glow-pulse delay-700 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="space-y-8 md:space-y-10 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-gold/20 text-gold text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] mx-auto lg:mx-0 opacity-0 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
            Official Fleet Portal
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-display font-black text-white leading-[1.1] md:leading-[0.95] tracking-tighter opacity-0 animate-fade-in-up delay-100">
            {headline.split(' ').map((word: string, i: number, arr: string[]) => (
               <React.Fragment key={i}>
                 <span className={i >= arr.length - 2 ? "text-gold text-glow" : "text-white"}>
                   {word}{' '}
                 </span>
               </React.Fragment>
            ))}
          </h1>
          
          <p className="text-base md:text-lg lg:text-xl text-slate-300 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium opacity-0 animate-fade-in-up delay-200">
            {subheadline}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 md:gap-5 opacity-0 animate-fade-in-up delay-300">
            <button 
              onClick={() => document.getElementById('downloads')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto btn-modern px-10 h-14 md:h-16 rounded-2xl bg-gold text-black font-display font-black tracking-widest text-base md:text-lg hover:scale-105 transition-all shadow-xl"
            >
              {t?.heroBtnDownload || "Get App"}
            </button>
            <button 
              onClick={() => document.getElementById('news')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto btn-modern px-10 h-14 md:h-16 rounded-2xl bg-white/5 border border-white/10 text-white font-display font-black tracking-widest text-base md:text-lg hover:bg-white/10 transition-all"
            >
              {t?.heroBtnLogs || "Logs"}
            </button>
          </div>
        </div>

        <div className="relative hidden lg:flex justify-end opacity-0 animate-fade-in delay-500">
           <div className="animate-float">
             <div className="relative p-1 bg-gradient-to-tr from-gold/40 to-transparent rounded-[3rem] shadow-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1628172909436-e78a6358364d?auto=format&fit=crop&q=80&w=600" 
                  alt="" 
                  loading="eager"
                  className="w-full max-w-sm md:max-w-md object-contain rounded-[2.8rem] brightness-90 contrast-110 shadow-2xl rotate-2"
                />
             </div>
             <div className="absolute -bottom-6 -left-10 glass-card p-6 rounded-3xl border-gold/30 shadow-2xl animate-bounce delay-1000 hidden xl:block">
                <p className="text-gold font-black text-2xl">99%</p>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Success Rate</p>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
