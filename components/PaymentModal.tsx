import React, { useState, useEffect } from 'react';
import { X, Lock, CheckCircle2, ShieldAlert, Timer, Copy, Gem } from './Icons';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<'intro' | 'loading' | 'pix_generated' | 'verifying' | 'success'>('intro');
  const [timeLeft, setTimeLeft] = useState(600);
  const [pixData, setPixData] = useState<{ qrcode: string, copiaCola: string, id: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const N8N_WEBHOOK_URL = 'https://weebhooks.synio.com.br/webhook';
  const API_KEY = "nxp_live_bba943703263271e69dbbec5a94d8a3f9cb2a7ddc10ab4f7b817145a0b3c32a3";

  useEffect(() => {
    if (isOpen) {
      setStep('intro');
      setPixData(null);
      setTimeLeft(600);
      setErrorMsg("");
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'pix_generated' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  // Polling automático a cada 5 segundos enquanto o QRCode estiver na tela
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'pix_generated' && pixData?.id) {
        interval = setInterval(() => {
            checkPaymentStatus(pixData.id, true);
        }, 5000);
    }
    return () => clearInterval(interval);
  }, [step, pixData]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleGeneratePix = async () => {
    setStep('loading');
    setErrorMsg("");
    
    try {
      const response = await fetch(`${N8N_WEBHOOK_URL}/gerar-pix-nexuspag`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          value: 4.94,
          apiKey: API_KEY
        })
      });

      const data = await response.json();

      if (response.ok) {
        const tx = data.transaction || (Array.isArray(data) ? data[0].transaction || data[0] : data);
        
        if (tx && tx.qr_code_base64 && tx.pix_copia_cola) {
             setPixData({
                 qrcode: tx.qr_code_base64,
                 copiaCola: tx.pix_copia_cola,
                 id: tx.id || tx.txid || tx.uuid
             });
             setStep('pix_generated');
        } else {
             setErrorMsg("Formato de PIX inválido recebido.");
             setStep('intro');
        }
      } else {
        setErrorMsg("Erro ao comunicar com o servidor de pagamento.");
        setStep('intro');
      }
    } catch (err) {
      setErrorMsg("Erro de conexão. Tente novamente.");
      setStep('intro');
    }
  };

  const checkPaymentStatus = async (txId: string, isSilent = false) => {
    if (!isSilent) setStep('verifying');
    
    try {
      const response = await fetch(`${N8N_WEBHOOK_URL}/consultar-pix-nexuspag?id=${txId}`, {
        method: 'GET'
      });

      const data = await response.json();

      if (response.ok) {
        const tx = data.transaction || (Array.isArray(data) ? data[0].transaction || data[0] : data);
        const status = tx?.status?.toUpperCase() || (data.status ? data.status.toUpperCase() : '');
        
        if (status === 'PAID' || status === 'COMPLETED' || status === 'PAGO') {
          setStep('success');
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 2000);
        } else if (!isSilent) {
          setErrorMsg("Pagamento ainda não identificado.");
          setStep('pix_generated');
        }
      } else if (!isSilent) {
        setErrorMsg("Erro ao consultar status.");
        setStep('pix_generated');
      }
    } catch (err) {
      if (!isSilent) {
         setErrorMsg("Falha ao verificar. Tente novamente.");
         setStep('pix_generated');
      }
    }
  };

  const copyToClipboard = () => {
    if (pixData) {
      navigator.clipboard.writeText(pixData.copiaCola);
      alert("Chave Pix Copiada!");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in sm:p-6">
      <div className="relative w-full max-w-md overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-zinc-400 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'intro' && (
          <div className="p-6 sm:p-8 text-center animate-fade-in-up mt-4">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/30">
              <Lock className="w-8 h-8 text-amber-500" />
            </div>
            
            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
              CONTEÚDO PRIVADO
            </h2>
            
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              Desbloqueie agora o acesso VIP temporário ao perfil fechado da Sofia. Mídias exclusivas sem censura e conteúdos secretos.
            </p>

            <div className="bg-zinc-950 rounded-xl p-4 mb-8 border border-zinc-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-zinc-400 text-sm font-medium">Acesso VIP</span>
                <span className="text-white font-black">R$ 4,94</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 text-sm font-medium">Bônus Vazados</span>
                <span className="text-green-500 font-black">Inclusos</span>
              </div>
              <div className="h-px bg-zinc-800 my-3"></div>
              <div className="flex justify-between items-center">
                <span className="text-white font-bold">Total a pagar</span>
                <span className="text-amber-500 font-black text-xl">R$ 4,94</span>
              </div>
            </div>

            {errorMsg && (
                <p className="text-red-500 text-sm mb-4 font-bold bg-red-500/10 p-2 rounded-lg">{errorMsg}</p>
            )}

            <button 
              onClick={handleGeneratePix}
              className="w-full py-4 px-6 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-black uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              LIBERAR ACESSO VIP AGORA <Gem size={18} className="fill-black" />
            </button>
            <div className="flex items-center justify-center gap-2 mt-4 text-zinc-500 text-xs font-medium">
              <ShieldAlert className="w-4 h-4" /> Pagamento 100% Seguro e Anônimo
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="p-12 mt-4 flex flex-col items-center justify-center min-h-[400px]">
             <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-6"></div>
             <p className="text-amber-500 font-black uppercase tracking-widest animate-pulse text-lg">Gerando PIX...</p>
          </div>
        )}

        {step === 'pix_generated' && pixData && (
           <div className="p-6 sm:p-8 animate-fade-in flex flex-col items-center min-h-[400px]">
               <h3 className="text-white font-black text-xl mb-2 text-center mt-4">PAGAMENTO VIA PIX</h3>
               <p className="text-zinc-400 text-sm text-center mb-6">
                   Abra o app do seu banco e escaneie o código ou use a opção "Pix Copia e Cola".
               </p>

               <div className="bg-white p-2 rounded-xl mb-6">
                   <img src={pixData.qrcode} alt="QR Code PIX" className="w-48 h-48 object-contain" />
               </div>

               <div className="w-full mb-6">
                   <p className="text-zinc-500 text-xs font-bold mb-2 uppercase tracking-wider">Pix Copia e Cola</p>
                   <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                       <input 
                          type="text" 
                          readOnly 
                          value={pixData.copiaCola} 
                          className="bg-transparent text-zinc-300 text-xs outline-none flex-1 truncate font-mono"
                       />
                       <button 
                          onClick={copyToClipboard}
                          className="px-3 shrink-0 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors flex items-center gap-1 uppercase text-[10px] font-bold"
                       >
                           <Copy size={12} /> COPIAR
                       </button>
                   </div>
               </div>

               {errorMsg && (
                   <p className="text-red-500 text-sm mb-4 font-bold text-center w-full bg-red-500/10 p-2 rounded-lg">{errorMsg}</p>
               )}

               <button 
                  onClick={() => checkPaymentStatus(pixData.id)}
                  className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center uppercase text-sm mb-4 tracking-wide"
               >
                   JÁ EFETUEI O PAGAMENTO
               </button>

               <div className="flex items-center justify-center gap-2 text-amber-500 font-mono text-lg mb-2">
                   <Timer className="w-5 h-5" /> {formatTime(timeLeft)}
               </div>
               <p className="text-zinc-500 text-xs mt-2">O código expira em 10 minutos.</p>
           </div>
        )}

        {step === 'verifying' && (
           <div className="p-12 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 border-4 border-zinc-500 border-t-amber-500 rounded-full animate-spin mb-6"></div>
              <p className="text-white font-bold tracking-widest animate-pulse text-lg">Buscando confirmação...</p>
           </div>
        )}

        {step === 'success' && (
          <div className="p-8 sm:p-12 text-center animate-fade-in min-h-[400px] flex flex-col justify-center">
             <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                 <CheckCircle2 className="w-10 h-10 text-green-500" />
             </div>
             <h3 className="text-white font-black text-2xl uppercase tracking-tight mb-2">PAGAMENTO APROVADO!</h3>
             <p className="text-zinc-400">Liberando seu acesso VIP...</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentModal;
