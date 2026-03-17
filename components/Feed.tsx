
import React from 'react';
import { Heart, MessageCircle, Gem, Lock } from './Icons';

interface FeedProps {
  onOpenSubscription: () => void;
  isVip: boolean;
}

const Feed: React.FC<FeedProps> = ({ onOpenSubscription, isVip }) => {
  const posts = [
    {
      id: 1,
      text: "POV: Você me flagrou tirando a roupa da máquina e eu decidi te dar um showzinho... o que achou dessa vista? 🍑🧺",
      mediaUrl: "https://secreto.meuprivacy.digital/acesso/foto15.jpg",
      isVideo: false,
      likes: "4.8k",
      comments: "342",
      isLocked: false
    },
    {
      id: 2,
      text: "O clima esquentou aqui com a minha amiga... Olha como a gente se diverte quando vocês não estão vendo. Chupando com vontade! 🎥👯‍♀️💦",
      mediaUrl: "https://secreto.meuprivacy.digital/acesso/video3.mp4",
      thumbnail: "https://secreto.meuprivacy.digital/acesso/foto3.jpg",
      isVideo: true,
      likes: "10.2k",
      comments: "610",
      isLocked: true
    },
    {
      id: 3,
      text: "Aquele check-in básico no espelho pra garantir que tudo continua no lugar... e bem grande, né? 😉👀🍑",
      mediaUrl: "https://secreto.meuprivacy.digital/acesso/foto8.jpg",
      isVideo: false,
      likes: "5.4k",
      comments: "215",
      isLocked: false
    },
    {
      id: 4,
      text: "Gravei o momento exato em que ele decidiu me pegar por trás sem aviso... a pressão foi absurda e eu amei cada segundo! 🔊🤤🔞",
      mediaUrl: "https://secreto.meuprivacy.digital/acesso/video12.mp4",
      thumbnail: "https://secreto.meuprivacy.digital/acesso/foto12.jpg",
      isVideo: true,
      likes: "12.7k",
      comments: "840",
      isLocked: true
    },
    {
      id: 5,
      text: "Disseram que essa pose valoriza... Eu acho que valoriza até demais. Dá conta de encarar esse rabão empinado? 🍑🔥",
      mediaUrl: "https://secreto.meuprivacy.digital/acesso/foto27.jpg",
      isVideo: false,
      likes: "7.1k",
      comments: "430",
      isLocked: false
    },
    {
      id: 6,
      text: "A carinha é de anjo, mas a vontade é de ser pega de jeito, sem dó e no capricho. Quem aqui se candidata? 😈🔥",
      mediaUrl: "https://secreto.meuprivacy.digital/acesso/foto40.jpg",
      isVideo: false,
      likes: "9.8k",
      comments: "1.1k",
      isLocked: true
    },
    {
      id: 7,
      text: "Look de hoje: só o básico para não atrapalhar na hora que a gente começar a brincar... Gostaram da transparência? 👗😏",
      mediaUrl: "https://secreto.meuprivacy.digital/acesso/foto19.jpg",
      isVideo: false,
      likes: "4.2k",
      comments: "180",
      isLocked: false
    },
    {
      id: 8,
      text: "Senti a música e deixei o corpo levar... Olha como eu rebolo gostoso imaginando você bem aqui atrás de mim. 💃🍑💦",
      mediaUrl: "https://secreto.meuprivacy.digital/acesso/video8.mp4",
      thumbnail: "https://secreto.meuprivacy.digital/acesso/foto8.jpg",
      isVideo: true,
      likes: "11.4k",
      comments: "720",
      isLocked: true
    },
    {
      id: 9,
      text: "Se você quer me ver gemendo alto, essa é a posição certa. Minha favorita absoluta para sentir tudo entrar... 🔞🤫",
      mediaUrl: "https://secreto.meuprivacy.digital/acesso/foto33.jpg",
      isVideo: false,
      likes: "8.1k",
      comments: "510",
      isLocked: true
    },
    {
      id: 10,
      text: "Descendo até o chão pra mostrar que a flexibilidade está em dia... e a safadeza também! Rebolando até o final. 🎥🔥📉",
      mediaUrl: "https://secreto.meuprivacy.digital/acesso/video21.mp4",
      thumbnail: "https://secreto.meuprivacy.digital/acesso/foto21.jpg",
      isVideo: true,
      likes: "13.2k",
      comments: "910",
      isLocked: true
    },
    {
      id: 11,
      text: "Sou insaciável e adoro um desafio. A pergunta é simples: você daria conta de me comer a noite toda sem parar? 🍽️😋🔥",
      mediaUrl: "https://secreto.meuprivacy.digital/acesso/foto10.jpg",
      isVideo: false,
      likes: "6.3k",
      comments: "490",
      isLocked: true
    },
    {
      id: 12,
      text: "Aquele combo que a gente ama: primeiro eu te deixo louco com a boca, depois você me pega com toda a força que eu gosto... 🔞🌊🔊",
      mediaUrl: "https://secreto.meuprivacy.digital/acesso/video45.mp4",
      thumbnail: "https://secreto.meuprivacy.digital/acesso/foto45.jpg",
      isVideo: true,
      likes: "21k",
      comments: "2.5k",
      isLocked: true
    },
    {
      id: 13,
      text: "Não consigo pensar em outra coisa hoje... sinto meu corpo queimando de tesão. Alguém vem apagar esse meu fogo? 🌡️🔥🥵",
      mediaUrl: "https://secreto.meuprivacy.digital/acesso/foto44.jpg",
      isVideo: false,
      likes: "32k",
      comments: "4.8k",
      isLocked: true
    }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      {posts.map((post) => {
        const locked = post.isLocked && !isVip;
        return (
          <div key={post.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="https://secreto.meuprivacy.digital/acesso/foto22.jpg" className="w-12 h-12 rounded-full border-2 border-zinc-800" alt="Sofia" />
              </div>
              {post.isLocked && isVip && (
                <div className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 border border-amber-500/20">
                  <Gem size={10} /> VIP DESBLOQUEADO
                </div>
              )}
            </div>
                <div className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 border border-amber-500/20">
                  <Gem size={10} /> VIP DESBLOQUEADO
                </div>
              )}
            </div>

            {/* Content */}
            <div className="px-5 mb-4">
              <p className="text-zinc-200 text-base leading-relaxed italic">"{post.text}"</p>
            </div>

            {/* Media */}
            <div className="relative">
              {/* Proteção para vídeos e fotos no feed */}
              <div className="absolute inset-0 z-10 bg-transparent pointer-events-none"></div>
              
              {locked ? (
                <div className="aspect-[3/4] md:aspect-video w-full bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden">
                  <img src={post.thumbnail || post.mediaUrl} className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-30 scale-110" alt="Locked" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent"></div>
                  
                  <div className="z-10 bg-zinc-900/80 border border-zinc-800/80 p-8 rounded-3xl text-center shadow-2xl backdrop-blur-md max-w-[85%]">
                    <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
                       <Lock className="w-8 h-8 text-amber-400" />
                    </div>
                    <h3 className="text-white font-black text-xl uppercase italic mb-2 tracking-tighter">CONTEÚDO EXCLUSIVO</h3>
                    <p className="text-zinc-400 text-xs mb-6 font-medium">Você precisa ser VIP para espiar isso.</p>
                    <button 
                       onClick={onOpenSubscription} 
                       className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black py-3 rounded-xl font-black uppercase text-sm transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex justify-center items-center gap-2"
                    >
                       ASSINAR POR R$ 4,94 <Gem size={16} className="fill-black" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative w-full bg-black flex items-center justify-center min-h-[300px]">
                  {post.isVideo ? (
                    <video 
                      src={post.mediaUrl} 
                      controls 
                      className="w-full max-h-[700px] object-contain" 
                      poster={post.thumbnail}
                      playsInline
                      controlsList="nodownload"
                    />
                  ) : (
                    <img src={post.mediaUrl} className="w-full h-auto max-h-[800px] object-contain" alt="Post" />
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 flex items-center gap-8 border-t border-zinc-800/50 bg-zinc-900/50">
              <button className="flex items-center gap-2 text-zinc-400 hover:text-amber-400 transition-colors group">
                <Heart className="w-7 h-7 group-active:scale-125 transition-transform" />
                <span className="text-sm font-bold">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-zinc-400 hover:text-blue-400 transition-colors">
                <MessageCircle className="w-7 h-7" />
                <span className="text-sm font-bold">{post.comments}</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Feed;
