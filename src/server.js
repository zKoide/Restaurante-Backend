const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { routes } = require("./routes");
const { default: Axios } = require("axios");

const app = express();

// 🧩 Corrige erro de BigInt no JSON
BigInt.prototype.toJSON = function () {
  return this.toString();
};

// 🔧 Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🚀 Cria servidor HTTP e vincula ao Socket.IO
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // ou coloque o endereço do seu frontend ex: "http://localhost:3000"
    methods: ["GET", "POST", "PATCH"],
  },
});

// 💬 Quando um cliente se conectar
io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado:", socket.id);
  });
});

// 🔌 Disponibiliza o io para uso em controladores e rotas
app.set("io", io);

// ⚙️ Rotas da aplicação
app.use(routes);

// 🟢 Inicializa o servidor
const PORT = 3333;
server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

/*const express = require('express');
const http = require("http");
const {routes} = require('./routes');
const { Server } = require("socket.io");
const cors = require('cors');
const { default: Axios } = require('axios');

const app = express();
// Corrige erro de BigInt no JSON
BigInt.prototype.toJSON = function () {
  return this.toString();
};
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(routes);


const server = http.createServer(app);


server.listen(3333);*/