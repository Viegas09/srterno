# Sr. Terno — Sistema

Sistema interno de gestão para a **Sr. Terno** (aluguel de trajes masculinos para eventos —
srterno.com.br), substituindo o controle em papel por um dashboard de pedidos/clientes/financeiro
e um fluxo de autopreenchimento de dados pelo cliente via QR code.

Este projeto é só o **sistema**. O site institucional da loja não faz parte deste repositório.

## Stack

- [Next.js 16](https://nextjs.org/) (App Router) + TypeScript
- [Prisma](https://www.prisma.io/) + PostgreSQL (compatível com [Supabase](https://supabase.com/))
- Tailwind CSS
- `qrcode` para gerar o QR de autopreenchimento
- Login próprio (e-mail/senha, sessão via cookie assinado com `jose`) protegendo `/admin`

## Como funciona

1. O vendedor cria um **pedido** no dashboard (`/admin/pedidos/novo`) com os dados básicos do
   cliente responsável, tipo (aluguel/venda/sob medida), datas e valor.
2. O sistema gera um **link/QR code único** para aquele pedido (visível na página do pedido).
3. O cliente escaneia o QR no celular e preenche ele mesmo nome, CPF e medidas
   (`/pedido/[token]`) — sem o vendedor precisar digitar nada. Pode preencher mais de uma pessoa
   no mesmo pedido (ex.: padrinhos de casamento).
4. O vendedor acompanha tudo pelo dashboard: pessoas/medidas preenchidas, pagamentos
   (sinal/saldo/multas) e status do pedido (rascunho → aguardando cliente → confirmado → em
   ajuste → pronto para retirada → retirado → devolvido).
5. A tela de **Financeiro** mostra o recebido no mês, saldo a receber por pedido e breakdown por
   forma de pagamento.

## Modelo de dados

Modelado a partir da ficha física de locação usada hoje pela loja:

- `Cliente` — dados de quem contrata (nome, CPF, contato, como conheceu a loja)
- `Pedido` — a locação/venda em si (datas de retirada/devolução, provas, valor, status, token do QR)
- `PessoaPedido` — medidas de cada pessoa do pedido (paletó, colete, calça, manga, ajuste, etc.)
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

1. **Banco**: crie um projeto no [Supabase](https://supabase.com/dashboard). Em
   *Project Settings → Database → Connection string*, copie a URI no modo **Transaction**
   (porta 6543, funciona melhor com serverless) — essa é a `DATABASE_URL`.
2. **App**: no [Vercel](https://vercel.com/new), importe o repositório `Viegas09/srterno`.
3. Em *Environment Variables*, adicione:
   - `DATABASE_URL` — a connection string do Supabase
   - `NEXT_PUBLIC_APP_URL` — a URL final do projeto na Vercel (ex.: `https://srterno.vercel.app`)
   - `AUTH_SECRET` — string aleatória longa (`openssl rand -base64 32`)
4. Deploy. O `postinstall` já roda `prisma generate` automaticamente durante o build.
5. **Migrations**: antes do primeiro acesso, rode as migrations contra o banco do Supabase
   (uma vez, da sua máquina ou por aqui mesmo):
   ```bash
   DATABASE_URL="<connection string do Supabase>" npx prisma migrate deploy
   ```
6. **Criar o primeiro usuário do dashboard** (também contra o banco de produção):
   ```bash
   DATABASE_URL="<connection string do Supabase>" node scripts/create-admin.mjs "Nome" email@srterno.com.br senhaForte123
   ```

## Roadmap / próximos passos

- [ ] App do cliente (PWA) com acompanhamento do próprio pedido (fora só o autopreenchimento
      inicial)
- [ ] Notificações automáticas (WhatsApp/e-mail) de lembrete de retirada/devolução
- [ ] Tela de estoque (`Peca`) com disponibilidade por data e checagem de conflito de reserva
- [ ] Emissão do contrato em PDF a partir dos dados do pedido
- [ ] Relatórios financeiros por período/exportação
