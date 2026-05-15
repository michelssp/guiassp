# 📍 Guia Comercial de São Sebastião do Passé — PWA

## Como hospedar

### Opção 1 — Netlify (grátis, mais fácil)
1. Acesse https://netlify.com e crie uma conta gratuita
2. Arraste a pasta `guia-ssp-pwa` para o Netlify Drop
3. Pronto! Você receberá um link como `https://guia-ssp.netlify.app`

### Opção 2 — GitHub Pages (grátis)
1. Crie um repositório no GitHub
2. Faça upload de todos os arquivos
3. Vá em Settings → Pages → selecione branch `main`
4. Site disponível em `https://seuusuario.github.io/guia-ssp`

### Opção 3 — Vercel (grátis)
1. Acesse https://vercel.com
2. Importe o repositório do GitHub
3. Deploy automático a cada atualização

## Estrutura de arquivos
```
guia-ssp-pwa/
├── index.html        → Estrutura principal do app
├── style.css         → Todo o estilo (dark mode incluído)
├── app.js            → Lógica completa (feed, sorteios, pontos...)
├── data.js           → Dados dos negócios, promoções, vagas
├── manifest.json     → Configuração PWA (ícone, nome, cores)
├── sw.js             → Service Worker (offline + notificações push)
└── icons/            → Ícones do app em vários tamanhos
```

## Personalizar o número do WhatsApp admin
No arquivo `app.js`, procure por `5571999999999` e substitua pelo seu número real.

## Funcionalidades incluídas
- 📰 Feed de novidades com banner patrocinado rotativo
- 🏪 15+ negócios reais de SSP com dados do Google Maps
- 🔥 Promoções patrocinadas com badge "Patrocinado"
- 🎰 Sorteios patrocinados com contador de participantes
- 💼 Vagas de emprego com candidatura via WhatsApp
- 🗳️ Enquetes com votação em tempo real
- 🏆 Ranking semanal dos melhores negócios
- 🗺️ Mapa com pins dos negócios
- 🌙 Plantão de farmácia
- 🚨 Números de emergência
- ⭐ Sistema de pontos e badges (gamificação)
- ❤️ Favoritos salvos localmente
- 📍 Check-in com +20pts
- 💰 Aba "Anunciar" com planos e serviços
- 🔒 Painel admin com PIN (padrão: 1234)
- 📣 Story/pop-up patrocinado ao abrir o app
- 🤝 Indique um negócio (+50pts ao ser aprovado)
- 🌤️ Clima em tempo real de SSP
- 🔔 Notificações push (via service worker)
- 📲 Instalável na tela inicial (PWA)

## Monetização implementada
| Produto | Preço | Onde aparece |
|---|---|---|
| Plano Básico | R$99/mês | Badge no card + 2 promos |
| Plano Pro | R$149/mês | Destaque + 4 promos + vaga |
| Plano Premium | R$199/mês | Tudo + sorteio + stories |
| Banner no feed | R$99–199/mês | Feed de novidades |
| Story pop-up | R$149–299/mês | Ao abrir o app |
| Publicação de promo | R$29–59 | Aba Promoções |
| Sorteio patrocinado | R$49–99 | Aba Sorteios |
| Publicação de vaga | R$19–39 | Aba Vagas |

**Potencial estimado com 5–8 clientes: R$500–1.500/mês**

## PIN do Admin
O PIN padrão é `1234`. Para alterar, edite no arquivo `app.js`:
```js
let adminPIN = '1234'; // ← mude aqui
```

## Suporte
Desenvolvido com Claude — Anthropic
