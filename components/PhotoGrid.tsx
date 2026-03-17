
import React, { useState } from 'react';
import { Lock, Heart, ImageIcon, X, Gem } from './Icons';

interface PhotoGridProps {
  onOpenSubscription: () => void;
  isVip: boolean;
}

interface PhotoItem {
  id: number;
  url: string;
  isLocked: boolean;
  likes: number;
  caption: string;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ onOpenSubscription, isVip }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  const photos = Array.from({ length: 48 }).map((_, i) => ({
    id: i,
    url: `https://secreto.meuprivacy.digital/acesso/foto${i + 1}.jpg`,
    // Usa uma lógica matemática semi-aleatória (ou pelo índice) para bloquear em média 20 a 25 mídias
    isLocked: (i % 3 === 0) || (i % 7 === 0) || (i > 30 && i % 2 !== 0),  
    likes: Math.floor(Math.random() * 8000) + 1000,
    caption: `Set Sofia Oliveira #${i + 1}`
  }));

  const handlePhotoClick = (photo: PhotoItem) => {
    const locked = photo.isLocked && !isVip;
    if (locked) {
      onOpenSubscription();
    } else {
      setSelectedPhoto(photo);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/50 rounded-2xl border border-zinc-800 shadow-lg">
        <h3 className="text-white text-lg font-black uppercase tracking-tighter flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-amber-400" /> Galeria Privada
        </h3>
        <span className="bg-amber-500/10 text-amber-400 text-xs font-black px-4 py-1.5 rounded-full border border-amber-500/20">
          48 MÍDIAS
        </span>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {photos.map((photo) => {
          const locked = photo.isLocked && !isVip;
          return (
            <div 
              key={photo.id} 
              className="relative aspect-[3/4] group overflow-hidden bg-zinc-900 rounded-xl cursor-pointer border border-zinc-800/50 hover:border-amber-400/50 transition-all shadow-md"
              onClick={() => handlePhotoClick(photo)}
            >
              {/* Overlay de Proteção Transparente */}
              <div className="absolute inset-0 z-20 bg-transparent"></div>
              
              <img 
                src={photo.url} 
                alt="Foto" 
                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${locked ? 'blur-lg opacity-40 scale-105' : 'opacity-90 group-hover:opacity-100'}`}
                loading="lazy"
              />
              {locked ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center z-30">
                  <Lock className="w-6 h-6 text-white mb-1 drop-shadow-lg" />
                  <span className="bg-amber-400 text-black px-2 py-0.5 rounded-md font-black text-[8px] uppercase">VIP</span>
                </div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2 z-10">
                    <div className="flex items-center gap-1 text-white">
                        <Heart className="w-3 h-3 fill-white" />
                        <span className="text-[10px] font-bold">{photo.likes}</span>
                        {photo.isLocked && isVip && <Gem size={10} className="text-amber-400 ml-1" />}
                    </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedPhoto && (
        <div 
            className="fixed inset-0 w-screen h-screen z-[100] bg-black/95 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm"
            onClick={() => setSelectedPhoto(null)}
        >
          <button className="absolute top-6 right-6 z-[110] text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors"><X size={24}/></button>
          <div className="relative max-h-screen max-w-5xl" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
             {/* Overlay de Proteção no Modal */}
             <div className="absolute inset-0 z-10 bg-transparent"></div>
             
             <img src={selectedPhoto.url} className="max-h-[90vh] max-w-full object-contain rounded-2xl shadow-2xl border border-zinc-800" alt="Full view" />
             
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 px-6 py-2 rounded-full backdrop-blur-md border border-white/10 z-20">
                <p className="text-white text-sm font-bold">{selectedPhoto.caption}</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGrid;
