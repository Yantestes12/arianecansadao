import OpenAI from 'openai';

export async function analyzeCarAd(text: string, base64Images: string[], openAiKey: string | null) {
  if (!openAiKey) {
    return { match: false, reason: "Nenhuma chave da OpenAI (openAiKey) foi fornecida no webhook." };
  }

  const openai = new OpenAI({
    apiKey: openAiKey,
  });

  try {
    const messages: any[] = [
      {
        role: "system",
        content: "Você é um perito automotivo. Sua tarefa é analisar o texto recebido e as imagens. PRIMEIRO: avalie se a mensagem é realmente sobre um veículo/anúncio. Se for conversa genérica ou saudação (ex: 'bom dia', 'boa tarde'), responda EXCLUSIVAMENTE com o JSON: { \"action\": \"ignore\" }. SE FOR um anúncio de veículo: verifique se as imagens correspondem fielmente à descrição (marca, modelo, cor). Responda EXCLUSIVAMENTE com o JSON: { \"match\": booleano true/false, \"reason\": \"dedução breve\" }."
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Anúncio do veículo:\n${text}`
          }
        ]
      }
    ];

    // Adiciona as imagens na mensagem do usuário
    for (const img of base64Images) {
      messages[1].content.push({
        type: "image_url",
        image_url: {
          url: `data:image/jpeg;base64,${img}`,
          detail: "low" // 'low' economiza tokens, mude para 'high' se precisar de detalhes extremos
        }
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      response_format: { type: "json_object" },
      max_tokens: 300,
    });

    const resultStr = response.choices[0].message.content;
    if (resultStr) {
       return JSON.parse(resultStr);
    }
    
    return { match: false, reason: "Falha ao extrair resposta da model" };

  } catch (error) {
    console.error("Erro na análise OpenAI:", error);
    return {
      match: false,
      reason: "Erro de integração com a API de IA."
    };
  }
}
