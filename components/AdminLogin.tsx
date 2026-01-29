
import React, { useState, useEffect, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';
import { Skull, Lock, ArrowLeft, Loader2, Mail, UserPlus, LogIn, AlertTriangle, CheckCircle2 } from 'lucide-react';

const AuthPage: React.FC = () => {
  const { login, signup, navigateTo, user, isAdmin } = useSettings();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  // مراقب ذكي: بمجرد توفر بيانات المستخدم والملف الشخصي في السياق، يتم التحويل فوراً
  useEffect(() => {
    if (user && isMounted.current) {
      const destination = user.role === 'admin' ? 'admin' : 'site';
      setSuccessMsg(isLoginMode ? "تم التحقق.. جاري فتح البوابة" : "مرحباً بك في الطاقم.. جاري التحويل");
      
      const timer = setTimeout(() => {
        if (isMounted.current) navigateTo(destination);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [user, navigateTo, isLoginMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    
    try {
      if (isLoginMode) {
        // تسجيل الدخول
        const { data, error: loginErr } = await login(email, password);
        
        if (loginErr) {
          if (isMounted.current) {
            setError(loginErr.message === "Invalid login credentials" ? "بيانات الدخول غير صحيحة" : loginErr.message);
            setLoading(false);
          }
        } else if (data?.user) {
          if (isMounted.current) {
            setSuccessMsg("تم العثور على السجل.. جاري التحقق من الرتبة");
            // التحويل سيتم عبر الـ useEffect أعلاه بمجرد تحديث حالة الـ user
          }
        }
      } else {
        // إنشاء حساب جديد
        const { data, error: signupErr } = await signup(email, password);
        
        if (signupErr) {
          if (isMounted.current) {
            setError(signupErr.message || "فشل إنشاء الحساب");
            setLoading(false);
          }
        } else {
          if (isMounted.current) {
            if (data?.session) {
              setSuccessMsg("تم إنشاء حسابك بنجاح! جاري إدخالك للمقر..");
            } else {
              setSuccessMsg("تم إرسال رسالة تأكيد لبريدك الإلكتروني. يرجى تفعيل الحساب للمتابعة.");
              setLoading(false);
            }
          }
        }
      }
    } catch (err: any) {
      if (isMounted.current) {
        setError("حدث خطأ في الاتصال بقاعدة البيانات.");
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050301] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-wood-pattern opacity-5 pointer-events-none"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-gold/5 rounded-full blur-[120px]"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gold/5 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md animate-fade-in-up">
        <button 
          onClick={() => navigateTo('site')}
          disabled={loading}
          className="flex items-center gap-2 text-wood-500 hover:text-gold transition-colors mb-8 font-bold uppercase tracking-widest text-xs group disabled:opacity-30"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> العودة للرئيسية
        </button>

        <div className="bg-wood-950/40 backdrop-blur-3xl border border-white/5 p-10 md:p-12 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gold rounded-3xl rotate-12 flex items-center justify-center shadow-2xl">
            <Skull className="text-wood-900 -rotate-12" size={36} />
          </div>

          <div className="text-center mt-6 mb-8">
            <h2 className="text-3xl font-display font-black text-white uppercase tracking-tighter mb-2">
              {isLoginMode ? 'دخول المقر' : 'توقيع العقد'}
            </h2>
            <p className="text-wood-500 text-sm font-medium">
              {isLoginMode ? 'أدخل شيفرة الدخول السرية' : 'انضم لأسطول الهامور وابدأ جنيك للثروات'}
            </p>
          </div>

          <div className="flex bg-black/40 p-1 rounded-xl mb-8 border border-white/5">
            <button 
              disabled={loading}
              onClick={() => { setIsLoginMode(true); setError(null); setSuccessMsg(null); }}
              className={`flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${isLoginMode ? 'bg-gold text-black shadow-lg' : 'text-wood-500 hover:text-white'}`}
            >
              دخول
            </button>
            <button 
              disabled={loading}
              onClick={() => { setIsLoginMode(false); setError(null); setSuccessMsg(null); }}
              className={`flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${!isLoginMode ? 'bg-gold text-black shadow-lg' : 'text-wood-500 hover:text-white'}`}
            >
              تسجيل
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-wood-500 ml-1">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-wood-500" size={18} />
                <input 
                  type="email" 
                  value={email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="captain@fleet.com"
                  className="w-full bg-black/60 border border-white/10 rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-gold/50 transition-all text-white disabled:opacity-50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-wood-500 ml-1">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-wood-500" size={18} />
                <input 
                  type="password" 
                  value={password}
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/60 border border-white/10 rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-gold/50 transition-all text-white disabled:opacity-50"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-center flex items-center justify-center gap-3 animate-shake">
                <AlertTriangle size={16} className="text-red-500 shrink-0" />
                <p className="text-red-400 text-[10px] font-bold uppercase leading-tight">{error}</p>
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl text-center flex flex-col items-center justify-center gap-3 animate-fade-in">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500">
                  <CheckCircle2 size={24} className="animate-pulse" />
                </div>
                <div>
                  <p className="text-emerald-400 text-[11px] font-black uppercase tracking-widest text-center leading-relaxed">{successMsg}</p>
                </div>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-wood-900 font-black h-14 rounded-2xl uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(255,215,0,0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-4 disabled:grayscale disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (isLoginMode ? <><LogIn size={18} /> دخول</> : <><UserPlus size={18} /> تسجيل الحساب</>)}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
