const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

module.exports = {
  // Criar modificador de item
  async register(req, res) {
    try {
      const { itemPedidoId, ingredienteId, acao, quantidade, unidade, substitutoIngredienteId, precoExtra } = req.body;

      const modificador = await prisma.itemPedidoModificador.create({
        data: {
          itemPedidoId: BigInt(itemPedidoId),
          ingredienteId: BigInt(ingredienteId),
          acao,
          quantidade,
          unidade,
          substitutoIngredienteId: substitutoIngredienteId ? BigInt(substitutoIngredienteId) : null,
          precoExtra
        }
      });

      res.status(201).json(modificador);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao criar modificador' });
    }
  },

  // Listar todos
  async index(req, res) {
    try {
      const modificadores = await prisma.itemPedidoModificador.findMany();
      res.json(modificadores);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao listar modificadores' });
    }
  },

  // Buscar por ID
  async findByID(req, res) {
    try {
      const { id } = req.params;
      const modificador = await prisma.itemPedidoModificador.findUnique({ where: { id: BigInt(id) } });
      if (!modificador) return res.status(404).json({ error: 'Modificador não encontrado' });
      res.json(modificador);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar modificador' });
    }
  },

  // Atualizar modificador
  async update(req, res) {
    try {
      const { id } = req.params;
      const { acao, quantidade, unidade, substitutoIngredienteId, precoExtra } = req.body;

      const modificador = await prisma.itemPedidoModificador.update({
        where: { id: BigInt(id) },
        data: {
          acao,
          quantidade,
          unidade,
          substitutoIngredienteId: substitutoIngredienteId ? BigInt(substitutoIngredienteId) : null,
          precoExtra
        }
      });

      res.json(modificador);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao atualizar modificador' });
    }
  },

  // Deletar modificador
  async delete(req, res) {
    try {
      const { id } = req.params;
      await prisma.itemPedidoModificador.delete({ where: { id: BigInt(id) } });
      res.json({ message: 'Modificador deletado' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao deletar modificador' });
    }
  }
};
