
import React, { useState } from 'react';
import { executeIntelligenceModule, VoxyApiError } from '../services/geminiService';
import { 
  Shield, Activity, Key, Zap, FileSearch, AlertCircle, 
  DollarSign, HelpCircle, Lock, HeartPulse, Cpu, Loader2, Play 
} from 'lucide-react';

interface IntelligenceHubProps {
  onUseQuota: () => boolean;
  quota: number;
  onKeyError: () => void;
}

const MODULES = [
  { id: 'SOC', title: 'AI Security SOC', icon: Shield, desc: 'Threat detection & mitigation.' },
  { id: 'NEURAL_HEALTH', title: 'Neural Health', icon: HeartPulse, desc: 'Performance & stability audit.' },
  { id: 'GOVERNANCE', title: 'Access Governance', icon: Key, desc: 'API key & permission control.' },
  { id: 'OPTIMIZATION', title: 'Prompt Optimizer', icon: Zap, desc: 'Token & efficiency intelligence.' },
  { id: 'COMPLIANCE', title: 'Audit Compliance', icon: FileSearch, desc: 'ISO/SOC2/GDPR Readiness.' },
  { id: 'INCIDENT', title: 'Incident Response', icon: AlertCircle, desc: 'Breach classification & recovery.' },
  { id: 'COST', title: 'Cost Intelligence', icon: DollarSign, desc: 'Resource & token savings.' },
  { id: 'EXPLAIN', title: 'Decision Explainability', icon: HelpCircle, desc: 'Reasoning & context analysis.' },
  { id: 'FIREWALL', title: 'AI Firewall', icon: Lock, desc: 'Input/Output sanitization.' },
  { id: 'HEALING', title: 'Self-Healing', icon: Cpu, desc: 'Autonomous system recovery.' }
];

const IntelligenceHub: React.FC<IntelligenceHubProps> = ({ onUseQuota, quota, onKeyError }) => {
  const [selectedModule, setSelectedModule] = useState(MODULES[0]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    if (!input.trim() || loading) return;
    if (!onUseQuota()) {
       setError("Quota lokal habis. Mohon tunggu.");
       return;
    }

    setError(null);
    setLoading(true);
    try {
      const output = await executeIntelligenceModule(selectedModule.id, input);
      setResult(output);
    } catch (err: any) {
      const vError = err as VoxyApiError;
      setError(vError.reason || "Neural Link Failure.");
      if (vError.isAuthError) onKeyError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-smooth">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {MODULES.map((m) => (
          <button
            key={m.id}
            onClick={() => { setSelectedModule(m); setResult(null); setError(null); }}
            className={`p-4 rounded-3xl border transition-all flex flex-col items-center text-center gap-2 ${
              selectedModule.id === m.id 
                ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-105' 
                : 'bg-white border-slate-100 text-slate-500 hover:border-sky-200'
            }`}
          >
            <m.icon size={20} className={selectedModule.id === m.id ? 'text-sky-400' : 'text-slate-400'} />
            <span className="text-[9px] font-black uppercase tracking-tighter">{m.title}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-4">
           <div className="p-4 bg-sky-50 rounded-2xl text-sky-600">
              <selectedModule.icon size={24} />
           </div>
           <div>
              <h3 className="text-xl font-black text-slate-900">{selectedModule.title}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedModule.desc}</p>
           </div>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Enter data for ${selectedModule.title} analysis...`}
          className="w-full h-40 bg-slate-50 rounded-3xl p-6 text-sm font-medium border border-slate-100 outline-none focus:ring-4 focus:ring-sky-500/5 transition-all resize-none"
        />

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3">
             <AlertCircle size={14} /> {error}
          </div>
        )}

        <button
          onClick={handleRun}
          disabled={loading || !input.trim() || quota <= 0}
          className="w-full py-5 bg-slate-900 hover:bg-sky-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} fill="currentColor" />}
          Execute Intelligence Mode
        </button>

        {result && (
          <div className="mt-8 p-8 bg-slate-950 rounded-[2.5rem] border border-slate-800 animate-in fade-in slide-in-from-bottom-4">
             <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest">Neural Output Log</span>
                <span className="text-[10px] text-slate-500 font-mono">Timestamp: {new Date().toLocaleTimeString()}</span>
             </div>
             <pre className="text-sm font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                {result}
             </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntelligenceHub;
