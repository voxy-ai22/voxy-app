
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import WebMasterTool from './components/AuditTool';
import ScriptGenTool from './components/LogAnalyzer';
import SecurityChat from './components/SecurityChat';
import NeuralVision from './components/NeuralVision';
import SentinelTool from './components/SentinelTool';
import NeuralBridge from './components/NeuralBridge';
import Auth from './components/Auth';
import CommandPalette from './components/CommandPalette';
import VoxyBubble from './components/VoxyBubble';
import { ToolType, ChatHistoryItem, ChatMessage, UserSession, UserRole } from './types';
import { Power, Menu, ShieldCheck, Zap, Key, RefreshCcw, ExternalLink, CheckCircle2, XCircle, Moon, Sun, Search } from 'lucide-react';

const MAX_QUOTA = 15; 

const App: React.FC = () => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.DASHBOARD);
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [quota, setQuota] = useState(MAX_QUOTA);
  const [hasKey, setHasKey] = useState(localStorage.getItem('voxy_neural_link_trusted') === 'true');
  const [isSyncing, setIsSyncing] = useState(true);
  const [geminiQuotaExhausted, setGeminiQuotaExhausted] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);

  useEffect(() => {
    const savedSession = localStorage.getItem('voxy_session');
    if (savedSession) setSession(JSON.parse(savedSession));
    const savedHistory = localStorage.getItem('voxy_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const checkKeyIntegrity = async () => {
      try {
        const studioSelected = window.aistudio ? await window.aistudio.hasSelectedApiKey() : false;
        const envKeyValid = !!process.env.API_KEY && process.env.API_KEY !== 'undefined';
        const isCurrentlyLinked = studioSelected || envKeyValid;
        
        if (isCurrentlyLinked !== hasKey) {
          setHasKey(isCurrentlyLinked);
          if (isCurrentlyLinked) localStorage.setItem('voxy_neural_link_trusted', 'true');
        }
      } catch (e) {
        setHasKey(!!process.env.API_KEY);
      } finally {
        setIsSyncing(false);
      }
    };

    checkKeyIntegrity();
    const interval = setInterval(checkKeyIntegrity, 5000); 

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [hasKey]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  const handleOpenKeyVault = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
      localStorage.setItem('voxy_neural_link_trusted', 'true');
      setGeminiQuotaExhausted(false);
      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 3000);
    }
  };

  const useQuota = () => {
    if (quota <= 0) return false;
    setQuota(prev => prev - 1);
    return true;
  };

  const handleLogin = (email: string, username: string, role: UserRole) => {
    const newSession: UserSession = { isAuthenticated: true, username, email, loginTime: Date.now(), role };
    setSession(newSession);
    localStorage.setItem('voxy_session', JSON.stringify(newSession));
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem('voxy_session');
    setActiveSessionId(null);
  };

  const saveToHistory = (messages: ChatMessage[]) => {
    if (messages.length === 0) return;
    setHistory(prev => {
      let newHistory;
      const existingIdx = prev.findIndex(h => h.id === activeSessionId);
      if (existingIdx > -1) {
        newHistory = [...prev];
        newHistory[existingIdx] = { ...newHistory[existingIdx], messages, lastModified: Date.now() };
      } else {
        const newId = Math.random().toString(36).substring(7);
        setActiveSessionId(newId);
        const firstUserMsg = messages.find(m => m.role === 'user')?.text || 'Neural Intelligence Log';
        newHistory = [{ id: newId, title: firstUserMsg.slice(0, 30), messages, lastModified: Date.now() }, ...prev];
      }
      localStorage.setItem('voxy_history', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  if (!session?.isAuthenticated) return <Auth onLogin={handleLogin} />;

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'dark bg-navy-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Sidebar 
        activeTool={activeTool} 
        userRole={session.role}
        setActiveTool={(tool) => { setActiveTool(tool); if (tool !== ToolType.INTELLIGENCE_CHAT) setActiveSessionId(null); }} 
        history={history}
        onClearHistory={() => { setHistory([]); localStorage.removeItem('voxy_history'); }}
        onSelectHistory={(id) => { setActiveSessionId(id); setActiveTool(ToolType.INTELLIGENCE_CHAT); }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-20 glass-card border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between px-6 md:px-12 z-40">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsSidebarOpen(true)} className="p-2.5 text-slate-400 hover:text-sky-500 md:hidden bg-slate-100 dark:bg-slate-800 rounded-xl transition-all">
               <Menu size={20} />
             </button>
             
             <div className="flex items-center gap-3">
               <button 
                 onClick={handleOpenKeyVault}
                 className={`flex items-center gap-3 px-6 py-2.5 rounded-2xl border transition-all active:scale-95 group ${
                   hasKey ? 'bg-slate-900 dark:bg-slate-800 border-slate-800 dark:border-slate-700 text-white' : 'bg-red-50 border-red-100 text-red-600 animate-pulse'
                 }`}
               >
                  {hasKey ? <ShieldCheck size={18} className="text-emerald-400" /> : <Key size={18} />}
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] font-black uppercase tracking-widest">{hasKey ? 'Neural Link Active' : 'No Key'}</span>
                    <span className="text-[7px] font-bold opacity-60 uppercase mt-0.5">{hasKey ? 'Encrypted Connection' : 'Click to Input'}</span>
                  </div>
               </button>
             </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setIsPaletteOpen(true)} className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 transition-all text-xs font-bold uppercase tracking-widest">
                <Search size={14} /> <span className="opacity-50">CTRL + K</span>
            </button>
            <button onClick={toggleDarkMode} className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-sky-500 rounded-xl transition-all border border-slate-200 dark:border-slate-700">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={handleLogout} className="p-2.5 text-slate-400 hover:text-red-500 bg-slate-100 dark:bg-slate-800 rounded-xl transition-all border border-slate-200 dark:border-slate-700">
              <Power size={18} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          <div className="max-w-6xl mx-auto h-full">
            <div key={activeTool} className="animate-smooth h-full">
                {activeTool === ToolType.DASHBOARD && <Dashboard />}
                {activeTool === ToolType.WEB_MASTER && <WebMasterTool onUseQuota={useQuota} quota={quota} onQuotaExhausted={() => setGeminiQuotaExhausted(true)} onKeyError={handleOpenKeyVault} />}
                {activeTool === ToolType.LOGIC_FIXER && <ScriptGenTool onUseQuota={useQuota} quota={quota} />}
                {activeTool === ToolType.INTELLIGENCE_CHAT && (
                  <SecurityChat 
                    key={activeSessionId || 'new'} onSaveHistory={saveToHistory} 
                    initialMessages={history.find(h => h.id === activeSessionId)?.messages || []} 
                    onNewChat={() => setActiveSessionId(null)} onUseQuota={useQuota} quota={quota}
                    onQuotaExhausted={() => setGeminiQuotaExhausted(true)} onKeyError={handleOpenKeyVault}
                  />
                )}
                {activeTool === ToolType.VISION && <NeuralVision onUseQuota={useQuota} quota={quota} onKeyError={handleOpenKeyVault} />}
                {activeTool === ToolType.SENTINEL && <SentinelTool onUseQuota={useQuota} quota={quota} onKeyError={handleOpenKeyVault} />}
                {activeTool === ToolType.BRIDGE && <NeuralBridge onUseQuota={useQuota} quota={quota} onKeyError={handleOpenKeyVault} />}
            </div>
          </div>
        </div>
        <VoxyBubble onOpenChat={() => setActiveTool(ToolType.INTELLIGENCE_CHAT)} />
      </main>

      <CommandPalette 
        isOpen={isPaletteOpen} 
        onClose={() => setIsPaletteOpen(false)} 
        onSelect={(tool) => { setActiveTool(tool); setIsPaletteOpen(false); }} 
      />
    </div>
  );
};

export default App;
