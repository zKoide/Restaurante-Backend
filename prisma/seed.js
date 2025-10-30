const { PrismaClient } = require('../src/generated/prisma')
const prisma = new PrismaClient()

async function main() {
  const restauranteId = 3
  const setorId = 11

  // ================================
  // INGREDIENTES
  // ================================
  const frutas = [
    "Banana", "Morango", "Kiwi", "Abacaxi", "Manga", "Uva"
  ]

  const complementos = [
    "Leite Condensado", "Leite em Pó", "Granulado", "Granola", "M&M", "Paçoca"
  ]

  const ingredientes = []

  // Cria frutas
  for (const nome of frutas) {
    const ingrediente = await prisma.ingrediente.create({
      data: {
        nome,
        unidade: "un",
        restauranteId,
      }
    })
    ingredientes.push({ ...ingrediente, tipo: 'fruta', precoExtra: 2.0 })
  }

  // Cria complementos
  for (const nome of complementos) {
    const ingrediente = await prisma.ingrediente.create({
      data: {
        nome,
        unidade: "un",
        restauranteId,
      }
    })
    ingredientes.push({ ...ingrediente, tipo: 'complemento', precoExtra: 2.0 })
  }

  // Nutella com preço extra maior
  const nutella = await prisma.ingrediente.create({
    data: {
      nome: "Nutella",
      unidade: "un",
      restauranteId,
    }
  })
  ingredientes.push({ ...nutella, tipo: 'complemento', precoExtra: 7.0 })

  console.log(`✅ Ingredientes criados: ${ingredientes.length}`)

  // ================================
  // ITENS DO CARDÁPIO
  // ================================

  const acais = [
    {
      nome: "Açaí no Copo 300ml",
      descricao: "1 fruta + 3 acompanhamentos",
      preco: 18.00,
    },
    {
      nome: "Açaí no Copo 500ml",
      descricao: "2 frutas + 3 acompanhamentos",
      preco: 29.00,
    },
    {
      nome: "Açaí no Copo 700ml",
      descricao: "3 frutas + 3 acompanhamentos",
      preco: 38.00,
    },
  ]

  for (const acai of acais) {
    const cardapio = await prisma.cardapio.create({
      data: {
        nome: acai.nome,
        descricao: acai.descricao,
        preco: acai.preco,
        categoria: "Açaí",
        restauranteId,
        setorId,
        ativo: true,
        ingredientes: {
          create: ingredientes.map(ing => ({
            ingredienteId: ing.id,
          })),
        },
      },
    })

    console.log(`🍧 ${cardapio.nome} criado com ${ingredientes.length} ingredientes.`)
  }

  console.log("✅ Seed concluído com sucesso!")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
