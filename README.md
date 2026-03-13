# API de Matching Carro (Imagem + Texto)

Este projeto foi construído para receber webhooks do **n8n** contendo textos e imagens de carros enviados via WhatsApp e agrupá-los utilizando a inteligência artificial da **OpenAI (GPT-4o)** para validar se as fotos correspondem à descrição.

## Como fazer o Deploy (Hospedar de graça)

Como você não tem o Node.js instalado localmente, a forma mais fácil de colocar isso no ar é enviando esta pasta para o **GitHub** e conectando com a **Vercel**.

### Passo 1: Subir para o GitHub
1. Crie uma conta no [GitHub](https://github.com/) se não tiver.
2. Baixe o aplicativo [GitHub Desktop](https://desktop.github.com/).
3. Faça login no GitHub Desktop, vá em **File > Add Local Repository** e selecione a pasta `cansadao` que está no seu Desktop.
4. Ele vai pedir para criar um repositório. Clique sim e publique (Publish repository).

### Passo 2: Hospedar na Vercel
1. Acesse a [Vercel](https://vercel.com/) e faça login usando o GitHub.
2. Clique em **Add New > Project**.
3. A Vercel vai listar seus repositórios do GitHub. Escolha o `cansadao` e clique em **Import**.
4. Na tela de configuração de Deploy, abra a aba **Environment Variables (Variáveis de Ambiente)**:
   - No campo Name digite: `OPENAI_API_KEY`
   - No campo Value cole a sua chave da OpenAI (Ex: `sk-proj-...`).
5. Clique em **Deploy**.

Pronto! Em 1 minuto sua API estará no ar. 
A Vercel vai te dar um link (ex: `https://cansadao.vercel.app`). 

Lá no seu n8n, você vai configurar o Node de Webhook para fazer Requisições POST para a URL: `https://seu-link-da-vercel.vercel.app/api/webhook`.

### Como o fluxo funciona:
1. O n8n chama o `/api/webhook` passando `body.chatInput` e `body.remoteJid` (quando é texto).
2. A API salva na memória.
3. O n8n manda os webhooks das imagens log em seguida. A API empilha tudo.
4. Ao ficar 10 segundos inativo (sem novidades do grupo do WhatsApp), a API agrupa Texto + X imagens e manda pro GPT-4.
5. (Para receber de volta, você precisará editar o arquivo `src/services/store.ts` para bater num webhook novo do n8n com a resposta).
