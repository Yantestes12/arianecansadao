
import React, { useState, useEffect } from 'react';
import { CreatorProfile } from '../types';
import { MapPin, BadgeCheck, Gem, X, Lock } from './Icons';

interface ProfileHeaderProps {
  profile: CreatorProfile;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  isVip: boolean;
  onPurchase: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, isVip }) => {
  return (
    <div className="relative mb-2">
      <div className="absolute top-4 right-4 z-30">
        {isVip ? (
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-200 bg-gradient-to-r from-amber-300 to-yellow-500 text-black shadow-xl">
              <span className="text-[10px] uppercase font-bold tracking-wider">Status:</span>
              <span className="text-xs font-black uppercase">MEMBRO VIP</span>
              <Gem className="w-3 h-3 text-black fill-black" />
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-700 bg-zinc-900/80 backdrop-blur-md text-white shadow-xl">
              <Lock className="w-3 h-3 text-amber-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">CONTEÚDO PRIVADO</span>
          </div>
        )}
      </div>

      <div className="h-64 md:h-80 w-full overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/20 to-zinc-950 z-10"></div>
        <img 
          src={profile.bannerUrl} 
          alt="Banner" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 relative z-20 -mt-24 flex flex-col md:flex-row items-start gap-6">
        <div className="relative group shrink-0 mx-auto md:mx-0">
          <div className="absolute -inset-1 rounded-full bg-zinc-800"></div>
          <div className="relative w-36 h-36 md:w-48 md:h-48 rounded-full p-1 bg-zinc-950">
            <img 
              src={profile.avatarUrl} 
              alt={profile.name} 
              className="w-full h-full rounded-full object-cover border-4 border-zinc-950"
            />
          </div>
          <div className="absolute bottom-6 right-4 z-20">
             <div className="w-6 h-6 rounded-full border-[3px] border-zinc-950 shadow-lg bg-green-500"></div>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left pt-2 md:pt-12 w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{profile.name}</h1>
                <BadgeCheck className="w-5 h-5 md:w-6 md:h-6 text-zinc-950 fill-yellow-400" />
              </div>
              
              <div className="flex justify-center md:justify-start my-2">
                  <span className="bg-zinc-800 text-zinc-400 border border-zinc-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                      @{profile.handle}
                  </span>
              </div>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-zinc-300 mt-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-zinc-500" /> {profile.location}
                </span>
                <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-xs font-semibold">
                  {profile.age} anos
                </span>
                <span className="font-bold text-white">
                  {profile.subscribers} <span className="text-zinc-400 font-normal">Fãs</span>
                </span>
              </div>

              <div className="mt-4 max-w-2xl mx-auto md:mx-0">
                <p className="text-zinc-300 leading-relaxed text-sm md:text-base italic">
                  "{profile.bio}"
                </p>
              </div>
            </div>

            <div className="mt-6 md:mt-0">
               {isVip ? (
                 <div className="bg-[#1a140a] border border-[#d97706]/40 rounded-[1.5rem] px-6 py-4 flex items-center gap-4 shadow-2xl">
                     <div className="w-12 h-12 rounded-full bg-[#f59e0b] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                         <Gem className="text-black w-6 h-6 fill-black" />
                     </div>
                     <div className="text-left">
                         <p className="text-[#f59e0b] font-black text-sm md:text-base uppercase tracking-tight">MEMBRO VIP ATIVO</p>
                         <p className="text-zinc-400 text-xs md:text-sm font-medium">Você tem acesso a tudo!</p>
                     </div>
                 </div>
               ) : (
                 <div className="flex flex-col items-center md:items-end gap-3">
                   <button 
                     onClick={onPurchase}
                     className="bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest px-8 py-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                   >
                     Desbloquear VIP <Lock size={18} />
                   </button>
                   <span className="text-xs text-zinc-400 font-medium">✨ Por apenas R$ 4,94</span>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
