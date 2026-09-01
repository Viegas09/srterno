# Sr. Terno — Sistema

Sistema interno de gestão para a **Sr. Terno** (aluguel de trajes masculinos para eventos —
srterno.com.br), substituindo o controle em papel por um dashboard de pedidos/clientes/financeiro
e um fluxo de check-in do cliente via QR code na entrada da loja.

Este projeto é só o **sistema**. O site institucional da loja não faz parte deste repositório.

## Stack

- [Next.js 16](https://nextjs.org/) (App Router) + TypeScript
- [Prisma](https://www.prisma.io/) + PostgreSQL (compatível com [Supabase](https://supabase.com/))
- Tailwind CSS
- Login próprio (e-mail/senha, sessão via cookie assinado com `jose`) protegendo `/admin`

## Como funciona

1. Na entrada da loja tem um **QR code fixo** (cartaz, sempre o mesmo link: `/recepcao`). O
   cliente escaneia e preenche só os **dados pessoais** — nome, CPF, telefone, e-mail. Sem
   medidas: essa parte é sempre digitada pela atendente, o cliente nunca edita.
2. Isso já cria o cliente e um pedido em **"Aguardando atendimento"**, que aparece na tela
   **Fila de atendimento** do dashboard (`/admin/recepcao`), ordenado por quem chegou primeiro.
3. A senha física de atendimento (a que o cliente pega na porta) continua sendo controlada fora
   do sistema — o sistema só ajuda a atendente a achar o nome certo na fila.
4. Quando é a vez do cliente, a atendente abre o pedido dele na fila, completa o **tipo/valor/datas**
   do pedido e **lança as medidas** olhando a pessoa na sua frente. A partir daí o pedido some da
   fila e vira um pedido normal, acompanhado pelo dashboard como qualquer outro (pagamentos,
   status, etc.) — inclusive dá pra abrir um pedido manualmente (`/admin/pedidos/novo`) pra casos
   sem check-in, como um pedido por telefone.
5. A tela de **Financeiro** mostra o recebido no mês, saldo a receber por pedido e breakdown por
   forma de pagamento.

## Modelo de dados

Modelado a partir da ficha física de locação usada hoje pela loja:

- `Cliente` — dados de quem contrata (nome, CPF, contato, como conheceu a loja)
- `Pedido` — a locação/venda em si (datas de retirada/devolução, provas, valor, status)
- `PessoaPedido` — medidas de cada pessoa do pedido, digitadas pela atendente (paletó, colete,
  calça, manga, ajuste, etc.)
- `Peca` — item físico de estoque, identificado por código/etiqueta individual
- `ItemPedido` — reserva de uma peça física para um pedido
- `Pagamento` — sinal, saldo, multas, com forma de pagamento

Veja `prisma/schema.prisma` para o detalhe completo.

## Rodando localmente

```bash
npm install
cp .env.example .env   # preencha DATABASE_URL (Postgres) e AUTH_SECRET
npx prisma migrate dev --name init
node scripts/create-admin.mjs "Seu Nome" seu@email.com senhaForte123
npm run dev
```

Acesse `http://localhost:3000/login` e entre com o usuário criado acima.

### Criando/gerenciando usuários do dashboard

Não existe cadastro público — só quem já tem acesso ao servidor cria contas, via:

```bash
node scripts/create-admin.mjs "Nome" email@exemplo.com senha
```

Rodar de novo com o mesmo e-mail atualiza a senha (útil pra resetar senha esquecida).

## Deploy (Vercel + Supabase)

1. **Banco**: crie um projeto no [Supabase](https://supabase.com/dashboard). Na tela
   *Connect*, pegue duas URIs de conexão:
   - **Transaction pooler** (porta 6543) → vai em `DATABASE_URL`, usada nas consultas do app.
     Adicione `?pgbouncer=true` no final dessa URL (obrigatório nesse modo, senão toda
     consulta falha).
   - **Session pooler** ou **Direct connection** (porta 5432) → vai em `DIRECT_URL`, usada só
     pra rodar migrations (o modo Transaction não suporta os locks que o Prisma Migrate precisa).
2. **App**: no [Vercel](https://vercel.com/new), importe o repositório `Viegas09/srterno`.
3. Em *Environment Variables*, adicione:
   - `DATABASE_URL` — connection string do Supabase, modo Transaction pooler
   - `DIRECT_URL` — connection string do Supabase, modo Session pooler ou Direct connection
   - `APP_URL` — a URL final do projeto na Vercel (ex.: `https://srterno.vercel.app`)
   - `AUTH_SECRET` — string aleatória longa (`openssl rand -base64 32`)
   - `SETUP_TOKEN` — string aleatória (`openssl rand -hex 16`), só pro primeiro acesso
4. Deploy. O `build` já roda `prisma migrate deploy` (contra `DIRECT_URL`) automaticamente
   antes do `next build` — não precisa rodar migration manualmente.
5. **Criar o primeiro usuário do dashboard**, direto pelo navegador (sem terminal):
   acesse `https://<seu-projeto>.vercel.app/setup?token=<o SETUP_TOKEN que você configurou>`
   e preencha o formulário. Esse link só funciona uma vez — depois do primeiro usuário criado,
   fica desativado sozinho.

## Roadmap / próximos passos

- [ ] App do cliente (PWA) com acompanhamento do próprio pedido (fora só o autopreenchimento
      inicial)
- [ ] Notificações automáticas (WhatsApp/e-mail) de lembrete de retirada/devolução
- [ ] Tela de estoque (`Peca`) com disponibilidade por data e checagem de conflito de reserva
- [ ] Emissão do contrato em PDF a partir dos dados do pedido
- [ ] Relatórios financeiros por período/exportação
