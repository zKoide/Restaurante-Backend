const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient();

module.exports = {
  // Criar um pedido com itens e modificadores
  /*async register(req, res) {
    try {
      const { restauranteId, mesaId, clienteNome, canal, itens } = req.body;

      const pedido = await prisma.pedido.create({
        data: {
          restauranteId,
          mesaId,
          clienteNome,
          canal,
          itens: {
            create: itens.map(item => ({
              cardapioId: item.cardapioId,
              quantidade: item.quantidade,
              observacao: item.observacao,
              setorId: item.setorId,
              modificadores: item.modificadores
                ? { create: item.modificadores.map(mod => ({
                    ingredienteId: mod.ingredienteId,
                    acao: mod.acao,
                    quantidade: mod.quantidade,
                    unidade: mod.unidade,
                    substitutoIngredienteId: mod.substitutoIngredienteId,
                    precoExtra: mod.precoExtra
                  })) }
                : undefined
            }))
          }
        },
        include: {
          itens: {
            include: { modificadores: true }
          }
        }
      });

      res.status(201).json(pedido);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao criar pedido' });
    }
  },*/

  async register(req, res) {
  try {
    const {
      mesaId,clienteNome,telefone,endereco,setorId,
      observacao,canal,formaPagamento,total,itens // adicionado
    } = req.body;
    
    const restauranteId = req.RestUser
    const criadoPorId = req.userId
    // Gera o código do pedido (ex: "PED-20251009-1234")
    const hoje = new Date();
    const dataString = hoje.toISOString().slice(0, 10).replace(/-/g, ''); // ex: "20251009"

    // busca o último pedido do dia
    const ultimoPedidoDoDia = await prisma.pedido.findFirst({
      where: {
        codigo: { startsWith: `PED-${dataString}` },
      },
      orderBy: { criadoEm: 'desc' },
    });
    let sequencial = 1;
    if (ultimoPedidoDoDia) {
      // extrai o último número sequencial do código, ex: "PED-20251009-0012"
      const partes = ultimoPedidoDoDia.codigo.split('-');
      const ultimoNumero = parseInt(partes[2], 10);
      sequencial = ultimoNumero + 1;
    }
    
    // garante que sempre terá 4 dígitos: 0001, 0002, 0010...
    const sequencialFormatado = String(sequencial).padStart(4, '0');
    
    console.log(`PED-${dataString}-${sequencialFormatado}`)
    const codigo = `PED-${dataString}-${sequencialFormatado}`;
    //const codigo = `PED-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const pedido = await prisma.pedido.create({
      data: {
        codigo,
        restauranteId,
        mesaId,
        clienteNome,
        telefone,
        endereco,
        observacao,
        canal,
        formaPagamento,
        total,
        criadoPorId, // opcional, caso venha o id do usuário logado
        itens: {
          create: itens.map((item) => ({
            cardapioId: item.id,
            quantidade: item.quantidade,
            observacao: item.observacao,
            precoUnitario: item.preco,
            setorId: item.setorid,
            subtotal: item.quantidade*item.preco,

            modificadores: item.modificadores?.length
              ? {
                  create: item.modificadores.map((mod) => ({
                    ingredienteId: mod.ingredienteId,
                    acao: mod.acao,
                    quantidade: mod.quantidade,
                    unidade: mod.unidade,
                    substitutoIngredienteId: mod.substitutoIngredienteId,
                    precoExtra: mod.precoExtra,
                  })),
                }
              : undefined,
          })),
        },
      },
      include: {
        itens: {
          include: {
            cardapio: true,
            modificadores: true,
          },
        },
      },
    });
    // Emite o novo pedido para todos conectados
    const io = req.app.get("io");
    io.emit("novoPedido", pedido);

    return res.status(201).json(pedido);
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return res.status(500).json({
      error: "Erro ao registrar o pedido",
      details: error.message,
    });
  }
},
  // Listar todos os pedidos
  async index(req, res) {
    try {
      const pedidos = await prisma.pedido.findMany({
        orderBy: {id: 'asc'},
        include: {
          itens: { include: { 
            cardapio: true,
            modificadores: true,
          } }
        }
      });
      res.json(pedidos);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao listar pedidos' });
    }
  },

  // Listar todos os pedidos por area e por restaurante
  async indexPorSetor(req, res) {
    const restauranteId = req.RestUser
    const { setorId } = req.params;
    try {
      const pedidos = await prisma.pedido.findMany({
        where: {
          restauranteId: restauranteId,
          itens: {
            some: {
              setorId: setorId,
            },
          },
        },
        include: {
          itens: {
            where: { setorId: setorId },
            include: { cardapio: true },
          },
        },
        orderBy: { criadoEm: 'asc' },
      });

      res.json(pedidos);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar pedidos' });
    }
  },

  // Buscar pedido por ID
  async findByID(req, res) {
    try {
      const { id } = req.params;
      const pedido = await prisma.pedido.findUnique({
        where: { id: BigInt(id) },
        include: {
          itens: { include: { 
            cardapio: true,
            modificadores: true 
          } }
        }
      });
      if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' });
      res.json(pedido);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar pedido' });
    }
  },

  // Buscar pedidos por restaurante
  async findByRestaurante(req, res) {
    try {
      const { restauranteId } = req.params;
      const pedidos = await prisma.pedido.findMany({
        where: { restauranteId: BigInt(restauranteId) },
        include: {
          itens: { include: { modificadores: true } }
        }
      });
      res.json(pedidos);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao listar pedidos do restaurante' });
    }
  },

  // Atualizar pedido (ex: status)
  async update(req, res) {
    try {
      const { id } = req.params;
      const { status, clienteNome, mesaId } = req.body;
      console.log(id, status)
      const pedido = await prisma.pedido.update({
        where: { id: BigInt(id) },
        data: { status, clienteNome, mesaId },
        include: { itens: { include: { modificadores: true } } }
      });

      if (status === "cancelado") {
        await prisma.itemPedido.updateMany({
          where: { pedidoId: Number(id) },
          data: { status: "cancelado" },
        });
      }
      if (status === "entregue") {
        await prisma.itemPedido.updateMany({
          where: { pedidoId: Number(id) },
          data: { status: "entregue" },
        });
      }
      const pedidoAtualizado = await prisma.pedido.findUnique({ where: { id: id }, include: { itens: { include: { cardapio: true } } }});
      console.log(pedidoAtualizado);
      const io = req.app.get('io');
      io.emit('pedidoAtualizado', pedidoAtualizado);

      res.json(pedido);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao atualizar pedido' });
    }
  },

  // Deletar pedido
  async delete(req, res) {
    try {
      const { id } = req.params;
      await prisma.pedido.delete({ where: { id: BigInt(id) } });
      res.json({ message: 'Pedido deletado' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao deletar pedido' });
    }
  }
};
