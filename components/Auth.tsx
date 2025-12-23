
import React, { useState } from 'react';
import { User, Eye, EyeOff, ArrowRight, Loader2, Sparkles, Fingerprint, AlertCircle } from 'lucide-react';
import { UserRole } from '../types';

interface AuthProps {
  onLogin: (email: string, username: string, role: UserRole) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loadingState, setLoadingState] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoadingState('checking');

    const processDelay = 600 + Math.random() * 400;

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
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#fcfdfe] relative overflow-hidden">
      <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] bg-sky-100/40 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] bg-indigo-50/40 rounded-full blur-[120px]"></div>

      <div className={`w-full max-w-[440px] z-10 transition-all duration-700 ${loadingState === 'success' ? 'scale-95 opacity-0 translate-y-4' : 'scale-100 opacity-100 translate-y-0'}`}>
        <div className={`bg-white/70 backdrop-blur-2xl p-10 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-sky-200/20 text-center relative ${loadingState === 'error' ? 'animate-shake border-red-100 shadow-red-50' : ''}`}>
          
          <div className={`absolute -top-12 left-1/2 -translate-x-1/2 inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] shadow-2xl transition-all duration-500 overflow-hidden ${loadingState === 'error' ? 'bg-red-500 text-white shadow-red-200' : 'bg-slate-900 text-white shadow-slate-400/30'}`}>
            <div className="absolute inset-0 bg-sky-500/10"></div>
            {loadingState === 'checking' ? (
              <Loader2 className="animate-spin text-sky-400" size={40} />
            ) : (
              <span className="text-5xl font-black font-mono text-sky-400 relative z-10">V</span>
            )}
          </div>

          <div className="mt-12 mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Voxy Ai</h1>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="h-[1px] w-4 bg-slate-200"></span>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">By Gobel Developer</p>
              <span className="h-[1px] w-4 bg-slate-200"></span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <div className={`relative group transition-all ${loadingState === 'error' ? 'border-red-200' : ''}`}>
                <User className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${loadingState === 'error' ? 'text-red-300' : 'text-slate-300 group-focus-within:text-sky-500'}`} size={18} />
                <input 
                  type="text" required placeholder="Username Access"
                  disabled={loadingState === 'checking' || loadingState === 'success'}
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-3xl pl-14 pr-6 py-5 text-sm font-bold outline-none focus:ring-4 focus:ring-sky-500/5 focus:bg-white transition-all placeholder:text-slate-300 text-slate-700 disabled:opacity-50"
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="relative group">
                <Fingerprint className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${loadingState === 'error' ? 'text-red-300' : 'text-slate-300 group-focus-within:text-sky-500'}`} size={18} />
                <input 
                  type={showPassword ? "text" : "password"} required placeholder="Neural Password"
                  disabled={loadingState === 'checking' || loadingState === 'success'}
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-3xl pl-14 pr-14 py-5 text-sm font-bold outline-none focus:ring-4 focus:ring-sky-500/5 focus:bg-white transition-all placeholder:text-slate-300 text-slate-700 disabled:opacity-50"
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
              type="submit" disabled={loadingState === 'checking' || loadingState === 'success'}
              className={`w-full font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 transition-all shadow-xl active:scale-[0.98] mt-4 group ${
                loadingState === 'error' ? 'bg-red-500 text-white shadow-red-100' : 
                loadingState === 'success' ? 'bg-emerald-500 text-white' : 
                'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-200'
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
            Encrypted Tunnel: <span className="text-sky-500/70">v4.5.0-Ai</span><br/>
            Voxy Ai Protocol Active
          </p>
        </div>
        
        <div className="mt-8 text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] leading-loose opacity-50">
          Owner: gobel / master<br/>
          Admin: admin / 123
        </div>
      </div>
    </div>
  );
};

export default Auth;
