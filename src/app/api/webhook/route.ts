import { NextResponse } from 'next/server';
import { receiveMessage } from '@/services/store';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Lida com array (que o novo n8n as vezes empacota)
    let payload = Array.isArray(body) ? body[0] : body;
    
    // Varredor agressivo pra achar a propriedade (caso n8n coloque dentro de body.body)
    const findProp = (obj: any, key: string): any => {
      if (!obj || typeof obj !== 'object') return null;
      if (key in obj) return obj[key];
      if (obj.body) return findProp(obj.body, key);
      return null;
    };

    const remoteJid = findProp(payload, 'remoteJid');
    const openAiKey = findProp(payload, 'openAiKey');
    
    if (!remoteJid) {
      return NextResponse.json({ error: 'Missing remoteJid.' }, { status: 400 });
    }

    const text = findProp(payload, 'chatInput');
    const mediaType = findProp(payload, 'mediaType');
    const base64 = findProp(payload, 'base64');
    
    const isImage = mediaType === "imageMessage" || !!base64;
    const base64Image = isImage ? base64 : null;

    // Repassa para a store, que agrupa em memória com setTimeout de 30s
    await receiveMessage(remoteJid, text, base64Image, openAiKey);

    return NextResponse.json({ success: true, message: "Enfileirado para processamento." });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
