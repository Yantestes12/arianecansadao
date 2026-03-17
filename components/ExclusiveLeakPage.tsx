
import React, { useState, useEffect } from 'react';
import { Lock, ArrowLeft, ShieldAlert, CheckCircle2, AlertTriangle, Timer, Play, X, Heart, Check, Copy, Gem } from './Icons';
import SubmundoVazado from './SubmundoVazado';
import { supabase } from '../lib/supabase';

interface ExclusiveLeakPageProps {
  onBack: () => void;
}

interface PixResponse {
  id: string;
  qr_code: string;
  status: string;
  value: number;
  qr_code_base64: string;
}

const generateAccessId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const PixPaymentModal = ({ onClose, onConfirm, accessId, onDirectAccess }: { onClose: () => void, onConfirm: (id: string) => void, accessId: string, onDirectAccess: () => void }) => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pixData, setPixData] = useState<PixResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const PUSHIN_PAY_TOKEN = "59981|gv8wRnSTtC0NXcQxxlbcwoZ2FkTrxOj92nyIrKJHa2f32dd0"; 

  useEffect(() => {
    const createPix = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('https://api.pushinpay.com.br/api/pix/cashIn', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${PUSHIN_PAY_TOKEN}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            value: 2990,
            split_rules: []
          })
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data?.message || 'Erro na API');
        
        // Registrar o ID no Supabase como pendente
        const { error: dbError } = await supabase
          .from('access_keys')
          .insert([
            { id: accessId, pix_id: data.id, status: 'pending' }
          ]);

        if (dbError) console.error("Erro ao registrar ID no banco:", dbError);
        
        setPixData(data);
      } catch (err: any) {
        setError(err.message || 'Falha na conexão.');
      } finally {
        setLoading(false);
      }
    };
    createPix();
  }, [accessId]);

  const handleVerifyPayment = async () => {
    setIsVerifying(true);
    try {
      // Consulta o banco para ver se o status mudou para 'paid'
      // Nota: Idealmente você teria um Webhook do PushinPay atualizando o Supabase
      const { data, error } = await supabase
        .from('access_keys')
        .select('status')
        .eq('id', accessId)
        .single();

      if (data?.status === 'paid') {
        onConfirm(accessId);
      } else {
        alert("Pagamento ainda não compensado. Aguarde alguns instantes.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopy = () => {
    if (pixData?.qr_code) {
      navigator.clipboard.writeText(pixData.qr_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-zinc-900 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-fade-in-up relative my-auto flex flex-col">
        <div className="bg-zinc-50/80 px-8 py-6 flex items-center justify-between border-b border-zinc-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#10b981] rounded-full flex items-center justify-center text-white">
              <Check size={20} strokeWidth={4} />
            </div>
            <div>
              <h3 className="font-black uppercase text-lg leading-none">PAGAMENTO VIA PIX</h3>
              <p className="text-[9px] uppercase font-bold text-zinc-400 mt-1">ID ÚNICO: <span className="text-zinc-900">{accessId}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-300 hover:text-zinc-900"><X size={24} /></button>
        </div>

        <div className="px-8 pt-6 pb-4 flex flex-col items-center">
          {loading ? (
            <div className="py-16 flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-[#10b981] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Iniciando Transação Segura...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertTriangle size={40} className="text-red-500 mx-auto mb-4" />
              <p className="text-zinc-800 font-black uppercase italic">Erro de Conexão</p>
              <button onClick={() => window.location.reload()} className="mt-6 bg-zinc-900 text-white px-8 py-3 rounded-xl text-xs font-black uppercase">Reiniciar</button>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <span className="text-[10px] font-black uppercase text-zinc-300 tracking-widest">VALOR DO ACESSO</span>
                <div className="text-5xl font-black text-zinc-900 italic tracking-tighter">R$ 29,90</div>
              </div>
              <div className="bg-white p-2 rounded-2xl border border-zinc-100 shadow-sm mb-6">
                <img src={pixData?.qr_code_base64} alt="QR Code" className="w-48 h-48" />
              </div>
              <button onClick={handleCopy} className="w-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-2xl p-4 flex items-center justify-between mb-6 active:scale-95 transition-all">
                <Copy size={18} className="text-zinc-400" />
                <span className="text-[10px] font-mono font-bold text-zinc-500 truncate max-w-[150px] uppercase">{pixData?.qr_code.substring(0, 20)}...</span>
                <span className="text-[12px] font-black text-[#10b981] uppercase">{copied ? "COPIADO" : "COPIAR"}</span>
              </button>
              
              <button 
                onClick={handleVerifyPayment} 
                disabled={isVerifying}
                className="w-full bg-[#10b981] text-white font-black uppercase py-5 rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all text-sm mb-2 flex items-center justify-center gap-2"
              >
                {isVerifying && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                {isVerifying ? "VERIFICANDO..." : "JÁ PAGUEI, LIBERAR SUBMUNDO"}
              </button>

              <button onClick={onDirectAccess} className="mt-4 w-full bg-zinc-900/5 text-zinc-400 border border-zinc-200 border-dashed py-2 rounded-xl text-[10px] font-black uppercase hover:bg-zinc-900/10 transition-colors">
                [ DEBUG ] ATUALIZAR STATUS PARA PAGO
              </button>
            </>
          )}
        </div>
        <div className="px-8 py-4 bg-zinc-50 border-t border-zinc-100 text-center">
          <p className="text-[8px] text-zinc-400 uppercase font-bold tracking-tighter">Esta chave ID é única e será vinculada ao seu dispositivo permanentemente.</p>
        </div>
      </div>
    </div>
  );
};

const ExclusiveLeakPage: React.FC<ExclusiveLeakPageProps> = ({ onBack }) => {
  const [showPixModal, setShowPixModal] = useState(false);
  const [pendingId, setPendingId] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [validatedId, setValidatedId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(12 * 60 + 45);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(p => p > 0 ? p - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleStartPurchase = () => {
    const newId = generateAccessId();
    setPendingId(newId);
    setShowPixModal(true);
  };

  const handleConfirmAccess = (id: string) => {
    setShowPixModal(false);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setValidatedId(id);
      setIsUnlocked(true);
      window.history.pushState({}, '', `?access=${encodeURIComponent(id)}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 3000);
  };

  const handleDirectAccess = async () => {
    // Ação de debug: Força o status 'paid' no banco
    const debugId = pendingId || generateAccessId();
    await supabase
      .from('access_keys')
      .update({ status: 'paid' })
      .eq('id', debugId);
      
    handleConfirmAccess(debugId);
  };

  if (isUnlocked) {
    return <SubmundoVazado accessId={validatedId} onBack={() => setIsUnlocked(false)} />;
  }

  const mediaList = [
    { title: 'Deficiente rabuda e gostosa, colocando dentro bem devagar nessa vadiazinha (RESTRITO)', url: 'https://pagamento.caixapretabr.com/wp-content/uploads/2026/01/SUBMUNDO-OCULTO.mp4', thumb: 'https://secreto.meuprivacy.digital/acesso/foto22.jpg' },
    { title: 'Primas e irmãs⁺¹⁸ se pegando em live, novinhas⁺¹⁸ brincando com seus corpos (VIRGENS⁺¹⁸)', url: 'https://pagamento.caixapretabr.com/wp-content/uploads/2026/01/SUBMUNDO-OCULTO_2.mp4', thumb: 'https://secreto.meuprivacy.digital/acesso/foto20.jpg' },
    { title: 'FEMBOY (TRANS)☠️❌\nMeu amigo Trans percebeu que eu sempre quis que ele me chupasse...', url: 'https://pagamento.caixapretabr.com/wp-content/uploads/2026/01/SUBMUNDO-OCULTO_3.mp4', thumb: 'https://secreto.meuprivacy.digital/acesso/foto21.jpg' },
    { title: '❌⚠️DEFICIENTE⚠️❌\nEncostei minha mão na coxa dela, e ela fingiu que não tinha percebido...', url: 'https://pagamento.caixapretabr.com/wp-content/uploads/2026/01/SUBMUNDO-OCULTO_4.mp4', thumb: 'https://secreto.meuprivacy.digital/acesso/foto24.jpg' },
    { title: 'Filho mostrando que sua mãe deixa ele encostar o p4u nela! o silêncio em casa, o pau bem duro encostando na mamãe...', url: 'https://pagamento.caixapretabr.com/wp-content/uploads/2026/01/SUBMUNDO-OCULTO_5.mp4', thumb: 'https://secreto.meuprivacy.digital/acesso/foto27.jpg' },
    { title: 'Irmãos Baianos foram expostos na net, tinha medo colocar dentro da própria irmã, até hoje...🔥', url: 'https://pagamento.caixapretabr.com/wp-content/uploads/2026/01/SUBMUNDO-OCULTO_6.mp4', thumb: 'https://secreto.meuprivacy.digital/acesso/foto8.jpg' },
    { title: 'Verdade e desafio termina com irmã mamando o próprio irmão (IRMÃOS DE SANGUE MESMO) ‼️', url: 'https://pagamento.caixapretabr.com/wp-content/uploads/2026/01/SUBMUNDO-OCULTO_7.mp4', thumb: 'https://secreto.meuprivacy.digital/acesso/foto2.jpg' },
    { title: 'Estavam bebendo, mas ele nem percebeu que sua irmã estava mamando junto com sua namorada ☠️⚠️', url: 'https://pagamento.caixapretabr.com/wp-content/uploads/2026/01/SUBMUNDO-OCULTO_8.mp4', thumb: 'https://secreto.meuprivacy.digital/acesso/foto1.jpg' },
    { title: 'OCULTO - "sempre quis colocar a mão em seu pau..." Diz prima para o próprio primo', url: 'https://pagamento.caixapretabr.com/wp-content/uploads/2026/01/SUBMUNDO-OCULTO_9.mp4', thumb: 'https://secreto.meuprivacy.digital/acesso/foto4.jpg' },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 pb-20">
      <div className="fixed top-0 left-0 w-full bg-red-600 py-1.5 px-4 text-center z-[120] border-b border-black/10">
        <span className="text-[10px] font-black uppercase tracking-[3px] animate-pulse">Acesso Restrito +18 - Portal de Vazamentos Oficiais</span>
      </div>

      <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden border-b border-red-900/30 pt-10">
        <div className="absolute inset-0">
          <img src="https://secreto.meuprivacy.digital/acesso/foto15.jpg" className="w-full h-full object-cover opacity-20 blur-xl scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center px-6 py-20 space-y-8 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-600/60 px-6 py-2 rounded-full text-red-500 animate-bounce">
            <AlertTriangle size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest italic">Submundo Detectado</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85]">CONTEÚDO <br/> <span className="text-red-600">VAZADO</span></h1>
          <p className="text-zinc-400 text-sm md:text-lg max-w-xl mx-auto font-medium leading-relaxed">Os Vídeos mais bizarros do Submundo, aproveite antes que o acesso seja suspenso definitivamente!</p>
          <div className="flex flex-col items-center gap-6 pt-10">
            <div className="bg-zinc-900/80 border border-red-900/40 px-8 py-4 rounded-3xl backdrop-blur-xl flex flex-col items-center">
               <p className="text-[9px] text-zinc-500 uppercase font-black mb-1">O link de acesso expira em:</p>
               <div className="flex items-center gap-2 text-2xl font-black text-red-500"><Timer size={20} /><span>{formatTime(timeLeft)}</span></div>
            </div>
            <button onClick={handleStartPurchase} className="group relative w-full max-w-md">
              <div className="absolute -inset-1 bg-red-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-red-600 hover:bg-red-500 text-white font-black uppercase text-lg py-6 rounded-2xl transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4">
                <span>LIBERAR ACESSO</span>
                <span className="text-white/60 text-sm">R$ 29,90</span>
              </div>
            </button>
          </div>
        </div>
        <button onClick={onBack} className="absolute top-16 left-8 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all z-20"><ArrowLeft size={24} /></button>
      </div>

      <div className="container mx-auto px-4 py-24">
         <div className="max-w-xl mx-auto space-y-32">
            {mediaList.map((media, idx) => (
              <div key={idx} className="space-y-8 group">
                <div className="text-center space-y-2">
                    <p className="text-red-600 text-[10px] font-black uppercase tracking-[0.3em]">PRÉVIA OCULTA #{idx + 1}</p>
                    <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter text-zinc-100 whitespace-pre-line leading-tight">"{media.title}"</h2>
                </div>
                <div className="relative aspect-[9/16] rounded-[3rem] overflow-hidden border border-zinc-800 shadow-2xl group-hover:border-red-600/50 transition-colors">
                    <video src={media.url} muted autoPlay loop playsInline className="w-full h-full object-cover grayscale-0 opacity-100 transition-all duration-1000" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 group-hover:bg-transparent transition-colors">
                       <Lock className="w-12 h-12 text-red-600 mb-4 group-hover:scale-125 transition-transform duration-500" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-white drop-shadow-lg">Acesso Bloqueado</p>
                    </div>
                </div>
              </div>
            ))}
         </div>
      </div>

      {showPixModal && <PixPaymentModal accessId={pendingId} onClose={() => setShowPixModal(false)} onConfirm={handleConfirmAccess} onDirectAccess={handleDirectAccess} />}

      {isProcessing && (
        <div className="fixed inset-0 z-[500] bg-black flex flex-col items-center justify-center">
           <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-8"></div>
           <h3 className="text-white font-black text-2xl uppercase italic animate-pulse text-center">Sincronizando Chave ID...</h3>
        </div>
      )}
    </div>
  );
};

export default ExclusiveLeakPage;
