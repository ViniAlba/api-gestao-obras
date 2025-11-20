import { Router } from 'express';
import { EngenheiroController } from '../controllers/engenheiro.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const engenheiroRouter = Router();
const engenheiroController = new EngenheiroController();

/**
 * @description Rotas para a entidade Engenheiro.
 * Todos os endpoints implementam CRUD completo e são protegidos por JWT.
 */

// Aplicar o middleware de autenticação a TODAS as rotas de engenheiros
engenheiroRouter.use(authMiddleware);

// POST /api/v1/engenheiros
// Cria um novo engenheiro [cite: 34]
engenheiroRouter.post('/', (req, res) => engenheiroController.create(req, res));

// GET /api/v1/engenheiros
// Lista todos os engenheiros [cite: 34]
engenheiroRouter.get('/', (req, res) => engenheiroController.findAll(req, res));

// GET /api/v1/engenheiros/:id
// Busca um engenheiro específico pelo ID [cite: 34]
engenheiroRouter.get('/:id', (req, res) => engenheiroController.findOne(req, res));

// PUT /api/v1/engenheiros/:id
// Atualiza um engenheiro existente [cite: 34]
engenheiroRouter.put('/:id', (req, res) => engenheiroController.update(req, res));

// DELETE /api/v1/engenheiros/:id
// Exclui um engenheiro [cite: 34]
engenheiroRouter.delete('/:id', (req, res) => engenheiroController.delete(req, res));


export default engenheiroRouter;