//import { Router } from 'express';
const { Router } = require('express');
const UserController = require('./controllers/UserController');
const IngredienteController = require('./controllers/IngredienteController');
const RestauranteController = require('./controllers/RestauranteController');
const SetorController = require('./controllers/SetorController');
const CardapioController = require('./controllers/CardapioController');
const PedidoController = require('./controllers/PedidoController');
const authMiddleware = require('./middlewares/auth');
const ItemPedidoController = require('./controllers/ItemPedidoController');
const ItemPedidoModificadorController = require('./controllers/ItemPedidoModificadorController');
const RoleController = require('./controllers/RoleController');
const PermissionController = require('./controllers/PermissionController');
const RolePermissionController = require('./controllers/RolePermissionController');

const routes = Router();

routes.post('/register', UserController.register);           // criar usuário
routes.post('/authenticate', UserController.login);         // login

// Rotas protegidas
routes.get('/users', req = authMiddleware, UserController.findByRestaurante); // listar todos usuários de um restaurante
routes.get('/users/:id', req = authMiddleware, UserController.findByID); // buscar por ID
routes.put('/users/:id', req = authMiddleware, UserController.update);   // atualizar usuário
routes.delete('/users/:id', req = authMiddleware, UserController.delete); // desativar usuário
routes.post('/userinf', req = authMiddleware, UserController.userinf);   // info do usuário logado

// ---------------- ROLES ----------------
routes.get('/roles', RoleController.index);
routes.post('/roles', RoleController.register);
routes.get('/roles/:id', authMiddleware, RoleController.findByID);
routes.put('/roles/:id', authMiddleware, RoleController.update);
routes.delete('/roles/:id', authMiddleware, RoleController.delete);

// ---------------- PERMISSIONS ----------------
routes.get('/permissions', authMiddleware, PermissionController.index);
routes.post('/permissions', authMiddleware, PermissionController.register);
routes.get('/permissions/:id', authMiddleware, PermissionController.findByID);
routes.put('/permissions/:id', authMiddleware, PermissionController.update);
routes.delete('/permissions/:id', authMiddleware, PermissionController.delete);

// ---------------- ROLE-PERMISSIONS ----------------
routes.get('/role-permissions', authMiddleware, RolePermissionController.index);
routes.post('/role-permissions/assign', authMiddleware, RolePermissionController.assignPermission);
routes.post('/role-permissions/remove', authMiddleware, RolePermissionController.removePermission);

//req = authMiddleware
routes.post('/ingrediente', req = authMiddleware, IngredienteController.register);
routes.get('/ingrediente', req = authMiddleware, IngredienteController.index);
routes.get('/ingrediente/:id', req = authMiddleware, IngredienteController.findByID);
routes.put('/ingrediente/:id', req = authMiddleware, IngredienteController.update);
routes.delete('/ingrediente/:id', req = authMiddleware, IngredienteController.delete);

//req = authMiddleware
routes.post('/restaurante', RestauranteController.register);
routes.get('/restaurante', RestauranteController.index);
routes.get('/restaurante/:id', RestauranteController.findByID);
routes.put('/restaurante/:id', RestauranteController.update);
routes.delete('/restaurante/:id', RestauranteController.delete);

routes.post('/setor', req = authMiddleware, SetorController.register);
routes.get('/setor', req = authMiddleware, SetorController.index); // lista todos setores de todos restaurantes
routes.get('/setor/:id', req = authMiddleware, SetorController.findByID); // busca por ID
routes.get('/setor/restaurante/:restauranteId', req = authMiddleware, SetorController.findByRestaurante); // lista por restaurante
routes.put('/setor/:id', req = authMiddleware, SetorController.update); //faz update em um setor
routes.delete('/setor/:id', req = authMiddleware, SetorController.delete); //deleta um setor

//req = authMiddleware
routes.post('/cardapio', req = authMiddleware, CardapioController.register); //criar um cardapio
routes.get('/cardapio', req = authMiddleware, CardapioController.index); // todos os cardapios de um restaurantes
routes.get('/cardapio/:id', req = authMiddleware, CardapioController.findByID); // por ID
routes.get('/cardapio/restaurante/:restauranteId', req = authMiddleware, CardapioController.findByRestaurante); // por restaurante
routes.get('/cardapio/setor/:setorId', req = authMiddleware, CardapioController.findBySetor); // por setor
routes.put('/cardapio/:id', req = authMiddleware, CardapioController.update); //update de um cardapio
routes.delete('/cardapio/:id', req = authMiddleware, CardapioController.delete); //deletar um cardapio

routes.get('/apagar', CardapioController.apagarCardapioTeste)

routes.post('/pedido', authMiddleware, PedidoController.register); //criar um pedido
routes.get('/pedido', authMiddleware, PedidoController.index); //listar todos os pedidos
routes.get('/pedido/:id', authMiddleware, PedidoController.findByID); //buscar pedido por ID
routes.get('/pedido/restaurante/:restauranteId', authMiddleware, PedidoController.findByRestaurante); //buscar pedidos por restaurante
routes.get('/pedido/setor/:setorId', authMiddleware, PedidoController.indexPorSetor); //Listar todos os pedidos por area e por restaurante
routes.patch('/pedido/:id', authMiddleware, PedidoController.update); //atualizar pedido (ex: status)
routes.delete('/pedido/:id', authMiddleware, PedidoController.delete); //deletar pedido


routes.post('/itempedido', authMiddleware, ItemPedidoController.register); //criar item de pedido
routes.get('/itempedido/pedido/:id', authMiddleware, ItemPedidoController.index); //listar todos os itens de pedido
routes.get('/itempedido/:id', authMiddleware, ItemPedidoController.findByID); //buscar item por ID  
routes.patch('/itempedido/:id', authMiddleware, ItemPedidoController.update); //atualizar item
routes.delete('/itempedido/:id', authMiddleware, ItemPedidoController.delete); //deletar item

routes.post('/modificador', authMiddleware, ItemPedidoModificadorController.register); //criar modificador de item
routes.get('/modificador', authMiddleware, ItemPedidoModificadorController.index); //listar todos
routes.get('/modificador/:id', authMiddleware, ItemPedidoModificadorController.findByID); //buscar por ID
routes.put('/modificador/:id', authMiddleware, ItemPedidoModificadorController.update); //atualizar modificador
routes.delete('/modificador/:id', authMiddleware, ItemPedidoModificadorController.delete); //deletar modificador
  

//export routes;
module.exports = {routes};


//const { Router } = require('express');
//const SearchController = require('./controllers/SearchController');
//const authMiddleware = require('./middlewares/auth');

//const routes = Router();
//const Authroutes = Router();
//Authroutes.use(authMiddleware);

//routes.get('/users', UserController.index);
//routes.post('/register', UserController.register);
//routes.post('/authenticate', UserController.Authenticate);
//routes.post('/userinf', req = authMiddleware, UserController.userinf);


//module.exports = {routes, Authroutes};
