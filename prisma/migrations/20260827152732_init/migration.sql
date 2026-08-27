-- CreateEnum
CREATE TYPE "ComoConheceu" AS ENUM ('GOOGLE', 'REDE_SOCIAL', 'INDICACAO', 'OUTROS');

-- CreateEnum
CREATE TYPE "TipoPedido" AS ENUM ('ALUGUEL', 'VENDA', 'SOB_MEDIDA');

-- CreateEnum
CREATE TYPE "StatusPedido" AS ENUM ('RASCUNHO', 'AGUARDANDO_AUTOPREENCHIMENTO', 'CONFIRMADO', 'EM_AJUSTE', 'PRONTO_RETIRADA', 'RETIRADO', 'DEVOLVIDO', 'CANCELADO', 'ATRASADO');

-- CreateEnum
CREATE TYPE "AjusteTipo" AS ENUM ('LISA', 'RIGOR', 'SLIM', 'ITALIANA', 'BORDO');

-- CreateEnum
CREATE TYPE "CorPeca" AS ENUM ('PRETO', 'MARROM');

-- CreateEnum
CREATE TYPE "TipoPeca" AS ENUM ('PALETO', 'COLETE', 'CALCA', 'CAMISA', 'GRAVATA', 'SAPATO', 'OUTRO');

-- CreateEnum
CREATE TYPE "TipoPagamento" AS ENUM ('SINAL', 'SALDO', 'MULTA', 'ESTORNO', 'OUTRO');

-- CreateEnum
CREATE TYPE "FormaPagamento" AS ENUM ('DINHEIRO', 'PIX', 'DEBITO', 'CREDITO');

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3),
    "telefone" TEXT,
    "email" TEXT,
    "endereco" TEXT,
    "cidade" TEXT,
    "cep" TEXT,
    "comoConheceu" "ComoConheceu",
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" TEXT NOT NULL,
    "numero" SERIAL NOT NULL,
    "clienteId" TEXT NOT NULL,
    "tipo" "TipoPedido" NOT NULL DEFAULT 'ALUGUEL',
    "status" "StatusPedido" NOT NULL DEFAULT 'RASCUNHO',
    "descricao" TEXT,
    "dataRetirada" TIMESTAMP(3),
    "horaRetirada" TEXT,
    "dataDevolucao" TIMESTAMP(3),
    "horaDevolucao" TEXT,
    "primeiraProva" TIMESTAMP(3),
    "segundaProva" TIMESTAMP(3),
    "valorTotal" DECIMAL(10,2) NOT NULL,
    "valorSinal" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "autopreenchimentoToken" TEXT NOT NULL,
    "autopreenchimentoPreenchidoEm" TIMESTAMP(3),
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PessoaPedido" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT,
    "paleto" TEXT,
    "colete" TEXT,
    "calca" TEXT,
    "cos" TEXT,
    "camisa" TEXT,
    "manga" TEXT,
    "cima" TEXT,
    "barra" TEXT,
    "panturrilha" TEXT,
    "cavalo" TEXT,
    "ajuste" "AjusteTipo",
    "corGravata" TEXT,
    "suspensorio" BOOLEAN NOT NULL DEFAULT false,
    "lenco" BOOLEAN NOT NULL DEFAULT false,
    "sapatoNumero" TEXT,
    "sapatoCor" "CorPeca",
    "flor" BOOLEAN NOT NULL DEFAULT false,
    "numeroAnel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PessoaPedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Peca" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "tipo" "TipoPeca" NOT NULL,
    "tamanho" TEXT,
    "cor" TEXT,
    "descricao" TEXT,
    "disponivel" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Peca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemPedido" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "pecaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemPedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pagamento" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "tipo" "TipoPagamento" NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "formaPagamento" "FormaPagamento" NOT NULL,
    "pagoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pagamento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_cpf_key" ON "Cliente"("cpf");

-- CreateIndex
CREATE INDEX "Cliente_nome_idx" ON "Cliente"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Pedido_autopreenchimentoToken_key" ON "Pedido"("autopreenchimentoToken");

-- CreateIndex
CREATE INDEX "Pedido_status_idx" ON "Pedido"("status");

-- CreateIndex
CREATE INDEX "Pedido_dataRetirada_idx" ON "Pedido"("dataRetirada");

-- CreateIndex
CREATE UNIQUE INDEX "Peca_codigo_key" ON "Peca"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "ItemPedido_pedidoId_pecaId_key" ON "ItemPedido"("pedidoId", "pecaId");

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PessoaPedido" ADD CONSTRAINT "PessoaPedido_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPedido" ADD CONSTRAINT "ItemPedido_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPedido" ADD CONSTRAINT "ItemPedido_pecaId_fkey" FOREIGN KEY ("pecaId") REFERENCES "Peca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;
