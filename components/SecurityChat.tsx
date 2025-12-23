
import React, { useState, useRef, useEffect } from 'react';
import { chatWithVoxyStream, VoxyApiError } from '../services/geminiService';
import { Send, User, Loader2, Plus, BrainCircuit, Paperclip, Image as ImageIcon, X, FileText, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import CodeBlock from './CodeBlock';

interface SecurityChatProps {
  onSaveHistory: (messages: ChatMessage[]) => void;
  initialMessages: ChatMessage[];
  onNewChat: () => void;
  onUseQuota: () => boolean;
  quota: number;
  onQuotaExhausted?: () => void;
  onKeyError?: () => void;
}

interface AttachedFile {
  id: string;
  name: string;
  type: string;
  data: string; // Base64
  preview?: string;
}

const SecurityChat: React.FC<SecurityChatProps> = ({ 
  onSaveHistory, 
  initialMessages, 
  onNewChat, 
  onUseQuota, 
  quota, 
  onQuotaExhausted,
  onKeyError
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTypingAnimation, setIsTypingAnimation] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [errorStatus, setErrorStatus] = useState<{msg: string, reason: string, type: 'auth' | 'quota' | 'general'} | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const stopTypingRef = useRef<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior });
  };

  useEffect(() => { scrollToBottom(); }, [messages, loading, isThinking]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 350);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        const newFile: AttachedFile = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          data: base64Data,
          preview: file.type.startsWith('image/') ? base64Data : undefined
        };
        setAttachedFiles(prev => [...prev, newFile]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== id));
  };

  const stopGeneration = () => {
    stopTypingRef.current = true;
    setIsTypingAnimation(false);
    setLoading(false);
    setIsThinking(false);
  };

  const typeText = async (fullText: string, messageIndex: number) => {
    setIsTypingAnimation(true);
    stopTypingRef.current = false;
    let currentText = "";
    const letters = fullText.split("");
    
    await new Promise(resolve => setTimeout(resolve, 300));

    for (let i = 0; i < letters.length; i++) {
      if (stopTypingRef.current) break;
      currentText += letters[i];
      
      setMessages(prev => {
        const updated = [...prev];
        if (updated[messageIndex]) {
          updated[messageIndex] = { ...updated[messageIndex], text: currentText };
        }
        return updated;
      });

      await new Promise(resolve => setTimeout(resolve, 5));
    }
    setIsTypingAnimation(false);
  };

  const handleSend = async () => {
    if ((!input.trim() && attachedFiles.length === 0) || loading || isTypingAnimation || isThinking) return;

    if (!onUseQuota()) {
      setErrorStatus({ 
        msg: "Energi Sistem Terbatas", 
        reason: "Quota lokal sedang memulihkan diri.", 
        type: 'quota' 
      });
      return;
    }

    setErrorStatus(null);
    const attachmentsToPayload = attachedFiles.map(f => ({ data: f.data, mimeType: f.type }));
    const userMsgImage = attachedFiles.find(f => f.type.startsWith('image/'))?.data;

    const userMsg: ChatMessage = { 
      role: 'user', 
      text: input || (attachedFiles.length > 0 ? "[Mengirim Lampiran]" : ""), 
      timestamp: Date.now(),
      image: userMsgImage 
    };

    const currentMessages = [...messages, userMsg];
    setMessages(currentMessages);
    const originalInput = input;
    
    setInput('');
    setAttachedFiles([]);
    setLoading(true);
    setIsThinking(true);

    try {
      const stream = await chatWithVoxyStream(originalInput || "Analisis lampiran ini", messages, attachmentsToPayload);
      let fullContent = '';
      
      setMessages(prev => [...prev, { role: 'model', text: '', timestamp: Date.now() }]);
      const modelMsgIndex = currentMessages.length;

      for await (const chunk of stream) {
        if (stopTypingRef.current) break;
        fullContent += chunk.text || '';
      }

      setLoading(false);
      setIsThinking(false);

      if (!stopTypingRef.current) {
        await typeText(fullContent, modelMsgIndex);
        onSaveHistory([...currentMessages, { role: 'model', text: fullContent, timestamp: Date.now() }]);
      }
    } catch (err: any) {
      setLoading(false);
      setIsThinking(false);
      setIsTypingAnimation(false);
      
      const voxyError = err as VoxyApiError;
      setErrorStatus({ msg: voxyError.message || "Link Failure", reason: voxyError.reason || "Gangguan transmisi.", type: voxyError.isAuthError ? 'auth' : 'general' });
      
      setMessages(prev => {
        const updated = [...prev];
        if (updated[updated.length - 1]?.role === 'model' && updated[updated.length - 1].text === '') {
          updated[updated.length - 1].text = `[ERROR]: ${voxyError.reason}`;
          return updated;
        }
        return [...prev, { role: 'model', text: `[CRITICAL]: ${voxyError.reason}`, timestamp: Date.now() }];
      });
      if (voxyError.isAuthError) onKeyError?.();
      if (voxyError.isQuotaError) onQuotaExhausted?.();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] w-full max-w-5xl mx-auto relative glass-card rounded-[3rem] overflow-hidden shadow-2xl border border-white/50 animate-smooth dark:bg-navy-900/40">
      <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-navy-900/60 backdrop-blur-xl z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 dark:bg-sky-500 rounded-2xl flex items-center justify-center text-white shadow-xl">
            <span className="text-2xl font-black font-mono">V</span>
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight uppercase">Voxy Ai</h3>
            <div className="flex items-center gap-2 mt-0.5">
               <div className={`w-1.5 h-1.5 rounded-full ${quota > 0 && !loading ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-ping'}`}></div>
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                 {isThinking ? 'Processing Intelligence...' : 'Neural Link Ready'}
               </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
           <button onClick={onNewChat} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-sky-600 rounded-2xl transition-all border border-slate-100 dark:border-slate-700">
             <Plus size={20} />
           </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 custom-scrollbar bg-slate-50/20 dark:bg-transparent">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-smooth">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-sky-500/20 blur-[60px] rounded-full"></div>
              <div className="w-24 h-24 bg-slate-900 dark:bg-sky-500 rounded-[2.5rem] flex items-center justify-center text-white relative shadow-2xl">
                 <span className="text-5xl font-black font-mono">V</span>
              </div>
            </div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-4">
              Selamat datang di Voxy Ai
            </h2>
            <div className="flex flex-col items-center gap-2 max-w-sm">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] leading-relaxed">
                Asisten Keamanan & Arsitektur Neural Anda.<br/>
                Audit kode, kirim foto, atau baca file log dalam satu perintah.
              </p>
              <div className="mt-6 flex gap-3">
                 <span className="px-4 py-1.5 bg-sky-50 dark:bg-sky-500/10 border border-sky-100 dark:border-sky-500/20 rounded-full text-[9px] font-black text-sky-600 dark:text-sky-400 uppercase tracking-widest flex items-center gap-2">
                   <Sparkles size={12} /> Intelligent Audit
                 </span>
                 <span className="px-4 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest">
                   Encrypted Channel
                 </span>
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-smooth`}>
              <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center shadow-lg ${
                msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-sky-500'
              }`}>
                {msg.role === 'user' ? <User size={20} /> : <span className="font-mono font-black text-xl">V</span>}
              </div>

              <div className={`max-w-[85%] rounded-[2.5rem] px-8 py-6 text-sm leading-relaxed relative transition-all shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-sky-500 text-white rounded-tr-none' 
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none'
              }`}>
                {msg.image && (
                  <div className="mb-4 rounded-2xl overflow-hidden border border-white/20 shadow-md">
                     <img src={msg.image} alt="User Attachment" className="max-h-60 w-full object-cover" />
                  </div>
                )}
                <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                   {msg.text === '' && msg.role === 'model' && (isThinking || loading) ? (
                      <div className="flex flex-col gap-3 py-2">
                         <div className="flex items-center gap-3 text-sky-500 font-black text-[10px] uppercase tracking-widest animate-pulse">
                            <BrainCircuit size={14} className="animate-spin-slow" /> Voxy is scanning...
                         </div>
                      </div>
                   ) : (
                     msg.text.split('```').map((part, index) => (
                       index % 2 === 1 ? <CodeBlock key={index} code={part.trim()} /> : <p key={index} className="whitespace-pre-wrap">{part}</p>
                     ))
                   )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-8 bg-white dark:bg-navy-900 border-t border-slate-100 dark:border-slate-800 relative">
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4 animate-smooth">
            {attachedFiles.map(file => (
              <div key={file.id} className="relative group w-24 h-24 rounded-2xl overflow-hidden border-2 border-sky-500/30 shadow-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                 {file.preview ? (
                   <img src={file.preview} className="w-full h-full object-cover" alt="Preview" />
                 ) : (
                   <div className="flex flex-col items-center gap-1 text-slate-400">
                      <FileText size={24} />
                      <span className="text-[8px] font-black truncate px-2 w-full text-center">{file.name}</span>
                   </div>
                 )}
                 <button 
                  onClick={() => removeAttachment(file.id)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                 >
                   <X size={12} />
                 </button>
              </div>
            ))}
          </div>
        )}

        {(isTypingAnimation || loading || isThinking) && (
          <button onClick={stopGeneration} className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl border-2 border-white dark:border-navy-950 z-20">
             STOP NEURAL STREAM
          </button>
        )}

        <div className={`flex flex-col bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-4 transition-all focus-within:ring-4 focus-within:ring-sky-500/5`}>
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={quota <= 0 || loading || isThinking}
            placeholder="Tulis pesan atau kirim file untuk di-audit..."
            className="w-full bg-transparent px-4 py-3 text-sm font-bold outline-none text-slate-800 dark:text-white placeholder:text-slate-300 resize-none max-h-[250px] custom-scrollbar"
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          />
          <div className="flex items-center justify-between mt-2 px-2">
              <div className="flex gap-2">
                 <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-500/10 rounded-xl transition-all"
                  title="Lampirkan File"
                 >
                    <Paperclip size={20} />
                 </button>
                 <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-500/10 rounded-xl transition-all"
                  title="Kirim Foto"
                 >
                    <ImageIcon size={20} />
                 </button>
                 <input 
                  type="file" 
                  ref={fileInputRef} 
                  multiple 
                  className="hidden" 
                  onChange={handleFileUpload}
                 />
              </div>
              <button
                onClick={handleSend}
                disabled={(!input.trim() && attachedFiles.length === 0) || loading || quota <= 0 || isThinking}
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xl ${loading || isThinking ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 dark:bg-sky-500 text-white hover:scale-110 active:scale-90 transition-all'}`}
              >
                {loading || isThinking ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityChat;
