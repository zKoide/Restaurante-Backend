/*
  Warnings:

  - The values [em_preparo] on the enum `StatusItem` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[codigo]` on the table `Pedido` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."StatusItem_new" AS ENUM ('pendente', 'preparo', 'pronto', 'entregue', 'cancelado');
ALTER TABLE "public"."ItemPedido" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."ItemPedido" ALTER COLUMN "status" TYPE "public"."StatusItem_new" USING ("status"::text::"public"."StatusItem_new");
ALTER TYPE "public"."StatusItem" RENAME TO "StatusItem_old";
ALTER TYPE "public"."StatusItem_new" RENAME TO "StatusItem";
DROP TYPE "public"."StatusItem_old";
ALTER TABLE "public"."ItemPedido" ALTER COLUMN "status" SET DEFAULT 'pendente';
COMMIT;

-- AlterTable
ALTER TABLE "public"."ItemPedido" ADD COLUMN     "atualizadoEm" TIMESTAMP(3),
ADD COLUMN     "precoUnitario" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
ADD COLUMN     "subtotal" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
ADD COLUMN     "uuid" TEXT;

-- AlterTable
ALTER TABLE "public"."Pedido" ADD COLUMN     "codigo" TEXT,
ADD COLUMN     "criadoPorId" BIGINT,
ADD COLUMN     "endereco" TEXT,
ADD COLUMN     "formaPagamento" TEXT,
ADD COLUMN     "observacao" TEXT,
ADD COLUMN     "telefone" TEXT,
ADD COLUMN     "total" DECIMAL(65,30) NOT NULL DEFAULT 0.00;

-- CreateIndex
CREATE UNIQUE INDEX "Pedido_codigo_key" ON "public"."Pedido"("codigo");

-- AddForeignKey
ALTER TABLE "public"."Pedido" ADD CONSTRAINT "Pedido_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "public"."Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
