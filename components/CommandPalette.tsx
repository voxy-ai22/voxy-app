
import React, { useState, useEffect } from 'react';
import { Search, LayoutDashboard, ShieldAlert, Zap, MessageSquare, Image, SearchCode, Replace, Command, X } from 'lucide-react';
import { ToolType } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (tool: ToolType) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onSelect }) => {
  const [search, setSearch] = useState('');
  
  const options = [
    { id: ToolType.DASHBOARD, label: 'System Dashboard', icon: LayoutDashboard, desc: 'Real-time performance monitoring' },
    { id: ToolType.INTELLIGENCE_CHAT, label: 'AI Intelligence Chat', icon: MessageSquare, desc: 'Advanced neural chat protocols' },
    { id: ToolType.VISION, label: 'Neural Vision Scanner', icon: Image, desc: 'Visual architectural audit' },
    { id: ToolType.WEB_MASTER, label: 'Security Auditor', icon: ShieldAlert, desc: 'Code vulnerability detection' },
    { id: ToolType.SENTINEL, label: 'Voxy Sentinel', icon: SearchCode, desc: 'Dependency and CVE scanning' },
    { id: ToolType.BRIDGE, label: 'Neural Bridge', icon: Replace, desc: 'Secure code transpilation' },
    { id: ToolType.LOGIC_FIXER, label: 'Script Generator', icon: Zap, desc: 'Automated secure scripts' },
  ];

  const filtered = options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    if (!isOpen) setSearch('');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 md:px-0">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="w-full max-w-2xl bg-white dark:bg-navy-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in slide-in-from-top-4 duration-300 relative z-10">
        <div className="flex items-center px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
           <Search size={20} className="text-slate-400 mr-4" />
           <input 
             autoFocus
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             placeholder="Search modules or run commands..."
             className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-white font-black text-sm uppercase tracking-widest placeholder:text-slate-300 dark:placeholder:text-slate-600"
           />
           <div className="flex items-center gap-2">
              <span className="bg-slate-200 dark:bg-slate-700 text-slate-500 px-2 py-1 rounded text-[10px] font-bold">ESC</span>
              <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all">
                <X size={16} className="text-slate-400" />
              </button>
           </div>
        </div>

        <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
           {filtered.length > 0 ? (
             <div className="space-y-1">
                {filtered.map(o => (
                  <button 
                    key={o.id}
                    onClick={() => onSelect(o.id)}
                    className="w-full flex items-center gap-5 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left group"
                  >
                    <div className="p-3 bg-slate-100 dark:bg-slate-700 text-slate-400 group-hover:text-sky-500 rounded-xl transition-all">
                      <o.icon size={20} />
                    </div>
                    <div className="flex-1">
                       <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{o.label}</h4>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{o.desc}</p>
                    </div>
                    <Command size={14} className="text-slate-200 dark:text-slate-700 opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
             </div>
           ) : (
             <div className="p-12 text-center">
                <Search size={40} className="text-slate-200 mx-auto mb-4" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No results found for "{search}"</p>
             </div>
           )}
        </div>

        <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
           <div className="flex gap-4">
              <div className="flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Neural Link Enabled</span>
              </div>
           </div>
           <p className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest italic">Voxy OS v4.5.0</p>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
