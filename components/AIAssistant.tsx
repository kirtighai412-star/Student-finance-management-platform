
import React, { useState, useRef, useEffect } from 'react';
import { getFinancialAdvice } from '../services/geminiService';
import { PaperAirplaneIcon, SparklesIcon, UserIcon, MicrophoneIcon, StopIcon, CommandLineIcon } from '@heroicons/react/24/solid';

interface AIAssistantProps {
  context: any;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ context }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Namaste ${context.profile.name.split(' ')[0]}! 👋 I've just synced your wallet and fee targets. I see you're ${Math.round((context.wallet.balance / 50000) * 100)}% toward your monthly savings goal. What shall we optimize today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    
    const aiResponse = await getFinancialAdvice(input, context);
    
    setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] bg-white dark:bg-slate-900 rounded-[48px] overflow-hidden shadow-premium border border-slate-50 dark:border-slate-800 relative animate-in fade-in duration-700">
      <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl z-20">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl brand-gradient flex items-center justify-center text-white shadow-lg shadow-brand/20">
            <SparklesIcon className="w-8 h-8" />
          </div>
          <div>
             <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Wealth Guru</h2>
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-brand rounded-full animate-pulse"></span>
                <p className="text-[10px] text-brand font-black uppercase tracking-[0.2em]">Live Analysis Active</p>
             </div>
          </div>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => setIsVoiceActive(!isVoiceActive)}
             className={`p-4 rounded-2xl transition-all ${isVoiceActive ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-brand'}`}
           >
             {isVoiceActive ? <StopIcon className="w-5 h-5" /> : <MicrophoneIcon className="w-5 h-5" />}
           </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar scroll-smooth">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-500`}>
            <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-brand text-white' : 'bg-slate-100 dark:bg-slate-800 text-brand'}`}>
                {msg.role === 'user' ? <UserIcon className="w-5 h-5" /> : <CommandLineIcon className="w-5 h-5" />}
              </div>
              <div className={`p-6 rounded-[32px] text-base leading-relaxed font-semibold shadow-sm ${msg.role === 'user' ? 'bg-brand text-white rounded-tr-none' : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700'}`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="flex gap-4 items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
              <div className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Analyzing Portfolios</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md border-t border-slate-100 dark:border-slate-800">
        <div className="relative group">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
            placeholder="Ask about Nifty 50, your budget, or gold prices..." 
            className="w-full bg-white dark:bg-slate-900 border-2 border-transparent focus:border-brand/20 rounded-[28px] py-6 pl-8 pr-20 text-base font-bold shadow-inner outline-none transition-all placeholder:text-slate-300" 
          />
          <button 
            onClick={handleSend} 
            disabled={isLoading || !input.trim()} 
            className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 bg-brand text-white rounded-[20px] flex items-center justify-center shadow-lg shadow-brand/20 active:scale-95 disabled:opacity-30 transition-all"
          >
            <PaperAirplaneIcon className="w-7 h-7 -rotate-45" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
