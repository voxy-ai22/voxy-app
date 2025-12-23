
import React from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';

interface VoxyBubbleProps {
  onOpenChat: () => void;
}

const VoxyBubble: React.FC<VoxyBubbleProps> = ({ onOpenChat }) => {
  return (
    <button 
      onClick={onOpenChat}
      className="fixed bottom-8 right-8 w-16 h-16 bg-slate-900 dark:bg-sky-500 rounded-[2rem] shadow-2xl flex items-center justify-center text-white z-[90] hover:scale-110 active:scale-90 transition-all group overflow-hidden"
      title="Quick Intelligence"
    >
      <div className="absolute inset-0 bg-sky-500/10 dark:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative z-10">
        <MessageSquare size={24} className="group-hover:hidden" />
        <Sparkles size={24} className="hidden group-hover:block animate-pulse text-sky-400 dark:text-white" />
      </div>
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-navy-950 animate-pulse"></div>
    </button>
  );
};

export default VoxyBubble;
