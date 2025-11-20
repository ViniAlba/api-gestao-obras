import { Router } from 'express';
import { TrabalhadorController } from '../controllers/trabalhador.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const trabalhadorRouter = Router();
const trabalhadorController = new TrabalhadorController();

/**
 * @description Rotas para a entidade Trabalhador.
 */

// Aplicar o middleware de autenticação a TODAS as rotas
trabalhadorRouter.use(authMiddleware);

// POST /api/v1/trabalhadores
// Cria um novo trabalhador
trabalhadorRouter.post('/', (req, res) => trabalhadorController.create(req, res));

// GET /api/v1/trabalhadores
// Lista todos os trabalhadores (com suporte a filtro por idGerente)
trabalhadorRouter.get('/', (req, res) => trabalhadorController.findAll(req, res));

// GET /api/v1/trabalhadores/:id
// Busca um trabalhador específico pelo ID
trabalhadorRouter.get('/:id', (req, res) => trabalhadorController.findOne(req, res));

// PUT /api/v1/trabalhadores/:id
// Atualiza um trabalhador existente
trabalhadorRouter.put('/:id', (req, res) => trabalhadorController.update(req, res));

// DELETE /api/v1/trabalhadores/:id
// Exclui um trabalhador
trabalhadorRouter.delete('/:id', (req, res) => trabalhadorController.delete(req, res));


export default trabalhadorRouter;