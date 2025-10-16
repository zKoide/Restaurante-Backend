const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

module.exports = {
    // ATRIBUIR permission a uma role
    async assignPermission(req, res) {
        try {
            const { roleId, permissionId } = req.body;

            const rolePermission = await prisma.rolePermission.create({
                data: {
                    roleId: BigInt(roleId),
                    permissionId: BigInt(permissionId)
                }
            });

            res.json(rolePermission);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // REMOVER permission de uma role
    async removePermission(req, res) {
        try {
            const { roleId, permissionId } = req.body;

            const rolePermission = await prisma.rolePermission.delete({
                where: {
                    roleId_permissionId: {
                        roleId: BigInt(roleId),
                        permissionId: BigInt(permissionId)
                    }
                }
            });

            res.json({ message: "Permissão removida da role", rolePermission });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // LISTAR todas associações
    async index(req, res) {
        try {
            const list = await prisma.rolePermission.findMany({
                include: { role: true, permission: true }
            });

            res.json(list);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
