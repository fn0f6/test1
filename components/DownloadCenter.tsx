
import React from 'react';
import { Download, Skull, Anchor, Smartphone, Apple } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const DownloadCenter: React.FC = () => {
  const { settings, t, lang } = useSettings();

  // تحديد مصدر صورة الـ QR
  // 1. إذا كان هناك صورة مرفوعة يدوياً
  // 2. إذا كان هناك رابط مخصص لتوليد الـ QR
  // 3. الرابط الحالي للموقع كخيار افتراضي
  const qrSource = settings.customQrUrl || `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(settings.qrData || window.location.href)}`;

  return (
    <section id="downloads" className="py-24 bg-ocean-950 scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.9)] border border-wood-500/20 group">
            {/* استخدام صورة السفن كخلفية بدلاً من رابط Unsplash */}
            <div className="absolute inset-0 bg-cover bg-center z-0 opacity-20 group-hover:scale-105 transition-transform duration-[2000ms]" style={{ backgroundImage: "url('assets/ships_at_sea.png')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-b from-ocean-900/98 via-ocean-950/95 to-ocean-950 z-0"></div>

            <div className="relative z-10 p-8 md:p-20">
              <div className="text-center mb-20 animate-fade-in-up">
                <div className="inline-block relative px-12 py-6 mb-10">
                   <div className="absolute inset-0 bg-wood-800 border-2 border-wood-500 rounded-2xl transform -rotate-2 shadow-2xl"></div>
                   <div className="relative z-10 flex items-center gap-8">
                     <Skull className="text-gold/60 animate-pulse hidden sm:block" size={40} />
                     <h2 className="text-4xl md:text-7xl font-display font-black text-white text-shadow-black tracking-tight uppercase">{t.downloadTitle}</h2>
                     <Skull className="text-gold/60 animate-pulse hidden sm:block" size={40} />
                   </div>
                </div>
                <p className="text-wood-100 text-xl md:text-2xl max-w-3xl mx-auto text-shadow-black font-medium leading-relaxed opacity-80">
                  {t.downloadSub}
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-20 items-center">
                <div className="relative flex flex-col items-center text-center group/card transition-all duration-700">
                   <div className="absolute inset-0 bg-parchment transform rotate-1 rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.4)] border-t-[10px] border-b-[10px] border-wood-400 group-hover/card:rotate-0 transition-transform duration-500"></div>
                   
                   <div className="relative z-10 w-full p-12 md:p-16 lg:p-20">
                      <div className="flex justify-center mb-10">
                         <div className="w-28 h-28 rounded-3xl border-4 border-wood-600 flex items-center justify-center p-5 bg-wood-200 shadow-inner animate-float">
                            <Anchor className="text-wood-900" size={56} />
                         </div>
                      </div>

                      <h3 className="text-5xl font-display font-black text-wood-900 mb-4 tracking-tight uppercase">{settings.siteTitle}</h3>
                      <p className="text-wood-700 font-serif italic mb-12 border-b-2 border-wood-400/30 pb-6 mx-10 text-xl uppercase tracking-[0.3em]">{t.storeBadge}</p>

                      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <a href={settings.androidUrl} className="flex items-center gap-4 bg-black text-white px-8 py-4 rounded-2xl border-2 border-white/10 hover:border-gold/50 transition-all shadow-2xl w-full sm:w-auto min-w-[260px] group/store">
                          <Smartphone className="text-gold" size={36} />
                          <div className={`text-left ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                            <p className="text-[10px] uppercase font-black tracking-widest text-wood-400 leading-none mb-1">{lang === 'en' ? 'Get it on' : 'احصل عليه من'}</p>
                            <p className="text-2xl font-bold leading-none">{t.storeGooglePlay}</p>
                          </div>
                        </a>
                        <a href={settings.iosUrl} className="flex items-center gap-4 bg-black text-white px-8 py-4 rounded-2xl border-2 border-white/10 hover:border-gold/50 transition-all shadow-2xl w-full sm:w-auto min-w-[260px] group/store">
                          <Apple className="text-gold" size={36} />
                          <div className={`text-left ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                            <p className="text-[10px] uppercase font-black tracking-widest text-wood-400 leading-none mb-1">{lang === 'en' ? 'Download on' : 'حمل من'}</p>
                            <p className="text-2xl font-bold leading-none">{t.storeAppStore}</p>
                          </div>
                        </a>
                      </div>
                   </div>
                </div>

                <div className="space-y-12 animate-fade-in-up delay-300">
                  <div className="bg-wood-800/40 backdrop-blur-md p-12 rounded-[2.5rem] border border-wood-600/30 shadow-2xl flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group/qr hover:bg-wood-800/60 transition-colors">
                    <div className="absolute inset-0 bg-wood-pattern opacity-5"></div>
                    <div className="bg-white p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10 rotate-6 group-hover/qr:rotate-0 transition-transform duration-700 shrink-0">
                      <img src={qrSource} alt="QR" className="w-36 h-36" />
                    </div>
                    <div className="relative z-10 text-center md:text-left">
                      <h4 className="text-gold font-display font-black text-4xl mb-4 tracking-wide uppercase">{t.downloadQuickDeploy}</h4>
                      <p className="text-wood-100 text-lg leading-relaxed opacity-90 font-medium max-w-sm">
                        {t.downloadQuickDeploySub}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadCenter;
