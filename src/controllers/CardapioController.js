// src/controllers/CardapioController.js
const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient();

module.exports = {
    // CREATE Cardápio com ingredientes
    async register(req, res) {
        try {
            const { setorId, nome, descricao, preco, categoria, ativo, ingredientes } = req.body;
            const restauranteId = req.RestUser
            const precoFormatado = parseFloat(preco.toString().replace(',', '.'));
            
            const cardapio = await prisma.cardapio.create({
                data: {
                    setor: {
                        connect: { id: BigInt(setorId) } // conecta ao setor existente
                    },
                    restaurante: {
                        connect: { id: BigInt(restauranteId) } // conecta ao restaurante existente
                    },
                    nome,
                    descricao,
                    preco: Number(precoFormatado),
                    categoria,
                    ativo: ativo !== undefined ? ativo : true,
                    ingredientes: ingredientes ? {
                        create: ingredientes.map(i => ({
                            ingredienteId: BigInt(i.id),
                            quantidade: i.quantidade ? Number(i.quantidade) : undefined,
                            unidade: i.unidade
                        }))
                    } : undefined
                },
                include: { ingredientes: true }
            });

            res.json(cardapio);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async apagarCardapioTeste() {
    const cardapioTesteId = 9n; // Substitua pelo ID do cardápio de teste

    // Apagar os vínculos de ingredientes (opcional, mas seguro)
    await prisma.cardapioIngrediente.deleteMany({
        where: { cardapioId: cardapioTesteId },
    });

    // Apagar o cardápio
    await prisma.cardapio.delete({
        where: { id: cardapioTesteId },
    });

    console.log("Cardápio de teste apagado!");
},

    // READ - lista todos
    async index(req, res) {
        try {
            const restauranteId = req.RestUser
            const cardapios = await prisma.cardapio.findMany({
                orderBy: {id: 'asc'},
                where: { restauranteId: BigInt(restauranteId) },
                include: { 
                    restaurante: true, 
                    setor: true, 
                    ingredientes: { include: {
                        ingrediente: true // <-- aqui ele faz join com Ingrediente
                        }
                    },
                }
            });
            res.json(cardapios);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // READ - busca por id
    async findByID(req, res) {
        try {
            const cardapio = await prisma.cardapio.findUnique({
                where: { id: BigInt(req.params.id) },
                include: { 
                    restaurante: true,
                    setor: true, 
                    ingredientes: { include: {
                        ingrediente: true // <-- aqui ele faz join com Ingrediente
                        }
                    },
                }
            });
            if (!cardapio) return res.status(404).json({ error: "Cardápio não encontrado" });
            res.json(cardapio);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // READ - lista cardápios de um restaurante
    async findByRestaurante(req, res) {
        try {
            const cardapios = await prisma.cardapio.findMany({
                where: { restauranteId: BigInt(req.params.restauranteId) },
                include: { setor: true, ingredientes: true }
            });
            res.json(cardapios);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // READ - lista cardápios de um setor
    async findBySetor(req, res) {
        try {
            const cardapios = await prisma.cardapio.findMany({
                where: { setorId: BigInt(req.params.setorId) },
                include: { restaurante: true, ingredientes: true }
            });
            res.json(cardapios);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // UPDATE Cardápio e ingredientes
    async update(req, res) {
        try {
            const { nome, descricao, preco, ativo, setorId, ingredientes } = req.body;
            const precoFormatado = parseFloat(preco.toString().replace(',', '.'));

            const cardapio = await prisma.cardapio.update({
                where: { id: BigInt(req.params.id) },
                data: {
                    nome,
                    descricao,
                    preco: preco !== undefined ? Number(precoFormatado) : undefined,
                    setorId: setorId !== undefined ? BigInt(setorId) : undefined,
                    ativo: ativo,
                    ingredientes: ingredientes ? {
                        deleteMany: {},
                        create: ingredientes.map(i => ({
                            ingredienteId: BigInt(i.id),
                            quantidade: i.quantidade ? Number(i.quantidade) : undefined,
                            unidade: i.unidade
                        }))
                    } : undefined
                },
                include: { ingredientes: { include: {
                        ingrediente: true // <-- aqui ele faz join com Ingrediente
                        }
                    },
                }
            });

            res.json(cardapio);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // DELETE Cardápio (hard delete)
    async delete(req, res) {
        try {
            const cardapio = await prisma.cardapio.update({
                where: { id: BigInt(req.params.id) },
                data: { ativo: false }
            });
            res.json({ message: "Cardápio desativado com sucesso", cardapio });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
