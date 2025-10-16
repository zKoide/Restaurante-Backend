const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

module.exports = {
    // CREATE
    async register(req, res) {
        try {
            const {
                nome,
                documento,
                email,
                telefone,
                timezone,
                enderecoLogradouro,
                enderecoNumero,
                enderecoBairro,
                enderecoCidade,
                enderecoEstado,
                enderecoCep,
                ativo
            } = req.body;

            const restaurante = await prisma.restaurante.create({
                data: {
                    nome,
                    documento,
                    email,
                    telefone,
                    timezone: timezone || "America/Sao_Paulo",
                    enderecoLogradouro,
                    enderecoNumero,
                    enderecoBairro,
                    enderecoCidade,
                    enderecoEstado,
                    enderecoCep,
                    ativo
                }
            });
            res.json(restaurante);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // READ - lista todos
    async index(req, res) {
        try {
            const restaurantes = await prisma.restaurante.findMany({
                where: { ativo: true },
                orderBy: { criadoEm: "desc" }
            });
            res.json(restaurantes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // READ - busca por id
    async findByID(req, res) {
        try {
            const restaurante = await prisma.restaurante.findUnique({
                where: { id: BigInt(req.params.id) },
                include: {
                    usuarios: true,
                    setores: true,
                    mesas: true,
                    cardapio: true,
                    ingredientes: true,
                    pedidos: true
                }
            });
            if (!restaurante) {
                return res.status(404).json({ error: "Restaurante não encontrado" });
            }
            res.json(restaurante);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // UPDATE
    async update(req, res) {
        try {
            const data = req.body;
            const restaurante = await prisma.restaurante.update({
                where: { id: BigInt(req.params.id) },
                data
            });
            res.json(restaurante);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // DELETE (soft delete → só desativa)
    async delete(req, res) {
        try {
            const restaurante = await prisma.restaurante.update({
                where: { id: BigInt(req.params.id) },
                data: { ativo: false }
            });
            res.json({ message: "Restaurante desativado", restaurante });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};
