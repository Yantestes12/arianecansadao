"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoadingText, setIsLoadingText] = useState(false);
  const [isLoadingImg, setIsLoadingImg] = useState(false);
  const [remoteJid, setRemoteJid] = useState("120363386917497674@g.us");
  const [openAiKey, setOpenAiKey] = useState("");
  const [carText, setCarText] = useState(`Hyundai/Ix35 2016 aut Flex Ipva 2026 pago ✅
$$$  58.990,00
Fipe: 75.550,00
Pintar 1 peça 
Lacradissima 
*Km: 118 correção de Km✅*
Pneus ok
Motor e caixa ok 
Laudo 100% Aprovado✅`);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = (msg: string) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  };

  const handleSendText = async () => {
    if(!openAiKey) {
        alert("Por favor insira sua chave da OpenAI!");
        return;
    }
    setIsLoadingText(true);
    addLog(`Enviando Texto para a API...`);
    
    const payload = [{
      body: {
        remoteJid,
        openAiKey,
        chatInput: carText
      }
    }];

    try {
      const response = await fetch('/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      addLog(`Resposta Texto: ${JSON.stringify(data)}`);
    } catch (error: any) {
      addLog(`ERRO Texto: ${error.message}`);
    } finally {
      setIsLoadingText(false);
    }
  };

  const handleSendImage = () => {
    if(!openAiKey) {
        alert("Por favor insira sua chave da OpenAI!");
        return;
    }
    if (!fileInputRef.current?.files?.length) {
      alert("Por favor, selecione uma imagem primeiro!");
      return;
    }

    setIsLoadingImg(true);
    const file = fileInputRef.current.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      const base64Data = (event.target?.result as string).split(',')[1];

      const payload = [{
        body: {
          remoteJid,
          openAiKey,
          mediaType: "imageMessage",
          base64: base64Data
        }
      }];

      try {
        addLog(`Enviando Imagem (${file.name}) para a API...`);
        const response = await fetch('/api/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        addLog(`Resposta Imagem: ${JSON.stringify(data)}`);
        addLog(`🤖 A API vai esperar 10 seg e mandar tudo pro GPT-4. Fique de olho nos logs da Vercel!`);
      } catch (error: any) {
        addLog(`ERRO Imagem: ${error.message}`);
      } finally {
        setIsLoadingImg(false);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <main>
      <div className="glass-panel">
        <h1>Cansadão Repasse</h1>
        <p className="subtitle">AI Vehicle Verifier Control Panel</p>

        <div className="form-group">
          <label>Chave da OpenAI (sk-proj...)</label>
          <input 
            type="password" 
            placeholder="Sua chave da API aqui..."
            value={openAiKey}
            onChange={(e) => setOpenAiKey(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>RemoteJID (Id do Remetente)</label>
          <input 
            type="text" 
            value={remoteJid}
            onChange={(e) => setRemoteJid(e.target.value)}
          />
        </div>

        <div className="divider"></div>

        <div className="split-actions">
          <div className="form-group">
            <label>📚 Dados do Anúncio (Texto)</label>
            <textarea 
              rows={6}
              value={carText}
              onChange={(e) => setCarText(e.target.value)}
            />
            <div style={{ marginTop: '10px' }}>
                <button onClick={handleSendText} disabled={isLoadingText}>
                {isLoadingText ? "Enviando..." : "Enviar APENAS Texto"}
                </button>
            </div>
          </div>

          <div className="form-group">
            <label>📸 Foto do Veículo (Imagem)</label>
            <div className="file-upload-wrapper" style={{ height: '145px' }}>
              <div className="file-custom-btn" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '2rem' }}>📁</span>
                <span>Clique para anexar foto</span>
              </div>
              <input 
                type="file" 
                accept="image/jpeg, image/png"
                ref={fileInputRef} 
              />
            </div>
            <div style={{ marginTop: '10px' }}>
                <button className="btn-secondary" onClick={handleSendImage} disabled={isLoadingImg}>
                {isLoadingImg ? "Enviando..." : "Enviar APENAS Imagem"}
                </button>
            </div>
          </div>
        </div>

        <div className="log-container">
          {logs.length === 0 ? "O log de eventos aparecerá aqui..." : logs.join('\n')}
        </div>
      </div>
    </main>
  );
}
