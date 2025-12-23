import React, { useState } from 'react';
import { generateScript } from '../services/geminiService';
import { Wrench, Loader2, Terminal, Code, ZapOff, AlertCircle, Key, ExternalLink } from 'lucide-react';
import CodeBlock from './CodeBlock';

interface ScriptGenToolProps {
  onUseQuota: () => boolean;
  quota: number;
  onLoading?: (isLoading: boolean) => void;
  onQuotaExhausted?: () => void;
}

const ScriptGenTool: React.FC<ScriptGenToolProps> = ({ onUseQuota, quota, onLoading, onQuotaExhausted }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<{msg: string, type: 'auth' | 'quota' | 'general'} | null>(null);

  const handleOpenKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      setError(null);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;

    if (!onUseQuota()) {
      setError({ msg: "Energi sistem lokal habis! Tunggu sebentar.", type: 'quota' });
      return;
    }

    setError(null);
    setLoading(true);
    onLoading?.(true);
    try {
      const script = await generateScript(prompt);
      setResult(script);
    } catch (err: any) {
      const errorStr = err.message?.toLowerCase() || '';
      if (errorStr.includes('429') || errorStr.includes('quota') || errorStr.includes('exhausted')) {
        setError({ msg: "Batas Quota Billing Habis!", type: 'quota' });
        onQuotaExhausted?.();
      } else if (errorStr.includes('403') || errorStr.includes('permission')) {
        setError({ msg: "Akses Ditolak.", type: 'auth' });
      } else {
        setError({ msg: "Gagal membuat script.", type: 'general' });
      }
    } finally {
      setLoading(false);
      onLoading?.(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-smooth">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Script & Logic Master</h2>
          <p className="text-slate-500 mt-1 font-bold uppercase text-[10px] tracking-widest">Neural Script Engine • Gobel Developer</p>
        </div>
      </div>

      {error && (
        <div className={`p-6 rounded-3xl border flex flex-col gap-3 animate-in slide-in-from-top-2 ${
          error.type === 'quota' ? 'bg-amber-50 border-amber-200 text-amber-800' : 
          error.type === 'auth' ? 'bg-red-50 border-red-200 text-red-800' : 
          'bg-slate-50 border-slate-200 text-slate-800'
        }`}>
           <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest">
              <AlertCircle size={18} /> {error.msg}
           </div>
           {error.type === 'quota' && (
             <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="ml-7 text-[10px] font-black text-blue-600 underline uppercase tracking-tighter">
               Buka Dashboard Billing AI Studio
             </a>
           )}
        </div>
      )}

      <div className="bg-white border border-slate-100 shadow-sm rounded-[2rem] p-8">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={quota <= 0 || loading}
            placeholder="Contoh: Buatkan fungsi keamanan di React..."
            className="w-full h-48 bg-slate-50 border border-slate-100 rounded-2xl p-6 text-slate-700 font-medium text-sm focus:ring-4 focus:ring-sky-500/5 focus:outline-none resize-none placeholder:text-slate-300"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt || quota <= 0}
            className={`absolute bottom-4 right-4 px-8 py-3 rounded-xl flex items-center gap-2 transition-all shadow-xl font-bold active:scale-95 ${
              quota <= 0 ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-200'
            }`}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : quota <= 0 ? <ZapOff size={18} /> : <Code size={18} />}
            {quota <= 0 ? 'LIMIT' : 'Generate'}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
           <CodeBlock code={result} />
        </div>
      )}
    </div>
  );
};

export default ScriptGenTool;