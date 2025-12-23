
import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'code' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Gagal menyalin kode:', err);
    }
  };

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900 group">
      {/* Code Bar / Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-blue-400" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
            {language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-slate-700 transition-colors group/btn"
          title="Salin Kode"
        >
          {copied ? (
            <Check size={14} className="text-emerald-400" />
          ) : (
            <Copy size={14} className="text-slate-400 group-hover/btn:text-white" />
          )}
          <span className={`text-[10px] font-bold uppercase tracking-tight ${copied ? 'text-emerald-400' : 'text-slate-400 group-hover/btn:text-white'}`}>
            {copied ? 'Tersalin!' : 'Salin'}
          </span>
        </button>
      </div>
      
      {/* Code Content */}
      <div className="p-5 overflow-x-auto custom-scrollbar">
        <pre className="text-sm font-mono text-slate-100 leading-relaxed whitespace-pre">
          <code>{code.trim()}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
