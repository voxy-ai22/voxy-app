
import React, { useState } from 'react';
import { auditDependencies, VoxyApiError } from '../services/geminiService';
import { SearchCode, Loader2, ShieldCheck, AlertCircle, RefreshCcw } from 'lucide-react';

interface SentinelToolProps {
  onUseQuota: () => boolean;
  quota: number;
  onKeyError: () => void;
}

const SentinelTool: React.FC<SentinelToolProps> = ({ onUseQuota, quota, onKeyError }) => {
  const [packageJson, setPackageJson] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAudit = async () => {
    if (!packageJson.trim() || loading) return;
    if (!onUseQuota()) { setError("Quota habis."); return; }

    setLoading(true);
    setError(null);
    try {
      const data = await auditDependencies(packageJson);
      setResult(data);
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
      <div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Voxy Sentinel Auditor</h2>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Dependency Security Scanner • CVE Intelligence</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white dark:bg-navy-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase mb-6 flex items-center gap-2">
                 <SearchCode size={16} className="text-sky-500" /> Package Input
              </h3>
              <textarea
                value={packageJson}
                onChange={(e) => setPackageJson(e.target.value)}
                placeholder='Paste package.json atau requirements.txt...'
                className="w-full h-80 bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-6 text-[11px] font-mono border border-slate-100 dark:border-slate-800 outline-none focus:ring-4 focus:ring-sky-500/5 resize-none custom-scrollbar"
              />
              <button 
                onClick={handleAudit}
                disabled={loading || !packageJson.trim()}
                className="w-full mt-6 py-4 bg-slate-900 dark:bg-sky-600 hover:bg-sky-600 dark:hover:bg-sky-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
                Audit Dependencies
              </button>
           </div>
        </div>

        <div className="lg:col-span-2 glass-card rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 min-h-[500px]">
           {!result && !loading ? (
             <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                <RefreshCcw size={48} className="text-slate-400 mb-6" />
                <p className="text-[10px] font-black uppercase tracking-widest">Tunggu data input untuk memulai scanning</p>
             </div>
           ) : loading ? (
             <div className="h-full flex flex-col items-center justify-center text-center gap-6">
                <Loader2 className="animate-spin text-sky-500" size={40} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Searching for vulnerabilities...</p>
             </div>
           ) : (
             <div className="space-y-8 overflow-y-auto custom-scrollbar h-full pr-4">
                <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-3xl">
                   <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{result.summary}</p>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                   {result.vulnerabilities?.map((v: any, i: number) => (
                      <div key={i} className="bg-white dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row gap-6 hover:shadow-lg transition-all">
                         <div className={`p-4 rounded-2xl shrink-0 h-fit ${
                           v.risk.toLowerCase().includes('high') ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                         }`}>
                            <AlertCircle size={24} />
                         </div>
                         <div className="space-y-2">
                            <div className="flex items-center gap-3">
                               <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase">{v.library} <span className="text-slate-400 text-[10px] ml-2">@{v.version}</span></h4>
                               <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${
                                 v.risk.toLowerCase().includes('high') ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                               }`}>{v.risk}</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{v.description}</p>
                            <div className="pt-2 text-[10px] font-bold text-sky-500 uppercase tracking-widest flex items-center gap-2">
                               <RefreshCcw size={12} /> Fix: {v.fix}
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default SentinelTool;
