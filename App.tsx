
import React, { Suspense, lazy } from 'react';
import { useSettings, SettingsProvider } from './context/SettingsContext';
import Header from './components/Header';
import Hero from './components/Hero';
import NewsGrid from './components/NewsGrid';
import GameShowcase from './components/GameShowcase';
import DownloadCenter from './components/DownloadCenter';
import SupportForm from './components/SupportForm';
import Footer from './components/Footer';
import { ShieldAlert, AlertOctagon } from 'lucide-react';

// Lazy load components
const AuthPage = lazy(() => import('./components/AdminLogin')); 
const Dashboard = lazy(() => import('./components/Dashboard'));

const LoadingScreen = () => (
  <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center z-[999]">
    <div className="custom-loader mb-6"></div>
    <div className="w-32 h-[1px] bg-white/5 overflow-hidden rounded-full">
      <div className="h-full bg-gold animate-[reveal_2s_infinite] will-change-transform"></div>
    </div>
    <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-gold/40">Loading Fleet Data...</p>
  </div>
);

const MaintenanceScreen = () => {
  const { settings, navigateTo, user, isAdmin } = useSettings();
  
  // If admin is logged in, they can bypass
  if (isAdmin) return null;

  return (
    <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center p-6 text-center z-[200] overflow-hidden">
      <div className="absolute inset-0 bg-wood-pattern opacity-5 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>

      <div className="relative z-10 animate-fade-in-up">
        <div className="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center mb-8 border border-red-500/20 mx-auto shadow-[0_0_50px_rgba(239,68,68,0.2)]">
          <AlertOctagon size={48} className="text-red-500" />
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-black text-white uppercase mb-6 tracking-tighter">
          الموقع تحت الصيانة
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto font-medium text-lg leading-relaxed mb-12">
          {settings.maintenanceMessage || "نقوم حالياً ببعض التحديثات الهامة لضمان تجربة أفضل. سنعود قريباً."}
        </p>
        
        {!user && (
          <button 
            onClick={() => navigateTo('login')} 
            className="px-8 py-3 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white hover:border-gold/50 transition-all"
          >
            دخول المشرفين
          </button>
        )}
      </div>
    </div>
  );
};

function AppContent() {
  const { currentPage, settings, user, isAdmin, isLoading } = useSettings();

  if (isLoading) return <LoadingScreen />;

  if (currentPage === 'login') {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <AuthPage />
      </Suspense>
    );
  }

  if (currentPage === 'admin') {
    return (
      <Suspense fallback={<LoadingScreen />}>
        {user ? <Dashboard /> : <AuthPage />}
      </Suspense>
    );
  }

  // Show Maintenance Screen if enabled AND user is NOT admin
  if (settings.isMaintenanceMode && !isAdmin) {
    return <MaintenanceScreen />;
  }

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-gold/30 selection:text-gold overflow-x-hidden">
      <Header />
      <main className="relative">
        <Hero />
        <NewsGrid />
        <GameShowcase />
        <DownloadCenter />
        <SupportForm />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}
