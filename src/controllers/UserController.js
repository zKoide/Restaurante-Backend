//const User = require('../models/User');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');


function GenerateToken(params = {}){
    return token = jwt.sign( params , authConfig.secret, {
        expiresIn: 86400,
    })
}

module.exports = {
    // CREATE usuário
    async register(req, res) {
        try {
            const { restauranteId, nome, email, senha, ativo, roleId } = req.body;

            // Hash da senha
            const hashedPassword = await bcrypt.hash(senha, 10);

            const usuario = await prisma.usuario.create({
                data: {
                    restauranteId: BigInt(restauranteId),
                    nome,
                    email,
                    senhaHash: hashedPassword,
                    ativo: ativo !== undefined ? ativo : true,
                    roleId
                },
            });

            res.json({ ...usuario, senhaHash: undefined }); // não retornar senha
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // LOGIN - autenticação
    async login(req, res) {
        try {
            const { email, senha } = req.body;

            const usuario = await prisma.usuario.findUnique({
                where: { email }
            });

            if (!usuario) return res.status(400).json({ error: "Usuário não encontrado" });

            const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
            if (!senhaValida) return res.status(400).json({ error: "Senha inválida" });

            const token = GenerateToken({ id: usuario.id });

            res.json({
                usuario: { ...usuario, senhaHash: undefined },
                token
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // READ - lista todos os usuários
    async index(req, res) {
        try {
            const usuarios = await prisma.usuario.findMany({
                include: { restaurante: true }
            });
            // não retornar senha
            const sanitized = usuarios.map(u => ({ ...u, senhaHash: undefined }));
            res.json(sanitized);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // READ - busca por ID
    async findByID(req, res) {
        try {
            const usuario = await prisma.usuario.findUnique({
                where: { id: BigInt(req.params.id) },
                include: { restaurante: true }
            });
            if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });
            res.json({ ...usuario, senhaHash: undefined });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // READ - lista usuários de um restaurante
    async findByRestaurante(req, res) {
        try {
            const usuarioLogado = await prisma.usuario.findUnique({
            where: { id: req.userId },
            });

            if (!usuarioLogado) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            const usuarios = await prisma.usuario.findMany({
                where: { restauranteId: BigInt(usuarioLogado.restauranteId) },
                include: { restaurante: true }
            });
            const sanitized = usuarios.map(u => ({ ...u, senhaHash: undefined }));
            res.json(sanitized);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // UPDATE usuário
    async update(req, res) {
        try {
            const { nome, email, senha, ativo, roleId } = req.body;

            const dataToUpdate = {
                nome,
                email,
                ativo,
                roleId
            };

            if (senha) {
                dataToUpdate.senhaHash = await bcrypt.hash(senha, 10);
            }

            const usuario = await prisma.usuario.update({
                where: { id: BigInt(req.params.id) },
                data: dataToUpdate
            });

            res.json({ ...usuario, senhaHash: undefined });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // DELETE usuário (hard delete ou desativar)
    async delete(req, res) {
        try {
            const usuario = await prisma.usuario.update({
                where: { id: BigInt(req.params.id) },
                data: { ativo: false }
            });
            res.json({ message: "Usuário desativado com sucesso", usuario: { ...usuario, senhaHash: undefined } });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // INFO do usuário logado
    async userinf(req, res) {
    try {
        // Pega o usuário logado pelo ID do token
        const usuario = await prisma.usuario.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                nome: true,
                email: true,
                roleId:true,
                ativo: true,
                restauranteId: true,
                criadoEm: true,
            },
        });
        console.log(req.userTipo)
        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        return res.json(usuario);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao buscar informações do usuário' });
    }
}
};
