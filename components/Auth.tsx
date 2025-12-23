import React, { useState, useEffect } from 'react';
import { User, Eye, EyeOff, ArrowRight, Loader2, Key, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { UserRole } from '../types';

interface AuthProps {
  onLogin: (email: string, username: string, role: UserRole) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loadingState, setLoadingState] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasKey, setHasKey] = useState(false);

  // Cek apakah key sudah ada di session browser (AI Studio persistence)
  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const status = await window.aistudio.hasSelectedApiKey();
        setHasKey(status);
      }
    };
    checkKey();
    
    // Interval pendek untuk mendeteksi key yang baru dipasang di WebView
    const interval = setInterval(checkKey, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSyncKey = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        // Berikan asumsi sukses agar user bisa lanjut
        setHasKey(true);
      } catch (err) {
        console.error("Gagal sinkronisasi key:", err);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasKey) {
      setErrorMessage('Akses Ditolak: Sinkronkan Neural Key Terlebih Dahulu!');
      return;
    }
    
    setErrorMessage('');
    setLoadingState('checking');

    setTimeout(() => {
      const { username, password } = formData;
      if (username.toLowerCase() === 'gobel' && password === 'master') {
        setLoadingState('success');
        setTimeout(() => onLogin(`${username}@voxy.dev`, 'Gobel Developer', UserRole.OWNER), 400);
      } else if (username.length > 2 && password.length > 2) {
        setLoadingState('success');
        setTimeout(() => onLogin(`${username}@voxy.local`, username, UserRole.USER), 400);
      } else {
        setLoadingState('error');
        setErrorMessage('Kredensial tidak valid.');
        setTimeout(() => setLoadingState('idle'), 2000);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-navy-950 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-sky-500/10 rounded-full blur-[100px]"></div>
      
      <div className={`w-full max-w-[440px] z-10 transition-all duration-700 ${loadingState === 'success' ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="bg-white/80 dark:bg-navy-900/80 backdrop-blur-2xl p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-900 dark:bg-sky-500 rounded-[2rem] text-white shadow-xl mb-6 font-mono font-black text-4xl">V</div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Voxy Ai Access</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Sistem Keamanan Gobel Developer</p>
          </div>

          {/* Key Sync Module - Wajib diisi */}
          <div className={`mb-8 p-5 rounded-3xl border transition-all ${hasKey ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100 animate-pulse'}`}>
             <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                   <Key size={16} className={hasKey ? 'text-emerald-500' : 'text-red-500'} />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-200">Neural Connectivity</span>
                </div>
                {hasKey ? <CheckCircle2 size={16} className="text-emerald-500" /> : <AlertCircle size={16} className="text-red-500" />}
             </div>
             
             {!hasKey ? (
               <button 
                 onClick={handleSyncKey}
                 className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20 transition-all active:scale-95"
               >
                 Connect AI Studio Key
               </button>
             ) : (
               <div className="text-[9px] font-bold text-emerald-600 uppercase text-center tracking-widest">
                 Sistem Terhubung: Neural Link Active
               </div>
             )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sky-500 transition-colors" size={18} />
              <input 
                type="text" required placeholder="Neural ID"
                disabled={!hasKey || loadingState === 'checking'}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl pl-14 pr-6 py-5 text-sm font-bold outline-none focus:ring-4 focus:ring-sky-500/5 transition-all disabled:opacity-50"
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>

            <div className="relative group">
              <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sky-500 transition-colors" size={18} />
              <input 
                type={showPassword ? "text" : "password"} required placeholder="System Key"
                disabled={!hasKey || loadingState === 'checking'}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl pl-14 pr-14 py-5 text-sm font-bold outline-none focus:ring-4 focus:ring-sky-500/5 transition-all disabled:opacity-50"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button 
                type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-sky-500 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errorMessage && (
              <div className="text-[10px] font-black text-red-500 uppercase tracking-widest text-center animate-shake">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={!hasKey || loadingState === 'checking'}
              className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 ${
                !hasKey ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-900 dark:bg-sky-500 text-white hover:bg-slate-800'
              }`}
            >
              {loadingState === 'checking' ? <Loader2 className="animate-spin" size={18} /> : <>Initialize System <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="mt-8 text-center">
             <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-[9px] font-bold text-slate-400 hover:text-sky-500 uppercase tracking-widest transition-colors">
               Pelajari Lisensi & Billing Kak
             </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;