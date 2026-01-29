
import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { Send, CheckCircle, Loader2, Mail } from 'lucide-react';
import { LoadingState } from '../types';

const SupportForm: React.FC = () => {
  const { addTicket, t, lang } = useSettings();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(LoadingState.LOADING);
    try {
      await addTicket({ ...formData });
      setStatus(LoadingState.SUCCESS);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus(LoadingState.IDLE), 5000);
    } catch (err) {
      setStatus(LoadingState.ERROR);
    }
  };

  return (
    <section id="support" className="py-32 bg-[#050505] relative overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 bg-gold/5 blur-[150px] -z-0 opacity-30"></div>
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 reveal-on-scroll">
          <h2 className="text-4xl lg:text-6xl font-display font-black text-white mb-6 uppercase tracking-tighter">{t.supportTitle}</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">{t.supportSub}</p>
        </div>

        <div className="glass-card rounded-[3rem] p-10 md:p-16 border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
          {status === LoadingState.SUCCESS ? (
            <div className="text-center py-12 animate-fade-in-up">
              <div className="w-24 h-24 bg-gold/10 border-2 border-gold rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle size={48} className="text-gold" />
              </div>
              <h3 className="text-3xl font-display font-black text-white mb-4 uppercase tracking-widest">{lang === 'en' ? 'MESSAGE SENT' : 'تم الإرسال'}</h3>
              <p className="text-slate-400 mb-8">{lang === 'en' ? 'The fleet has received your dispatch.' : 'تلقى الأسطول رسالتك بنجاح.'}</p>
              <button onClick={() => setStatus(LoadingState.IDLE)} className="text-gold font-bold underline uppercase tracking-widest text-xs">New Dispatch</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gold ml-1">{lang === 'en' ? 'Your Name' : 'الاسم'}</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-gold/50 focus:bg-white/10 transition-all" 
                    placeholder={lang === 'en' ? 'Jack Sparrow' : 'اسمك الكريم'}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gold ml-1">{lang === 'en' ? 'Email Address' : 'البريد'}</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-gold/50 focus:bg-white/10 transition-all" 
                    placeholder="email@fleet.com"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gold ml-1">{lang === 'en' ? 'Subject' : 'الموضوع'}</label>
                <input 
                  type="text" 
                  required 
                  value={formData.subject} 
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-gold/50 focus:bg-white/10 transition-all" 
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gold ml-1">{lang === 'en' ? 'Message' : 'الرسالة'}</label>
                <textarea 
                  required 
                  rows={4} 
                  value={formData.message} 
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-gold/50 focus:bg-white/10 transition-all resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={status === LoadingState.LOADING}
                className="w-full h-16 btn-modern bg-gold text-black font-display font-black text-xl rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95"
              >
                {status === LoadingState.LOADING ? <Loader2 className="animate-spin" /> : <><Send size={20} /> {t.supportBtnSend}</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default SupportForm;
