
import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { Shield, Map, MessageSquare, ShoppingCart, Trophy, Box } from 'lucide-react';

const GameShowcase: React.FC = () => {
  const { t, settings } = useSettings();

  const features = [
    { id: 'map', title: t.featMap, desc: t.featMapDesc, icon: <Map className="text-gold" size={24} />, img: settings.showcaseImages.map, delay: 0 },
    { id: 'rank', title: t.featRank, desc: t.featRankDesc, icon: <Trophy className="text-gold" size={24} />, img: settings.showcaseImages.rank, delay: 50 },
    { id: 'tasks', title: t.featTasks, desc: t.featTasksDesc, icon: <Shield className="text-gold" size={24} />, img: settings.showcaseImages.tasks, delay: 100 },
    { id: 'chat', title: t.featChat, desc: t.featChatDesc, icon: <MessageSquare className="text-gold" size={24} />, img: settings.showcaseImages.chat, delay: 150 },
    { id: 'store', title: t.featStore, desc: t.featStoreDesc, icon: <ShoppingCart className="text-gold" size={24} />, img: settings.showcaseImages.store, delay: 200 },
    { id: 'warehouse', title: t.featWarehouse, desc: t.featWarehouseDesc, icon: <Box className="text-gold" size={24} />, img: settings.showcaseImages.warehouse, delay: 250 }
  ];

  return (
    <section id="showcase" className="py-20 md:py-32 bg-[#050505] relative overflow-hidden scroll-mt-20">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.03),transparent_70%)] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 reveal-on-scroll">
        <div className="text-center mb-16 md:mb-24">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-gold/10 text-gold text-[10px] font-black uppercase tracking-[0.4em] mb-6">
             In-Game Snapshots
           </div>
           <h2 className="text-4xl md:text-7xl font-display font-black text-white mb-6 uppercase tracking-tighter leading-none">
             {t.showcaseTitle}
           </h2>
           <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto font-medium opacity-80">{t.showcaseSub}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-16 md:gap-y-20 gap-x-6 md:gap-x-10">
          {features.map((feat) => (
            <div 
              key={feat.id} 
              className="flex flex-col items-center group"
            >
              <div className="relative w-48 xs:w-56 md:w-64 lg:w-72 mb-8 transition-transform duration-700 group-hover:-translate-y-4 will-change-transform">
                <div className="relative z-20 aspect-[9/19.5] rounded-[2.5rem] md:rounded-[3rem] border-[6px] md:border-[10px] border-[#1a1a1a] shadow-[0_30px_80px_rgba(0,0,0,0.8)] overflow-hidden bg-[#0a0a0a] ring-1 ring-white/10">
                   <img 
                      src={feat.img} 
                      alt={feat.title} 
                      loading="lazy"
                      decoding="async"
                      onError={(e) => { 
                        const encodedText = encodeURIComponent(feat.title);
                        (e.target as HTMLImageElement).src = `https://placehold.co/800x1600/111111/ffd700?text=${encodedText}`; 
                      }}
                      className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 will-change-transform" 
                   />
                   <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none"></div>
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 md:w-28 h-4 md:h-6 bg-[#1a1a1a] rounded-b-xl md:rounded-b-2xl z-30"></div>
                </div>
                <div className="absolute inset-4 bg-gold/10 rounded-[3rem] blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
              </div>

              <div className="text-center space-y-2 px-4">
                <div className="flex justify-center mb-1">
                  <div className="p-2.5 rounded-xl bg-gold/5 border border-gold/10 text-gold scale-90 md:scale-100 transition-transform group-hover:scale-110">
                    {feat.icon}
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-display font-black text-white uppercase tracking-tight group-hover:text-gold transition-colors">{feat.title}</h3>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed max-w-[240px] mx-auto font-medium opacity-80">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GameShowcase;
