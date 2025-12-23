
import React, { useState, useRef } from 'react';
import { chatWithVoxyStream, VoxyApiError } from '../services/geminiService';
import { Image, Upload, Loader2, ShieldAlert, Sparkles, BrainCircuit, X } from 'lucide-react';

interface NeuralVisionProps {
  onUseQuota: () => boolean;
  quota: number;
  onKeyError: () => void;
}

const NeuralVision: React.FC<NeuralVisionProps> = ({ onUseQuota, quota, onKeyError }) => {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
        setAnalysis('');
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!imageBase64 || loading) return;
    if (!onUseQuota()) {
      setError("Quota harian habis.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Fix: chatWithVoxyStream expects attachments array as 3rd argument
      const stream = await chatWithVoxyStream(
        "Analyze this image for architectural flaws, security risks, or code logic errors.", 
        [], 
        [{ data: imageBase64, mimeType: 'image/jpeg' }]
      );
      let fullText = "";
      for await (const chunk of stream) {
        fullText += chunk.text || "";
        setAnalysis(fullText);
      }
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Neural Vision Scanner</h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Audit Keamanan Visual • Multimodal Engine</p>
        </div>
        {imageBase64 && !loading && (
          <button onClick={startAnalysis} className="px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-sky-500/20 active:scale-95 flex items-center gap-3">
             <BrainCircuit size={18} /> Run Deep Analysis
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`group relative h-[400px] rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all ${
              imageBase64 ? 'border-sky-500/30' : 'border-slate-200 dark:border-slate-800 hover:border-sky-400'
            }`}
          >
            {imageBase64 ? (
              <>
                <img src={imageBase64} className="w-full h-full object-cover opacity-80" alt="Preview" />
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <p className="text-white font-black text-xs uppercase tracking-widest">Klik untuk ganti gambar</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setImageBase64(null); setAnalysis(''); }}
                  className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-red-500 backdrop-blur-md rounded-full text-white transition-all"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <div className="text-center p-12">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-400 group-hover:text-sky-500 group-hover:scale-110 transition-all">
                   <Upload size={32} />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Upload Screenshot</h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2 max-w-[200px] mx-auto">
                  Drag & drop arsitektur, kode, atau log error di sini
                </p>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>
          
          <div className="p-8 bg-sky-500/5 border border-sky-500/10 rounded-[2.5rem] flex items-start gap-4">
             <div className="p-3 bg-sky-500 text-white rounded-2xl">
                <ShieldAlert size={20} />
             </div>
             <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase">Voxy Visual Logic</h4>
                <p className="text-xs font-bold text-slate-400 leading-relaxed mt-1">
                  Scanner ini menggunakan model Gemini 3 Flash untuk memahami pola serangan visual dan kerentanan arsitektur cloud.
                </p>
             </div>
          </div>
        </div>

        <div className="glass-card rounded-[3rem] p-10 flex flex-col border border-slate-100 dark:border-slate-800 min-h-[500px]">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <Sparkles size={20} className="text-sky-500 animate-pulse" />
                 <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Analysis Result</span>
              </div>
              {loading && <Loader2 className="animate-spin text-sky-500" size={18} />}
           </div>

           {analysis ? (
             <div className="flex-1 overflow-y-auto custom-scrollbar prose prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                {analysis}
             </div>
           ) : loading ? (
             <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-16 h-16 bg-sky-500/10 rounded-full flex items-center justify-center animate-pulse">
                   <BrainCircuit size={32} className="text-sky-500 animate-spin-slow" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Decoding Neural Patterns...</p>
             </div>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 grayscale">
                <Image size={64} className="text-slate-400 mb-6" />
                <p className="text-[10px] font-black uppercase tracking-widest">Silakan upload gambar untuk memulai</p>
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

export default NeuralVision;
