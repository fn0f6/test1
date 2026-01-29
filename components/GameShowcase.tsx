
import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { Shield, Map, MessageSquare, ShoppingCart, Trophy, Box } from 'lucide-react';

const GameShowcase: React.FC = () => {
  const { t, settings } = useSettings();

  const features = [
    { id: 'map', title: t.featMap, desc: t.featMapDesc, icon: <Map className="text-gold" size={24} />, img: settings.showcaseImages.map },
    { id: 'rank', title: t.featRank, desc: t.featRankDesc, icon: <Trophy className="text-gold" size={24} />, img: settings.showcaseImages.rank },
    { id: 'tasks', title: t.featTasks, desc: t.featTasksDesc, icon: <Shield className="text-gold" size={24} />, img: settings.showcaseImages.tasks },
    { id: 'chat', title: t.featChat, desc: t.featChatDesc, icon: <MessageSquare className="text-gold" size={24} />, img: settings.showcaseImages.chat },
    { id: 'store', title: t.featStore, desc: t.featStoreDesc, icon: <ShoppingCart className="text-gold" size={24} />, img: settings.showcaseImages.store },
    { id: 'warehouse', title: t.featWarehouse, desc: t.featWarehouseDesc, icon: <Box className="text-gold" size={24} />, img: settings.showcaseImages.warehouse }
  ];

  return (
    <section id="showcase" className="py-32 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
           <h2 className="text-5xl md:text-7xl font-display font-black text-white uppercase tracking-tighter">
             {t.showcaseTitle || 'مميزات الأسطول'}
           </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {features.map((feat) => (
            <div key={feat.id} className="flex flex-col items-center group">
              <div className="relative w-64 mb-10 transition-transform group-hover:-translate-y-4">
                <div className="relative z-10 aspect-[9/19] rounded-[2.5rem] border-8 border-white/5 overflow-hidden shadow-2xl">
                   <img src={feat.img} className="w-full h-full object-cover" alt={feat.title} />
                </div>
                <div className="absolute inset-4 bg-gold/20 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity -z-0"></div>
              </div>
              <div className="text-center space-y-3">
                <div className="flex justify-center mb-2">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gold transition-transform group-hover:scale-110">
                    {feat.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-display font-black text-white uppercase">{feat.title}</h3>
                <p className="text-slate-500 text-sm max-w-xs">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GameShowcase;
