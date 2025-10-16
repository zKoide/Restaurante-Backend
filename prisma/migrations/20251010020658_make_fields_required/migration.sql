/*
  Warnings:

  - Made the column `atualizadoEm` on table `ItemPedido` required. This step will fail if there are existing NULL values in that column.
  - Made the column `uuid` on table `ItemPedido` required. This step will fail if there are existing NULL values in that column.
  - Made the column `codigo` on table `Pedido` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."ItemPedido" ALTER COLUMN "atualizadoEm" SET NOT NULL,
ALTER COLUMN "uuid" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Pedido" ALTER COLUMN "codigo" SET NOT NULL;
