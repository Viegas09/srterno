-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'ATENDENTE');

-- AlterTable
ALTER TABLE "Pagamento" ADD COLUMN     "registradoPorId" TEXT;

-- AlterTable
ALTER TABLE "Pedido" ADD COLUMN     "criadoPorId" TEXT;

-- AlterTable
ALTER TABLE "PessoaPedido" ADD COLUMN     "lancadoPorId" TEXT;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'ATENDENTE';

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PessoaPedido" ADD CONSTRAINT "PessoaPedido_lancadoPorId_fkey" FOREIGN KEY ("lancadoPorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
