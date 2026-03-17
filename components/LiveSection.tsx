
import React, { useState, useEffect, useRef } from 'react';
import { Lock } from './Icons';

const LiveSection: React.FC = () => {
  const [messages, setMessages] = useState([
    { user: 'Master_SP', text: 'Você é perfeita Sofia! 🔥', color: 'text-blue-400' },
    { user: 'LoverBoy', text: 'Que delícia de lingerie...', color: 'text-pink-400' },
    { user: 'VipKing', text: 'Mandei presente, faz pose! 💎', color: 'text-amber-400', isTip: true },
  ]);
  const [viewers, setViewers] = useState(14580);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      const users = ['Safadinho', 'TopFã', 'Rich_Guy', 'Ghost', 'Anônimo'];
      const msgs = ['Dá uma voltinha!', 'Mostra os pés...', 'Linda demais', 'Vem pv?', 'Tira tudo!'];
      const newMsg = {
        user: users[Math.floor(Math.random() * users.length)],
        text: msgs[Math.floor(Math.random() * msgs.length)],
        color: 'text-zinc-400',
        isTip: Math.random() > 0.90
      };
      setMessages(prev => [...prev.slice(-15), newMsg]);
      setViewers(v => v + Math.floor(Math.random() * 50) - 10);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[calc(100vh-200px)] min-h-[500px] overflow-hidden rounded-xl border border-zinc-800 bg-black flex flex-col lg:flex-row">
      <div className="flex-1 bg-black relative">
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur px-3 py-1.5 rounded-full border border-zinc-700">
          <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></span>
          <span className="text-white font-bold text-sm">AO VIVO</span>
          <span className="text-zinc-400 text-xs border-l border-zinc-600 pl-2 ml-1">{(viewers / 1000).toFixed(1)}k assistindo</span>
        </div>

        {/* Vídeo da Live Sofia */}
        <video 
          src="https://secreto.meuprivacy.digital/acesso/video24.mp4" 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover"
        />
        
        <div className="absolute bottom-4 left-4 z-10 hidden md:block">
           <div className="bg-black/40 backdrop-blur-md p-3 rounded-lg border border-white/10 text-white">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Meta do Show</p>
              <p className="text-sm">Ficar totalmente pelada: 2500/5000 💎</p>
           </div>
        </div>
      </div>

      <div className="w-full lg:w-80 bg-zinc-900 flex flex-col border-l border-zinc-800">
        <div className="p-3 border-b border-zinc-800 font-bold text-zinc-300">Chat Exclusivo</div>
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {messages.map((msg, idx) => (
            <div key={idx} className={`text-sm ${msg.isTip ? 'bg-amber-400/10 p-2 rounded border border-amber-400/20' : ''}`}>
              <span className={`font-bold ${msg.color} mr-2`}>{msg.user}:</span>
              <span className="text-zinc-300">{msg.text}</span>
              {msg.isTip && <span className="block text-amber-500 text-[10px] font-bold mt-1">Enviou Presente 💎</span>}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="p-3 border-t border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-2">
            <input 
                disabled 
                placeholder="Envie uma mensagem..." 
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-full py-2 px-4 text-xs text-white opacity-50 cursor-not-allowed"
            />
            <button className="bg-zinc-800 p-2 rounded-full opacity-50"><Lock size={16}/></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveSection;
