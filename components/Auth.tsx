
import React, { useState, useEffect } from 'react';
import { User, Eye, EyeOff, ArrowRight, Loader2, Sparkles, Fingerprint, AlertCircle, Key, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
  const [isCheckingKey, setIsCheckingKey] = useState(true);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const status = await window.aistudio.hasSelectedApiKey();
        setHasKey(status);
      }
      setIsCheckingKey(false);
    };
    checkKey();
  }, []);

  const handleSyncKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Assume success based on system race condition rules
      setHasKey(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasKey) {
      setErrorMessage('Sync AI Key dulu ya Kak sebelum masuk.');
      return;
    }
    
    setErrorMessage('');
    setLoadingState('checking');

    const processDelay = 800;

    setTimeout(() => {
      const { username, password } = formData;
      
      if (username.toLowerCase() === 'gobel' && password === 'master') {
        setLoadingState('success');
        setTimeout(() => onLogin(`${username}@voxy.dev`, 'Gobel Developer', UserRole.OWNER), 400);
      } else if (username.toLowerCase() === 'admin' && password === '123') {
        setLoadingState('success');
        setTimeout(() => onLogin(`${username}@voxy.dev`, 'Voxy Admin', UserRole.ADMIN), 400);
      } else if (username.length > 2 && password.length > 2) {
        setLoadingState('success');
        setTimeout(() => onLogin(`${username}@voxy.local`, username, UserRole.USER), 400);
      } else {
        setLoadingState('error');
        setErrorMessage('Kredensial tidak valid. Silakan periksa kembali.');
        setTimeout(() => setLoadingState('idle'), 2000);
      }
    }, processDelay);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#fcfdfe] dark:bg-navy-950 relative overflow-hidden">
      <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] bg-sky-100/40 dark:bg-sky-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] bg-indigo-50/40 dark:bg-indigo-500/10 rounded-full blur-[120px]"></div>

      <div className={`w-full max-w-[460px] z-10 transition-all duration-700 ${loadingState === 'success' ? 'scale-95 opacity-0 translate-y-4' : 'scale-100 opacity-100 translate-y-0'}`}>
        <div className={`bg-white/80 dark:bg-navy-900/80 backdrop-blur-2xl p-10 md:p-12 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl text-center relative ${loadingState === 'error' ? 'animate-shake border-red-100 shadow-red-50' : ''}`}>
          
          <div className={`absolute -top-12 left-1/2 -translate-x-1/2 inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] shadow-2xl transition-all duration-500 overflow-hidden ${loadingState === 'error' ? 'bg-red-500 text-white' : 'bg-slate-900 dark:bg-sky-500 text-white shadow-slate-400/30'}`}>
            <div className="absolute inset-0 bg-sky-500/10"></div>
            {loadingState === 'checking' ? (
              <Loader2 className="animate-spin text-sky-400" size={40} />
            ) : (
              <span className="text-5xl font-black font-mono text-white relative z-10">V</span>
            )}
          </div>

          <div className="mt-12 mb-8">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Voxy Ai</h1>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="h-[1px] w-4 bg-slate-200 dark:bg-slate-700"></span>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">By Gobel Developer</p>
              <span className="h-[1px] w-4 bg-slate-200 dark:bg-slate-700"></span>
            </div>
          </div>

          {/* Neural Key Sync Status Area */}
          <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${hasKey ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 animate-pulse'}`}></div>
                <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Neural Key Link</span>
              </div>
              {hasKey && <CheckCircle2 size={16} className="text-emerald-500" />}
            </div>
            
            {!hasKey ? (
              <button 
                type="button"
                onClick={handleSyncKey}
                className="w-full flex items-center justify-center gap-2 py-3 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-500/20"
              >
                <Key size={14} /> Connect AI Studio Key
              </button>
            ) : (
              <p className="text-[9px] font-bold text-slate-400 uppercase text-center tracking-widest">Koneksi Saraf Berhasil Terjalin</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <div className={`relative group transition-all ${loadingState === 'error' ? 'border-red-200' : ''}`}>
                <User className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${loadingState === 'error' ? 'text-red-300' : 'text-slate-300 group-focus-within:text-sky-500'}`} size={18} />
                <input 
                  type="text" required placeholder="Username Access"
                  disabled={loadingState === 'checking' || loadingState === 'success' || !hasKey}
                  className="w-full bg-slate-50/50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl pl-14 pr-6 py-5 text-sm font-bold outline-none focus:ring-4 focus:ring-sky-500/5 focus:bg-white dark:focus:bg-slate-700 transition-all placeholder:text-slate-300 text-slate-700 dark:text-white disabled:opacity-40"
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="relative group">
                <Fingerprint className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${loadingState === 'error' ? 'text-red-300' : 'text-slate-300 group-focus-within:text-sky-500'}`} size={18} />
                <input 
                  type={showPassword ? "text" : "password"} required placeholder="Neural Password"
                  disabled={loadingState === 'checking' || loadingState === 'success' || !hasKey}
                  className="w-full bg-slate-50/50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl pl-14 pr-14 py-5 text-sm font-bold outline-none focus:ring-4 focus:ring-sky-500/5 focus:bg-white dark:focus:bg-slate-700 transition-all placeholder:text-slate-300 text-slate-700 dark:text-white disabled:opacity-40"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-sky-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 px-6 text-[10px] font-bold text-red-500 uppercase tracking-tighter animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={12} /> {errorMessage}
              </div>
            )}

            <button
              type="submit" disabled={loadingState === 'checking' || loadingState === 'success' || !hasKey}
              className={`w-full font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 transition-all shadow-xl active:scale-[0.98] mt-4 group ${
                loadingState === 'error' ? 'bg-red-500 text-white shadow-red-100' : 
                loadingState === 'success' ? 'bg-emerald-500 text-white' : 
                !hasKey ? 'bg-slate-200 text-slate-400 cursor-not-allowed' :
                'bg-slate-900 dark:bg-sky-500 hover:bg-slate-800 text-white shadow-slate-200 dark:shadow-sky-500/20'
              }`}
            >
              {loadingState === 'checking' ? (
                <>NODE VERIFICATION... <Loader2 className="animate-spin" size={20} /></>
              ) : loadingState === 'success' ? (
                <>ACCESS GRANTED</>
              ) : (
                <>INITIALIZE SYSTEM <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <p className="mt-10 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
            Encrypted Tunnel: <span className="text-sky-500/70">v4.5.1-WebView</span><br/>
            Secure Key Verification Required
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
