
import React from 'react';
import { Lock, AlertTriangle } from 'lucide-react';

interface LeakAdCardProps {
  onClick: () => void;
}

const LeakAdCard: React.FC<LeakAdCardProps> = ({ onClick }) => {
  return (
    <div className={`
      group cursor-pointer z-40
      relative w-72 mx-auto mb-8
      md:fixed md:bottom-10 md:right-10 md:w-72 md:mx-0 md:mb-0
      animate-fade-in-up
    `}>
      <div 
        className="relative bg-zinc-950 border-2 border-red-600 rounded-2xl shadow-[0_0_40px_rgba(220,38,38,0.3)] overflow-hidden hover:border-red-500 hover:shadow-[0_0_60px_rgba(220,38,38,0.5)] transition-all duration-300 transform md:hover:scale-105 flex flex-col"
        onClick={onClick}
      >
        <div className="relative h-44 w-full overflow-hidden">
          <img 
            src="https://secreto.meuprivacy.digital/acesso/foto6.jpg" 
            alt="Leak" 
            className="w-full h-full object-cover blur-[4px] opacity-60 group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="bg-red-600/90 p-4 rounded-full border-2 border-white/20 backdrop-blur-sm shadow-[0_0_20px_rgba(220,38,38,0.8)] animate-pulse-slow">
               <Lock className="w-8 h-8 text-white" />
             </div>
          </div>
          <div className="absolute top-4 -right-10 bg-red-600 text-white text-[10px] font-black uppercase py-1.5 w-40 text-center rotate-[45deg] shadow-lg border-y border-white/20 tracking-widest">
            VAZOU 2025
          </div>
        </div>

        <div className="p-5 bg-zinc-950 flex flex-col items-center text-center relative">
           <div className="absolute -top-4 bg-white text-red-600 text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></span> URGENTE
           </div>

           <h4 className="text-white font-black text-2xl leading-[0.9] mb-2 uppercase italic tracking-tighter mt-2">
              CONTEÚDO <br/> <span className="text-red-600">VAZADO</span>
           </h4>
           
           <p className="text-zinc-500 text-[11px] leading-tight mb-4 font-bold uppercase tracking-tight">
              Os Vídeos mais bizarros que você <br/> não encontrará em lugar nenhum
           </p>
           
           <div className="w-full bg-red-600 hover:bg-red-500 text-white rounded-xl py-4 flex items-center justify-center transition-colors shadow-lg">
             <span className="text-sm font-black uppercase italic tracking-wider">ACESSAR AGORA!</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LeakAdCard;
