const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json')
module.exports = async(req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader)
        return res.status(401).send({error: 'No Token provided'});

    const parts = authHeader.split(' ');

    if(!parts.length === 2)
        return res.status(401).send({error: 'Token error'});

    const [ scheme , token ] = parts;

    if(!/^Bearer$/i.test(scheme))
        return res.status(401).send({error: 'Token malformatted'});

    jwt.verify(token, authConfig.secret, async (err, decoded) => {
        if (err) return res.status(401).send({error: 'Token Invalid'});

        req.userId = decoded.id;

        // Busca o tipo do usuário no DB
        const usuario = await prisma.usuario.findUnique({
            where: { id: req.userId },
            select: { roleId: true, restauranteId: true }
        });

        if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

        req.userTipo = usuario.roleId;
        req.RestUser = usuario.restauranteId;

        return next();
    })
};