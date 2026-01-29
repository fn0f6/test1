
import React, { useEffect, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';
import { Calendar, ArrowUpRight, Clock } from 'lucide-react';

const NewsGrid: React.FC = () => {
  const { news, isLoading, t, lang } = useSettings();
  const newsGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once revealed, we don't need to observe it anymore
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '50px' });

    const revealElements = newsGridRef.current?.querySelectorAll('.reveal-on-scroll');
    revealElements?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [news, isLoading]);

  return (
    <section id="news" ref={newsGridRef} className="py-32 bg-[#050505] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] -z-0 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-0 -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8 reveal-on-scroll">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-black uppercase tracking-[0.3em]">
              Latest Broadcasts
            </div>
            <h2 className="text-5xl lg:text-7xl font-display font-black text-white tracking-tighter uppercase leading-none">
              {t.newsTitle}
            </h2>
            <p className="text-slate-400 text-lg max-w-xl leading-relaxed border-l-2 border-gold/30 pl-6 py-1">
              {t.newsSub}
            </p>
          </div>
          <button className="group flex items-center gap-3 bg-white/5 hover:bg-gold px-8 py-4 rounded-2xl border border-white/10 hover:border-gold transition-all duration-500">
            <span className="text-white group-hover:text-black font-black uppercase tracking-widest text-xs">Explore Archives</span>
            <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-black/20 flex items-center justify-center transition-colors">
              <ArrowUpRight size={16} className="text-gold group-hover:text-black" />
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {isLoading ? (
            [1, 2, 3].map(n => (
              <div key={n} className="h-[500px] rounded-[3rem] bg-white/5 animate-pulse border border-white/5"></div>
            ))
          ) : news.length === 0 ? (
            <div className="col-span-full py-32 text-center glass-card rounded-[3rem] border-dashed border-2 border-white/10">
              <p className="text-slate-500 font-display font-black text-2xl uppercase tracking-[0.2em]">
                {lang === 'en' ? 'The Horizon is Still' : 'الأفق هادئ حالياً'}
              </p>
            </div>
          ) : (
            news.map((item, idx) => (
              <article 
                key={item.id} 
                className="reveal-on-scroll group relative bg-[#0a0a0a] rounded-[3rem] overflow-hidden border border-white/5 hover:border-gold/40 transition-all duration-700 hover:-translate-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] will-change-transform"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src={item.thumbnailUrl} 
                    alt={item.title} 
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 group-hover:rotate-1 will-change-transform" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent"></div>
                  
                  <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                    <div className="px-5 py-2 rounded-2xl glass-card border-white/20 text-[10px] font-black text-white uppercase tracking-[0.2em] backdrop-blur-md">
                      {item.category}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gold/90 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                      <ArrowUpRight size={18} className="text-black" />
                    </div>
                  </div>
                </div>
                
                <div className="p-10 space-y-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-[10px] font-black text-gold/60 uppercase tracking-widest">
                      <Calendar size={14} className="text-gold" />
                      {item.date}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <Clock size={14} />
                      5 Min Read
                    </div>
                  </div>

                  <h3 className="text-3xl font-display font-black text-white leading-tight group-hover:text-gold transition-colors duration-500">
                    {item.title}
                  </h3>
                  
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 font-medium opacity-80">
                    {item.excerpt}
                  </p>
                  
                  <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                    <button className="text-white font-black text-[10px] uppercase tracking-[0.3em] group-hover:text-gold transition-colors flex items-center gap-2">
                      {t.newsBtnRead}
                      <div className="w-1 h-1 rounded-full bg-gold"></div>
                    </button>
                    <div className="flex -space-x-2">
                      {[1, 2].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0a0a0a] bg-white/10 overflow-hidden">
                          <img src={`https://i.pravatar.cc/100?u=${item.id}${i}`} className="w-full h-full object-cover" alt="avatar" loading="lazy" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 border-[1px] border-gold/0 group-hover:border-gold/20 rounded-[3rem] pointer-events-none transition-all duration-700"></div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsGrid;
