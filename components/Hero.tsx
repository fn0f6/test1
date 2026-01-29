
import React from 'react';
import { useSettings } from '../context/SettingsContext';

const Hero: React.FC = () => {
  const { settings, t } = useSettings();

  const headline = t?.heroHeadline || "Rule the Seas";
  const subheadline = t?.heroSubheadline || "Your adventure starts here.";

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-[#050505]">
      {/* Background Image Specific to Hero */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url('${settings.heroBgUrl}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/0 via-[#050505]/50 to-[#050505]"></div>
      </div>
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[120px] animate-glow-pulse pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-10 text-center lg:text-left animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-gold/20 text-gold text-[10px] font-black uppercase tracking-[0.3em] mx-auto lg:mx-0">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
            Official Fleet Portal
          </div>
          
          <h1 className="text-5xl md:text-8xl font-display font-black text-white leading-[0.95] tracking-tighter drop-shadow-2xl">
            {headline.split(' ').map((word: string, i: number, arr: string[]) => (
               <React.Fragment key={i}>
                 <span className={i >= arr.length - 2 ? "text-gold text-glow" : "text-white"}>
                   {word}{' '}
                 </span>
               </React.Fragment>
            ))}
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
            {subheadline}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
            <button 
              onClick={() => document.getElementById('downloads')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-10 h-16 rounded-2xl bg-gold text-black font-display font-black tracking-widest text-lg hover:scale-105 transition-all shadow-xl"
            >
              Get App
            </button>
            <button 
              onClick={() => document.getElementById('news')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-10 h-16 rounded-2xl bg-white/5 border border-white/10 text-white font-display font-black tracking-widest text-lg hover:bg-white/10 transition-all"
            >
              Fleet Logs
            </button>
          </div>
        </div>

        <div className="relative hidden lg:flex justify-end animate-float">
           <div className="relative p-1 bg-gradient-to-tr from-gold/40 to-transparent rounded-[3rem] shadow-2xl overflow-hidden">
              <div className="w-[300px] h-[600px] bg-black rounded-[2.8rem] border border-white/10 flex items-center justify-center">
                 <img src={settings.logoUrl} className="w-40 h-auto animate-pulse" alt="Logo" />
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
