import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import NewsGrid from './components/NewsGrid';
import DownloadCenter from './components/DownloadCenter';
import SupportForm from './components/SupportForm';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-100 font-sans">
      <Header />
      <main>
        <Hero />
        <NewsGrid />
        <DownloadCenter />
        <SupportForm />
      </main>
      <Footer />
    </div>
  );
}

export default App;