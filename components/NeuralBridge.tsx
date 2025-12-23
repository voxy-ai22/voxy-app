
import React, { useState } from 'react';
import { codeTranspiler, VoxyApiError } from '../services/geminiService';
import { Replace, Loader2, ArrowRight, Code, ZapOff, CheckCircle2 } from 'lucide-react';
import CodeBlock from './CodeBlock';

interface NeuralBridgeProps {
  onUseQuota: () => boolean;
  quota: number;
  onKeyError: () => void;
}

const NeuralBridge: React.FC<NeuralBridgeProps> = ({ onUseQuota, quota, onKeyError }) => {
  const [sourceCode, setSourceCode] = useState('');
  const [targetLang, setTargetLang] = useState('TypeScript');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranspile = async () => {
    if (!sourceCode.trim() || loading) return;
    if (!onUseQuota()) { setError("Quota habis."); return; }

    setLoading(true);
    setError(null);
    try {
      const output = await codeTranspiler(sourceCode, targetLang);
      setResult(output);
    } catch (err: any) {
      const voxyError = err as VoxyApiError;
      setError(voxyError.reason);
      if (voxyError.isAuthError) onKeyError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-smooth pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Neural Bridge Protocol</h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Cross-Language Transpiler • Security Enhanced</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-navy-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800">
           <select 
             value={targetLang}
             onChange={(e) => setTargetLang(e.target.value)}
             className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none px-4 text-sky-500"
           >
              <option>TypeScript</option>
              <option>Python</option>
              <option>Go</option>
              <option>Rust</option>
              <option>PHP 8.3</option>
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
           <div className="bg-white dark:bg-navy-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                 <Code size={120} />
              </div>
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase mb-6 flex items-center gap-2">Source Neural Data</h3>
              <textarea
                value={sourceCode}
                onChange={(e) => setSourceCode(e.target.value)}
                placeholder='Paste source code here...'
                className="w-full h-96 bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-6 text-[11px] font-mono border border-slate-100 dark:border-slate-800 outline-none focus:ring-4 focus:ring-sky-500/5 resize-none custom-scrollbar"
              />
              <button 
                onClick={handleTranspile}
                disabled={loading || !sourceCode.trim()}
                className="w-full mt-6 py-5 bg-slate-900 dark:bg-sky-600 hover:bg-sky-600 dark:hover:bg-sky-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Replace size={18} />}
                Transpile to {targetLang}
              </button>
           </div>
        </div>

        <div className="glass-card rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 min-h-[500px] flex flex-col">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-500">
                    <CheckCircle2 size={16} />
                 </div>
                 <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Optimized Output</span>
              </div>
           </div>

           {result ? (
             <div className="flex-1 overflow-y-auto custom-scrollbar h-full">
                <CodeBlock code={result} language={targetLang.toLowerCase()} />
             </div>
           ) : loading ? (
             <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
                <div className="flex items-center gap-2">
                   <div className="w-12 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
                      <div className="absolute inset-0 bg-sky-500 animate-slide-infinite"></div>
                   </div>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Migrating Neural Structures...</p>
             </div>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 italic">
                <ArrowRight size={48} className="text-slate-400 mb-6" />
                <p className="text-[10px] font-black uppercase tracking-widest">Transpilation result will appear here</p>
             </div>
           )}

           {error && (
             <div className="mt-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-red-600 text-[10px] font-black uppercase text-center">
                {error}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default NeuralBridge;
