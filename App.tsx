
import React, { useState, useEffect } from 'react';
import ProfileHeader from './components/ProfileHeader';
import Navigation from './components/Navigation';
import PhotoGrid from './components/PhotoGrid';
import VideoGallery from './components/VideoGallery';
import Feed from './components/Feed';
import LiveSection from './components/LiveSection';
import ExclusiveLeakPage from './components/ExclusiveLeakPage';
import SubmundoVazado from './components/SubmundoVazado';
import LeakAdCard from './components/LeakAdCard';
import PaymentModal from './components/PaymentModal';
import { TabType, CreatorProfile } from './types';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('feed');
  // VIP bloqueado por padrão
  const [isVip, setIsVip] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showLeakPortal, setShowLeakPortal] = useState(false);
  const [directAccessId, setDirectAccessId] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    const validateAccess = async () => {
      const params = new URLSearchParams(window.location.search);
      const accessKey = params.get('access');
      
      if (accessKey) {
        setIsValidating(true);
        try {
          // Consulta o Supabase para verificar se o ID existe e está pago
          const { data, error } = await supabase
            .from('access_keys')
            .select('*')
            .eq('id', accessKey)
            .eq('status', 'paid')
            .single();

          if (data && !error) {
            setDirectAccessId(accessKey);
          } else {
            // Se o ID for inválido ou não pago, limpa a URL
            window.history.pushState({}, '', window.location.pathname);
          }
        } catch (err) {
          console.error("Erro na validação de acesso:", err);
        } finally {
          setIsValidating(false);
        }
      }
    };

    validateAccess();

    if (showLeakPortal || directAccessId) {
      document.title = "SISTEMA_VAZADOS_ROOT";
    } else {
      document.title = "Sofia Oliveira | Perfil VIP";
    }
  }, [showLeakPortal, directAccessId]);

  const profileData: CreatorProfile = {
    name: "Sofia Oliveira",
    handle: "sofia_vip",
    bio: "Seja bem-vindo ao meu lado mais íntimo. Aqui não existem tabus. 🔥 Conteúdo exclusivo, fetiches e bastidores liberados para você, meu assinante VIP.",
    age: 22,
    subscribers: "158.9k",
    location: "Rio de Janeiro, BR",
    tags: ["Amador", "Pés", "POV", "Sereia", "Caseiro"],
    avatarUrl: "https://secreto.meuprivacy.digital/acesso/foto22.jpg",
    bannerUrl: "https://secreto.meuprivacy.digital/acesso/foto5.jpg",
    socials: { instagram: "#", telegram: "#", twitter: "#" }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-red-600 font-black uppercase tracking-widest text-xs animate-pulse">Autenticando ID de Acesso...</p>
      </div>
    );
  }

  if (directAccessId) {
    return <SubmundoVazado accessId={directAccessId} onBack={() => {
      setDirectAccessId(null);
      window.history.pushState({}, '', window.location.pathname);
    }} />;
  }

  if (showLeakPortal) {
    return <ExclusiveLeakPage onBack={() => setShowLeakPortal(false)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'photos': return <PhotoGrid onOpenSubscription={() => setShowPaymentModal(true)} isVip={isVip} />;
      case 'videos': return <VideoGallery onOpenSubscription={() => setShowPaymentModal(true)} isVip={isVip} />;
      case 'live': return <LiveSection />;
      case 'feed':
      default: return <Feed onOpenSubscription={() => setShowPaymentModal(true)} isVip={isVip} />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 pb-10 relative select-none">
      <ProfileHeader 
        profile={profileData} 
        showModal={showPaymentModal}
        setShowModal={setShowPaymentModal}
        isVip={isVip}
        onPurchase={() => setShowPaymentModal(true)}
      />

      <PaymentModal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)}
        onSuccess={() => setIsVip(true)}
      />

      <Navigation 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          if (tab === 'vazados') {
            setShowLeakPortal(true);
          } else {
            setActiveTab(tab);
          }
        }} 
      />

      <main className="container mx-auto px-4 py-8 animate-fade-in-up">
        {renderContent()}
      </main>

      <LeakAdCard onClick={() => setShowLeakPortal(true)} />

      <footer className="py-12 text-center bg-zinc-950 text-zinc-700 text-xs border-t border-zinc-900 mt-10">
        <div className="px-4">
          <p className="font-bold tracking-widest uppercase">&copy; {new Date().getFullYear()} {profileData.name}. Conteúdo Privado.</p>
          <p className="mt-2 text-[10px] opacity-40 uppercase tracking-[3px]">Acesso exclusivo para membros autorizados.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
