// src/controllers/SetorController.js
const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient();

module.exports = {
    // CREATE
    async register(req, res) {
        try {
            const { nome, tipo } = req.body;
            const restauranteId = req.RestUser
            const setor = await prisma.setor.create({
              data: { restauranteId, nome, tipo }
            });
            res.json(setor);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // READ - lista todos do restaurante do usuario
    async index(req, res) {
        
        const restauranteId = req.RestUser
        try {
            const setores = await prisma.setor.findMany({
                where: { restauranteId: BigInt(restauranteId) },
                include: { restaurante: true, cardapios: true }
            });
            res.json(setores);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // READ - busca por id
    async findByID(req, res) {
        try {
            const setor = await prisma.setor.findUnique({
              where: { id: BigInt(req.params.id) },
              include: { restaurante: true, cardapios: true }
            });
            if (!setor) return res.status(404).json({ error: "Setor não encontrado" });
            res.json(setor);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // READ - lista setores de um restaurante
    async findByRestaurante(req, res) {
        try {
            const setores = await prisma.setor.findMany({
              where: { restauranteId: BigInt(req.params.restauranteId) },
              include: { cardapios: true }
            });
            res.json(setores);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // UPDATE
    async update(req, res) {
        try {
            const { nome, tipo } = req.body;
            const setor = await prisma.setor.update({
              where: { id: BigInt(req.params.id) },
              data: { nome, tipo }
            });
            res.json(setor);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // DELETE (hard delete)
    async delete(req, res) {
        try {
            const setor = await prisma.setor.delete({
              where: { id: BigInt(req.params.id) }
            });
            res.json({ message: "Setor deletado com sucesso", setor });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
}
