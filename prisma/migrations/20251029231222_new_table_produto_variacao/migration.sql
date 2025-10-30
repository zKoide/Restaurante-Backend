-- CreateTable
CREATE TABLE "public"."ProdutoVariacao" (
    "id" BIGSERIAL NOT NULL,
    "cardapioId" BIGINT NOT NULL,
    "nome" TEXT,
    "preco" TEXT,
    "frutasMax" TEXT,
    "acompMax" TEXT,

    CONSTRAINT "ProdutoVariacao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ProdutoVariacao" ADD CONSTRAINT "ProdutoVariacao_cardapioId_fkey" FOREIGN KEY ("cardapioId") REFERENCES "public"."Cardapio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
