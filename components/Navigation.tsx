
import React from 'react';
import { TabType } from '../types';
import { Grid, Video, Radio, ImageIcon, ShieldAlert } from './Icons';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: TabType; label: string; icon: React.ElementType; highlight?: 'red' | 'standard' }[] = [
    { id: 'feed', label: 'Feed', icon: Grid },
    { id: 'photos', label: 'Fotos', icon: ImageIcon },
    { id: 'videos', label: 'Vídeos', icon: Video },
    { id: 'vazados', label: 'Vazados', icon: ShieldAlert, highlight: 'red' },
    { id: 'live', label: 'Ao Vivo', icon: Radio, highlight: 'red' },
  ];

  return (
    <div className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
      <div className="container mx-auto px-2">
        <nav className="flex items-center justify-between md:justify-center overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            const isRed = tab.highlight === 'red';
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-4 md:px-8 text-sm md:text-base font-medium transition-all relative whitespace-nowrap
                  ${isActive 
                    ? (isRed ? 'text-red-500' : 'text-white') 
                    : 'text-zinc-500 hover:text-zinc-300'}
                `}
              >
                <Icon className={`w-5 h-5 ${isRed ? 'text-red-500' : ''} ${isRed && isActive ? 'animate-pulse' : ''}`} />
                <span className={`${isRed ? 'text-red-500 font-bold' : ''}`}>{tab.label}</span>
                
                {isActive && (
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 ${isRed ? 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.7)]' : 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)]'}`} />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
