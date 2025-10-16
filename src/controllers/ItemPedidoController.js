const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

module.exports = {
  // Criar item de pedido
  async register(req, res) {
    try {
      const { pedidoId, cardapioId, quantidade, observacao, setorId, modificadores } = req.body;

      const itemPedido = await prisma.itemPedido.create({
        data: {
          pedidoId: BigInt(pedidoId),
          cardapioId: BigInt(cardapioId),
          quantidade,
          observacao,
          setorId: BigInt(setorId),
          modificadores: modificadores
            ? { create: modificadores.map(mod => ({
                ingredienteId: BigInt(mod.ingredienteId),
                acao: mod.acao,
                quantidade: mod.quantidade,
                unidade: mod.unidade,
                substitutoIngredienteId: mod.substitutoIngredienteId ? BigInt(mod.substitutoIngredienteId) : null,
                precoExtra: mod.precoExtra
              })) }
            : undefined
        },
        include: { modificadores: true }
      });

      res.status(201).json(itemPedido);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao criar item de pedido' });
    }
  },

// Listar itens de um pedido específico
async index(req, res) {
  const { pedidoId } = req.params; // pega o ID do pedido da rota
  try {
    const itens = await prisma.itemPedido.findMany({
      where: { pedidoId: Number(pedidoId) },
      include: { modificadores: true }
    });
    res.json(itens);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar itens de pedido' });
  }
},

  // Buscar item por ID
  async findByID(req, res) {
    try {
      const { id } = req.params;
      const item = await prisma.itemPedido.findUnique({
        where: { id: BigInt(id) },
        include: { modificadores: true }
      });
      if (!item) return res.status(404).json({ error: 'Item não encontrado' });
      res.json(item);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar item de pedido' });
    }
  },

  // Atualizar item
  async update(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const item = await prisma.itemPedido.update({
        where: { id: BigInt(id) },
        data: { status },
        include: { modificadores: true }
      });
      const pedidoAtualizado = await prisma.pedido.findUnique({ where: { id: item.pedidoId }, include: { itens: { include: { cardapio: true } } }});
      const io = req.app.get('io');
      io.emit('pedidoAtualizado', pedidoAtualizado);
      res.json(item);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao atualizar item de pedido' });
    }
  },

  // Deletar item
  async delete(req, res) {
    try {
      const { id } = req.params;
      await prisma.itemPedido.delete({ where: { id: BigInt(id) } });
      res.json({ message: 'Item de pedido deletado' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao deletar item de pedido' });
    }
  }
};
