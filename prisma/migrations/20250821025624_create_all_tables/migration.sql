-- CreateEnum
CREATE TYPE "public"."PapelUsuario" AS ENUM ('admin', 'gerente', 'garcom', 'cozinha', 'bar');

-- CreateEnum
CREATE TYPE "public"."StatusPedido" AS ENUM ('recebido', 'em_preparo', 'pronto', 'entregue', 'cancelado');

-- CreateEnum
CREATE TYPE "public"."StatusItem" AS ENUM ('pendente', 'em_preparo', 'pronto', 'cancelado');

-- CreateEnum
CREATE TYPE "public"."AcaoModificador" AS ENUM ('remover', 'adicionar', 'substituir');

-- CreateTable
CREATE TABLE "public"."tables" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Restaurante" (
    "id" BIGSERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "documento" TEXT,
    "email" TEXT,
    "telefone" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
    "enderecoLogradouro" TEXT,
    "enderecoNumero" TEXT,
    "enderecoBairro" TEXT,
    "enderecoCidade" TEXT,
    "enderecoEstado" TEXT,
    "enderecoCep" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Restaurante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Setor" (
    "id" BIGSERIAL NOT NULL,
    "restauranteId" BIGINT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT,

    CONSTRAINT "Setor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Usuario" (
    "id" BIGSERIAL NOT NULL,
    "restauranteId" BIGINT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "senhaHash" TEXT NOT NULL,
    "papel" "public"."PapelUsuario" NOT NULL DEFAULT 'garcom',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Mesa" (
    "id" BIGSERIAL NOT NULL,
    "restauranteId" BIGINT NOT NULL,
    "identificador" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Mesa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Cardapio" (
    "id" BIGSERIAL NOT NULL,
    "restauranteId" BIGINT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "preco" DECIMAL(10,2) NOT NULL,
    "categoria" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "setorId" BIGINT,

    CONSTRAINT "Cardapio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Ingrediente" (
    "id" BIGSERIAL NOT NULL,
    "restauranteId" BIGINT NOT NULL,
    "nome" TEXT NOT NULL,
    "unidade" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Ingrediente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CardapioIngrediente" (
    "cardapioId" BIGINT NOT NULL,
    "ingredienteId" BIGINT NOT NULL,
    "quantidade" DECIMAL(10,3),
    "unidade" TEXT,

    CONSTRAINT "CardapioIngrediente_pkey" PRIMARY KEY ("cardapioId","ingredienteId")
);

-- CreateTable
CREATE TABLE "public"."Pedido" (
    "id" BIGSERIAL NOT NULL,
    "restauranteId" BIGINT NOT NULL,
    "mesaId" BIGINT,
    "clienteNome" TEXT,
    "canal" TEXT NOT NULL DEFAULT 'mesa',
    "status" "public"."StatusPedido" NOT NULL DEFAULT 'recebido',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ItemPedido" (
    "id" BIGSERIAL NOT NULL,
    "pedidoId" BIGINT NOT NULL,
    "cardapioId" BIGINT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "observacao" TEXT,
    "status" "public"."StatusItem" NOT NULL DEFAULT 'pendente',
    "setorId" BIGINT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemPedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ItemPedidoModificador" (
    "id" BIGSERIAL NOT NULL,
    "itemPedidoId" BIGINT NOT NULL,
    "ingredienteId" BIGINT,
    "acao" "public"."AcaoModificador" NOT NULL,
    "quantidade" DECIMAL(10,3),
    "unidade" TEXT,
    "substitutoIngredienteId" BIGINT,
    "precoExtra" DECIMAL(10,2) DEFAULT 0,

    CONSTRAINT "ItemPedidoModificador_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Setor_restauranteId_nome_key" ON "public"."Setor"("restauranteId", "nome");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "public"."Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Mesa_restauranteId_identificador_key" ON "public"."Mesa"("restauranteId", "identificador");

-- AddForeignKey
ALTER TABLE "public"."Setor" ADD CONSTRAINT "Setor_restauranteId_fkey" FOREIGN KEY ("restauranteId") REFERENCES "public"."Restaurante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Usuario" ADD CONSTRAINT "Usuario_restauranteId_fkey" FOREIGN KEY ("restauranteId") REFERENCES "public"."Restaurante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Mesa" ADD CONSTRAINT "Mesa_restauranteId_fkey" FOREIGN KEY ("restauranteId") REFERENCES "public"."Restaurante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cardapio" ADD CONSTRAINT "Cardapio_restauranteId_fkey" FOREIGN KEY ("restauranteId") REFERENCES "public"."Restaurante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cardapio" ADD CONSTRAINT "Cardapio_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "public"."Setor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ingrediente" ADD CONSTRAINT "Ingrediente_restauranteId_fkey" FOREIGN KEY ("restauranteId") REFERENCES "public"."Restaurante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CardapioIngrediente" ADD CONSTRAINT "CardapioIngrediente_cardapioId_fkey" FOREIGN KEY ("cardapioId") REFERENCES "public"."Cardapio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CardapioIngrediente" ADD CONSTRAINT "CardapioIngrediente_ingredienteId_fkey" FOREIGN KEY ("ingredienteId") REFERENCES "public"."Ingrediente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pedido" ADD CONSTRAINT "Pedido_restauranteId_fkey" FOREIGN KEY ("restauranteId") REFERENCES "public"."Restaurante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pedido" ADD CONSTRAINT "Pedido_mesaId_fkey" FOREIGN KEY ("mesaId") REFERENCES "public"."Mesa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ItemPedido" ADD CONSTRAINT "ItemPedido_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "public"."Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ItemPedido" ADD CONSTRAINT "ItemPedido_cardapioId_fkey" FOREIGN KEY ("cardapioId") REFERENCES "public"."Cardapio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ItemPedido" ADD CONSTRAINT "ItemPedido_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "public"."Setor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ItemPedidoModificador" ADD CONSTRAINT "ItemPedidoModificador_itemPedidoId_fkey" FOREIGN KEY ("itemPedidoId") REFERENCES "public"."ItemPedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ItemPedidoModificador" ADD CONSTRAINT "ItemPedidoModificador_ingredienteId_fkey" FOREIGN KEY ("ingredienteId") REFERENCES "public"."Ingrediente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ItemPedidoModificador" ADD CONSTRAINT "ItemPedidoModificador_substitutoIngredienteId_fkey" FOREIGN KEY ("substitutoIngredienteId") REFERENCES "public"."Ingrediente"("id") ON DELETE SET NULL ON UPDATE CASCADE;
