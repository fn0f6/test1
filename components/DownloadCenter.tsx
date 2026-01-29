
import React from 'react';
import { Skull, Anchor, Smartphone, Apple } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const DownloadCenter: React.FC = () => {
  const { settings, t, lang } = useSettings();

  const qrSource = settings.customQrUrl || `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(settings.qrData || window.location.href)}`;

  return (
    <section id="downloads" className="py-32 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white/5 rounded-[4rem] p-12 md:p-24 border border-white/5 relative overflow-hidden">
          <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-5xl md:text-7xl font-display font-black text-white uppercase tracking-tighter leading-none">
                  {t.downloadTitle || 'انضم للأسطول'}
                </h2>
                <p className="text-xl text-slate-400 leading-relaxed font-medium">
                  {t.downloadSub || 'حمل اللعبة الآن وابدأ مغامرتك الكبرى في البحار السبعة.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-5">
                <a href={settings.androidUrl} className="flex items-center gap-4 bg-white text-black px-8 py-4 rounded-2xl font-black transition-transform hover:scale-105">
                  <Smartphone size={32} />
                  <div className="text-left">
                    <p className="text-[8px] uppercase">Get it on</p>
                    <p className="text-xl">Google Play</p>
                  </div>
                </a>
                <a href={settings.iosUrl} className="flex items-center gap-4 border border-white/20 text-white px-8 py-4 rounded-2xl font-black transition-transform hover:scale-105">
                  <Apple size={32} />
                  <div className="text-left">
                    <p className="text-[8px] uppercase">Download on</p>
                    <p className="text-xl">App Store</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl rotate-6 hover:rotate-0 transition-transform cursor-pointer">
                <img src={qrSource} alt="QR" className="w-48 h-48" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadCenter;
