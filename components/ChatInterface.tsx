
import React, { useState, useRef, useEffect } from 'react';
import { chatWithAi } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, User, Sparkles } from 'lucide-react';
import LongPressableText from './LongPressableText';

interface ChatInterfaceProps {
  language?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ language = 'en' }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const initialText = language === 'fr'
      ? "As-salamu alaykum ! Je suis Sabildeen, votre compagnon IA. Comment puis-je vous aider dans votre cheminement spirituel aujourd'hui ?"
      : "As-salamu alaykum! I am Sabildeen, your AI companion. How can I help you with your spiritual journey today?";
      
    setMessages([{
      id: '1',
      role: 'model',
      text: initialText,
      timestamp: Date.now()
    }]);
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    if (!navigator.onLine) {
        const offlineMsg: ChatMessage = {
          id: Date.now().toString(),
          role: 'model',
          text: language === 'fr' 
             ? "Vous êtes actuellement hors connexion. La discussion avec l'IA nécessite une connexion internet." 
             : "You are currently offline. Chatting with the AI requires an internet connection.",
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, offlineMsg]);
        return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
    }));

    const responseText = await chatWithAi(userMsg.text, history, language);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  const placeholder = language === 'fr' ? "Interrogez Sabildeen sur l'Islam..." : "Ask Sabildeen about Islam...";

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[600px] bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner transition-colors duration-300">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] md:max-w-[75%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-emerald-100 dark:bg-emerald-900/30'}`}>
                {msg.role === 'user' ? <User size={16} className="text-slate-600 dark:text-slate-300" /> : <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400" />}
              </div>
              
              <LongPressableText
                text={msg.text}
                language={language}
                className={`p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm border border-slate-100 dark:border-slate-700 rounded-tl-none'
                }`}
              />
            </div>
          </div>
        ))}
        {loading && (
           <div className="flex justify-start">
             <div className="flex max-w-[85%] gap-2">
               <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                 <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400 animate-pulse" />
               </div>
               <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 dark:border-slate-700">
                 <div className="flex gap-1">
                   <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
                   <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-100"></span>
                   <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-200"></span>
                 </div>
               </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={placeholder}
            className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-slate-100 transition-all text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="w-12 h-12 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all shadow-md active:scale-95"
          >
            <Send size={20} className={loading ? 'opacity-0' : 'ml-0.5'} />
            {loading && <div className="absolute inset-0 flex items-center justify-center"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div></div>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
