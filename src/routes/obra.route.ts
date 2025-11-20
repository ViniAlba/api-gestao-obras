import { Router } from 'express';
import { ObraController } from '../controllers/obra.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const obraRouter = Router();
const obraController = new ObraController();

/**
 * @description Rotas para a entidade Obra.
 */

// Aplicar o middleware de autenticação a TODAS as rotas
obraRouter.use(authMiddleware);

// POST /api/v1/obras
// Cria uma nova obra
obraRouter.post('/', (req, res) => obraController.create(req, res));

// GET /api/v1/obras
// Lista todas as obras (com suporte a filtro por status e idCliente)
obraRouter.get('/', (req, res) => obraController.findAll(req, res));

// GET /api/v1/obras/:id
// Busca uma obra específica pelo ID
obraRouter.get('/:id', (req, res) => obraController.findOne(req, res));

// PUT /api/v1/obras/:id
// Atualiza uma obra existente
obraRouter.put('/:id', (req, res) => obraController.update(req, res));

// DELETE /api/v1/obras/:id
// Exclui uma obra
obraRouter.delete('/:id', (req, res) => obraController.delete(req, res));


export default obraRouter;