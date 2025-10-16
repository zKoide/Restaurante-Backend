-- DropForeignKey
ALTER TABLE "public"."CardapioIngrediente" DROP CONSTRAINT "CardapioIngrediente_cardapioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CardapioIngrediente" DROP CONSTRAINT "CardapioIngrediente_ingredienteId_fkey";

-- AddForeignKey
ALTER TABLE "public"."CardapioIngrediente" ADD CONSTRAINT "CardapioIngrediente_cardapioId_fkey" FOREIGN KEY ("cardapioId") REFERENCES "public"."Cardapio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CardapioIngrediente" ADD CONSTRAINT "CardapioIngrediente_ingredienteId_fkey" FOREIGN KEY ("ingredienteId") REFERENCES "public"."Ingrediente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
