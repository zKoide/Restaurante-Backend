const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

module.exports = {
    // CREATE Role
    async register(req, res) {
        try {
            
            const { nome } = req.body;
            
            const usuarioLogado = await prisma.usuario.findUnique({
            where: { id: req.userId },
            });

            if (!usuarioLogado) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            const role = await prisma.role.create({
                data: {
                    nome,
                    restauranteId: BigInt(usuarioLogado.restauranteId),
                }
            });

            res.json(role);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // LISTAR todas roles de um restaurante
    async index(req, res) {
        try {
            const usuarioLogado = await prisma.usuario.findUnique({
            where: { id: req.userId },
            });

            if (!usuarioLogado) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            const roles = await prisma.role.findMany({
                where: { restauranteId: BigInt(usuarioLogado.restauranteId) },
                include: { rolePermissions: true, usuarios: true }
            });
            res.json(roles);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // BUSCAR por ID
    async findByID(req, res) {
        try {
            const role = await prisma.role.findUnique({
                where: { id: BigInt(req.params.id) },
                include: {
                    rolePermissions: { include: { permission: true } },
                    usuarios: true
                }
            });

            if (!role) return res.status(404).json({ error: "Role não encontrada" });
            res.json(role);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // UPDATE Role
    async update(req, res) {
        try {
            const { nome } = req.body;

            const role = await prisma.role.update({
                where: { id: BigInt(req.params.id) },
                data: { nome }
            });

            res.json(role);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // DELETE Role
    async delete(req, res) {
        try {
            const role = await prisma.role.delete({
                where: { id: BigInt(req.params.id) }
            });

            res.json({ message: "Role deletada com sucesso", role });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
