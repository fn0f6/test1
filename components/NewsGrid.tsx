
import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { Calendar, ArrowUpRight } from 'lucide-react';

const NewsGrid: React.FC = () => {
  const { news, isLoading, t, lang } = useSettings();

  return (
    <section id="news" className="py-32 bg-[#050505] relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-24 space-y-4">
          <h2 className="text-5xl md:text-7xl font-display font-black text-white tracking-tighter uppercase leading-none">
            {t.newsTitle || 'آخر الأخبار'}
          </h2>
          <div className="h-1.5 w-24 bg-gold mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {isLoading ? (
            [1, 2, 3].map(n => (
              <div key={n} className="h-96 rounded-[2.5rem] bg-white/5 animate-pulse"></div>
            ))
          ) : (
            news.map((item) => (
              <article key={item.id} className="group bg-white/5 rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-gold/30 transition-all hover:-translate-y-2">
                <div className="relative h-60 overflow-hidden">
                  <img src={item.thumbnailUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4 px-4 py-1.5 rounded-xl glass-card text-[10px] font-black text-white uppercase tracking-widest">
                    {item.category}
                  </div>
                </div>
                <div className="p-8 space-y-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                  <div className="flex items-center gap-2 text-[10px] font-black text-gold/60 uppercase">
                    <Calendar size={14} /> {item.date}
                  </div>
                  <h3 className="text-2xl font-display font-black text-white group-hover:text-gold transition-colors">{item.title}</h3>
                  <p className="text-slate-400 text-sm line-clamp-2">{item.excerpt}</p>
                  <button className="pt-4 flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all">
                    Read More <ArrowUpRight size={14} className="text-gold" />
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsGrid;
