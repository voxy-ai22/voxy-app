
import React, { useState } from 'react';
import { User, Eye, EyeOff, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
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

    // Login logic yang disederhanakan sesuai permintaan Gobel Developer
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
        setErrorMessage('Kredensial sistem tidak valid.');
        setTimeout(() => setLoadingState('idle'), 2000);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-navy-950 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px]"></div>
      
      <div className={`w-full max-w-[440px] z-10 transition-all duration-700 ${loadingState === 'success' ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="bg-white/80 dark:bg-navy-900/80 backdrop-blur-2xl p-10 md:p-12 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl relative">
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-900 dark:bg-sky-500 rounded-[2rem] text-white shadow-xl mb-6 font-mono font-black text-4xl transform hover:rotate-6 transition-transform">V</div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Voxy Ai Access</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Intelligence System by Gobel Developer</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sky-500 transition-colors" size={18} />
              <input 
                type="text" required placeholder="Neural Identity"
                disabled={loadingState === 'checking'}
                className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl pl-14 pr-6 py-5 text-sm font-bold outline-none focus:ring-4 focus:ring-sky-500/5 transition-all text-slate-700 dark:text-white placeholder:text-slate-300"
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>

            <div className="relative group">
              <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sky-500 transition-colors" size={18} />
              <input 
                type={showPassword ? "text" : "password"} required placeholder="Secure Access Key"
                disabled={loadingState === 'checking'}
                className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl pl-14 pr-14 py-5 text-sm font-bold outline-none focus:ring-4 focus:ring-sky-500/5 transition-all text-slate-700 dark:text-white placeholder:text-slate-300"
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
              <div className="text-[10px] font-black text-red-500 uppercase tracking-widest text-center animate-pulse">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loadingState === 'checking'}
              className="w-full py-5 bg-slate-900 dark:bg-sky-500 hover:bg-slate-800 dark:hover:bg-sky-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {loadingState === 'checking' ? <Loader2 className="animate-spin" size={18} /> : <>Initialize Connection <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="mt-12 text-center opacity-40">
             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
               Vercel Secured Environment • v4.6.0
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
