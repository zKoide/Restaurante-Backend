const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

module.exports = {
    // CREATE Permission
    async register(req, res) {
        try {
            const { nome } = req.body;

            const permission = await prisma.permission.create({
                data: { nome }
            });

            res.json(permission);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // LISTAR todas permissions
    async index(req, res) {
        try {
            const permissions = await prisma.permission.findMany({
                include: { rolePermissions: true }
            });
            res.json(permissions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // BUSCAR por ID
    async findByID(req, res) {
        try {
            const permission = await prisma.permission.findUnique({
                where: { id: BigInt(req.params.id) },
                include: { rolePermissions: { include: { role: true } } }
            });

            if (!permission) return res.status(404).json({ error: "Permission não encontrada" });
            res.json(permission);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // UPDATE Permission
    async update(req, res) {
        try {
            const { nome } = req.body;

            const permission = await prisma.permission.update({
                where: { id: BigInt(req.params.id) },
                data: { nome }
            });

            res.json(permission);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // DELETE Permission
    async delete(req, res) {
        try {
            const permission = await prisma.permission.delete({
                where: { id: BigInt(req.params.id) }
            });

            res.json({ message: "Permission deletada com sucesso", permission });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
