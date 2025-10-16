//import { prisma } from "../prisma";
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

module.exports = {

    //CREATE
    async register(req, res) {
        try {
            const { nome, unidade, ativo } = req.body;
            const restauranteId = req.RestUser

            const ingrediente = await prisma.ingrediente.create({
              data: { restauranteId, nome, unidade, ativo }
            });
            res.json(ingrediente);
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
    },
    //READ - lista todos
    async index(req,res){
        try {
            const ingredientes = await prisma.ingrediente.findMany({
              orderBy: {id: 'asc'}
            });
            res.json(ingredientes);
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
    },
    // READ - busca por id
    async findByID(req, res){
        try {
            const ingrediente = await prisma.ingrediente.findUnique({
              where: { id: BigInt(req.params.id) }
            });
            if (!ingrediente) return res.status(404).json({ error: "Ingrediente não encontrado" });
            res.json(ingrediente);
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
    },
    // UPDATE
    async update(req,res){
        try {
            const { nome, unidade, ativo } = req.body;
            const ingrediente = await prisma.ingrediente.update({
              where: { id: BigInt(req.params.id) },
              data: { nome, unidade, ativo }
            });
            res.json(ingrediente);
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
    },
    // DELETE (soft delete → só desativa)
    async delete(req,res){
        try {
            const ingrediente = await prisma.ingrediente.update({
              where: { id: BigInt(req.params.id) },
              data: { ativo: false }
            });
            res.json({ message: "Ingrediente desativado", ingrediente });
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
    },
}