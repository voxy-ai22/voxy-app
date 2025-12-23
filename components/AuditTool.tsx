
import React, { useState } from 'react';
import { analyzeAndFixCode, VoxyApiError } from '../services/geminiService';
import { AlertCircle, Loader2, Play, Bug, ZapOff, Key, ExternalLink, ShieldAlert } from 'lucide-react';
import { AnalysisResult } from '../types';

interface WebMasterToolProps {
  onUseQuota: () => boolean;
  quota: number;
  onQuotaExhausted?: () => void;
  onKeyError?: () => void;
}

const WebMasterTool: React.FC<WebMasterToolProps> = ({ onUseQuota, quota, onQuotaExhausted, onKeyError }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<{msg: string, reason: string, type: 'auth' | 'quota' | 'general'} | null>(null);

  const handleAnalyze = async () => {
    if (!code.trim() || loading) return;
    
    if (!onUseQuota()) {
      setError({ 
        msg: "Limit Lokal Tercapai", 
        reason: "Sistem membutuhkan waktu untuk regenerasi energi saraf. Tunggu sebentar ya Kak.", 
        type: 'quota' 
      });
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const fixResult = await analyzeAndFixCode(code);
      setResult(fixResult);
    } catch (err: any) {
      const voxyError = err as VoxyApiError;
      const errorMsg = voxyError.message || "Gagal melakukan analisis.";
      const errorReason = voxyError.reason || "Terjadi gangguan transmisi saraf.";
      let errorType: 'auth' | 'quota' | 'general' = 'general';

      if (voxyError.isQuotaError) {
        errorType = 'quota';
        onQuotaExhausted?.();
      } else if (voxyError.isAuthError) {
        errorType = 'auth';
        onKeyError?.();
      }

      setError({ msg: errorMsg, reason: errorReason, type: errorType });
    } finally {
      setLoading(false);
    }
  };

  const severityStyles = {
    low: 'text-blue-600 bg-blue-50 border-blue-100',
    medium: 'text-amber-600 bg-amber-50 border-amber-100',
    high: 'text-orange-600 bg-orange-50 border-orange-100',
    critical: 'text-red-600 bg-red-50 border-red-100',
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-4">
             <ShieldAlert className="text-sky-500" /> Audit Keamanan Kode
          </h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Sistem Pendeteksi Kerentanan Gobel Developer</p>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading || !code || quota <= 0}
          className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg active:scale-95 ${quota <= 0 ? 'bg-slate-200 text-slate-400' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100'}`}
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : quota <= 0 ? <ZapOff size={20} /> : <Play size={20} fill="currentColor" />}
          {quota <= 0 ? 'LIMIT TERCAPAI' : 'ANALISIS KODE'}
        </button>
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
           <p className="text-[10px] font-bold opacity-80 ml-7">
             {error.reason}
           </p>
           {error.type === 'quota' && (
             <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="flex items-center gap-2 text-[10px] font-black text-blue-600 underline ml-7">
               Cek Status Billing <ExternalLink size={12} />
             </a>
           )}
           {error.type === 'auth' && (
             <button onClick={onKeyError} className="ml-7 flex items-center gap-2 text-[10px] font-black text-red-600 underline uppercase">
               Klik untuk Sync Kunci API <Key size={12} />
             </button>
           )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm focus-within:ring-4 focus-within:ring-sky-500/5 transition-all">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// Paste kode di sini Kak..."
            className="w-full h-80 bg-white p-8 text-slate-700 font-mono text-sm focus:outline-none resize-none placeholder:text-slate-300 leading-relaxed caret-blue-600 custom-scrollbar"
          />
        </div>

        {result && (
          <div className="bg-white rounded-[2.5rem] p-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500 shadow-sm border border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${severityStyles[result.severity]}`}>
                  <Bug size={28} />
                </div>
                <div>
                   <h3 className="text-2xl font-extrabold text-slate-900">Security Insights</h3>
                   <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Audit Otonom Selesai</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 italic font-semibold text-blue-900">
              "{result.summary}"
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebMasterTool;
