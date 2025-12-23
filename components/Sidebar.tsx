import React from 'react';
import { ToolType, ChatHistoryItem, UserRole } from '../types';
import { LayoutDashboard, ShieldAlert, Zap, MessageSquare, Trash2, Key, Layout, Image, SearchCode, Replace, RefreshCcw } from 'lucide-react';

interface SidebarProps {
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
  history: ChatHistoryItem[];
  onClearHistory: () => void;
  onSelectHistory: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
  onSyncKey?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTool, setActiveTool, history, onClearHistory, onSelectHistory, isOpen, onClose, userRole, onSyncKey }) => {
  
  const menuItems = [
    { id: ToolType.DASHBOARD, label: 'Monitor Sistem', icon: LayoutDashboard },
    { id: ToolType.INTELLIGENCE_CHAT, label: 'Voxy Intelligence', icon: MessageSquare },
    { id: ToolType.VISION, label: 'Neural Vision', icon: Image },
    { id: ToolType.WEB_MASTER, label: 'Audit Kerentanan', icon: ShieldAlert },
    { id: ToolType.SENTINEL, label: 'Voxy Sentinel', icon: SearchCode },
    { id: ToolType.BRIDGE, label: 'Neural Bridge', icon: Replace },
    { id: ToolType.LOGIC_FIXER, label: 'Script Gen', icon: Zap },
  ];

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden" onClick={onClose}></div>}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-navy-900 border-r border-slate-100 dark:border-slate-800 flex flex-col transition-all duration-300 md:relative md:translate-x-0 ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 dark:bg-sky-500 w-10 h-10 rounded-xl flex items-center justify-center text-sky-400 dark:text-white shadow-lg">
              <span className="text-xl font-black font-mono">V</span>
            </div>
            <div>
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Voxy <span className="text-sky-500">Ai</span></span>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">By Gobel Developer</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="pb-2 px-4 text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Main Modules</div>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTool(item.id); if(isOpen) onClose(); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                activeTool === item.id 
                  ? 'bg-slate-900 dark:bg-sky-600 text-white shadow-lg' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={16} className={activeTool === item.id ? 'text-sky-400 dark:text-white' : 'group-hover:text-sky-500'} />
                <span className="text-[11px] font-bold tracking-tight">{item.label}</span>
              </div>
            </button>
          ))}

          <div className="pt-6 pb-2 px-4 text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">System Protocols</div>
          <button 
            onClick={onSyncKey}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-sky-50 dark:hover:bg-sky-500/10 hover:text-sky-500 transition-all"
          >
             <RefreshCcw size={16} />
             <span className="text-[11px] font-bold tracking-tight">Sync Neural Key</span>
          </button>

          <div className="pt-8 pb-3 px-4 flex justify-between items-center text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">
            <span>Recent Neural Logs</span>
            <button onClick={onClearHistory} title="Clean" className="hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
          </div>
          <div className="space-y-1 px-1 pb-6">
            {history.length === 0 ? (
              <div className="p-3 text-center text-[9px] font-bold text-slate-300 uppercase italic">Empty</div>
            ) : (
              history.slice(0, 5).map(h => (
                <button key={h.id} onClick={() => onSelectHistory(h.id)} className="w-full text-left p-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-sky-600 rounded-xl truncate transition-all">
                  • {h.title}
                </button>
              ))
            )}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-50 dark:border-slate-800">
           <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-[10px] font-bold text-white">
                {userRole[0]}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-900 dark:text-white leading-none capitalize">{userRole.toLowerCase()}</p>
                <p className="text-[8px] font-bold text-slate-400 mt-0.5">Verified Access</p>
              </div>
           </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;