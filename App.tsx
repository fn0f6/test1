
import React, { Suspense, lazy, useEffect } from 'react';
import { useSettings, SettingsProvider } from './context/SettingsContext';
import Header from './components/Header';
import Hero from './components/Hero';
import NewsGrid from './components/NewsGrid';
import GameShowcase from './components/GameShowcase';
import DownloadCenter from './components/DownloadCenter';
import SupportForm from './components/SupportForm';
import Footer from './components/Footer';
import { AlertOctagon } from 'lucide-react';

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
  if (isAdmin) return null;

  return (
    <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center p-6 text-center z-[200] overflow-hidden">
      <div className="absolute inset-0 bg-wood-pattern opacity-5 pointer-events-none"></div>
      <div className="relative z-10">
        <div className="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center mb-8 border border-red-500/20 mx-auto">
          <AlertOctagon size={48} className="text-red-500" />
        </div>
        <h1 className="text-4xl font-display font-black text-white uppercase mb-6 tracking-tighter">صيانة السفينة</h1>
        <p className="text-slate-400 max-w-lg mx-auto mb-12">{settings.maintenanceMessage}</p>
        {!user && (
          <button onClick={() => navigateTo('login')} className="text-[10px] font-black uppercase text-slate-500 hover:text-white">دخول الإدارة</button>
        )}
      </div>
    </div>
  );
};

function AppContent() {
  const { currentPage, settings, user, isAdmin, isLoading, navigateTo } = useSettings();

  // توجيه تلقائي ذكي
  useEffect(() => {
    if (!isLoading && user) {
      // إذا كنا في صفحة اللوجين ومسجل دخول، وجهنا للمكان المناسب
      if (currentPage === 'login') {
        navigateTo(user.role === 'admin' ? 'admin' : 'site');
      }
    }
  }, [user, currentPage, navigateTo, isLoading]);

  if (isLoading) return <LoadingScreen />;

  // الأولوية 1: صفحة الإدارة (للمسجلين فقط)
  if (currentPage === 'admin' && user) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <Dashboard />
      </Suspense>
    );
  }

  // الأولوية 2: صفحة الدخول (لغير المسجلين أو من يطلبها صراحة)
  if (currentPage === 'login') {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <AuthPage />
      </Suspense>
    );
  }

  // الأولوية 3: وضع الصيانة (للمستخدمين العاديين فقط)
  if (settings.isMaintenanceMode && !isAdmin) {
    return <MaintenanceScreen />;
  }

  // الافتراضي: الموقع الرئيسي
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
