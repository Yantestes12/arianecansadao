import { analyzeCarAd } from './analyzer';

// Dicionário Global em Memória (Risco Serverless Vercel assumido pelo usuário)
// Estrutura: { "12036...": { text: "...", images: ["..."], openAiKey: "...", timer: setTimeout } }
const sessions: { [key: string]: any } = {};

export async function receiveMessage(
  remoteJid: string,
  text: string | null,
  base64Image: string | null,
  openAiKey: string | null = null
) {
  
  const cleanBase64 = base64Image ? base64Image.replace(/^data:image\/\w+;base64,/, '') : null;

  // Se já existe uma sessão para esse grupo nos últimos 30 segundos
  if (sessions[remoteJid]) {
      
      console.log(`[${remoteJid}] Adicionando nova peça à sessão...`);
      if (text) {
          sessions[remoteJid].text = sessions[remoteJid].text ? `${sessions[remoteJid].text}\n${text}` : text;
      }
      if (cleanBase64) {
          sessions[remoteJid].images.push(cleanBase64);
      }
      if (openAiKey) {
          sessions[remoteJid].openAiKey = openAiKey; // Atualiza a chave se veio agora
      }
      
  } else {
      console.log(`[${remoteJid}] Nova sessão iniciada. Aguardando 30 segundos...`);
      // Cria a sessão zero km
      sessions[remoteJid] = {
          text: text || "",
          images: cleanBase64 ? [cleanBase64] : [],
          openAiKey: openAiKey,
          timer: setTimeout(() => processSession(remoteJid), 30000) // 30 segundos exatos de carência
      };
  }
}


// Função disparada pelo SetTimeout após 30 segundos
async function processSession(remoteJid: string) {
    const sessionToProcess = sessions[remoteJid];
    
    // Mata a sessão da memória para o próximo do mesmo grupo começar limpo
    delete sessions[remoteJid];

    if (!sessionToProcess) return;

    console.log(`[${remoteJid}] TIMER ESTOUROU! Processando sessão com texto: "${sessionToProcess.text.substring(0, 50)}..." e ${sessionToProcess.images.length} fotos.`);

    if (!sessionToProcess.text || sessionToProcess.text.trim() === "") {
        console.log(`[${remoteJid}] Ignorado. Nenhum texto chegou nesses 30s.`);
        return;
    }

    if (sessionToProcess.images.length === 0) {
        console.log(`[${remoteJid}] Ignorado. Nenhuma imagem chegou nesses 30s.`);
        return;
    }

    // Chama a IA e pede pra ela ser espertinha
    const result = await analyzeCarAd(sessionToProcess.text, sessionToProcess.images, sessionToProcess.openAiKey);
    
    console.log(`[${remoteJid}] Veredito OpenAI:`, result);
    
    // O analyzer agora devolve { action: 'ignore' } caso seja mensagem de bom dia
    if (result.action === 'ignore') {
        console.log(`[${remoteJid}] A IA determinou que não era um anúncio de carro. Morrendo silenciosamente.`);
        return; // Nem manda pro N8N
    }

    // Se chegou aqui, é carro e fez análise! Manda pro N8N Final.
    try {
        const response = await fetch('https://webhook.cansadaorepasse.cloud/webhook/api', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            remoteJid: remoteJid,
            analysis: result, // { match: true/false, reason: "..." }
            originalText: sessionToProcess.text,
            imagesCount: sessionToProcess.images.length
          })
        });
        
        if (response.ok) {
            console.log(`[${remoteJid}] Resultado final disparado para o Wehook N8N!`);
        } else {
            console.error(`[${remoteJid}] Falha ao enviar para o N8N: ${response.status}`);
        }
    } catch (error) {
        console.error(`[${remoteJid}] Erro de rede ao tentar chamar o Webhook Final do N8N:`, error);
    }
}
