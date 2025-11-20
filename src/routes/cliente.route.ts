import { Router } from 'express';
import { ClienteController } from '../controllers/cliente.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const clienteRouter = Router();
const clienteController = new ClienteController();

/**
 * @description Rotas para a entidade Cliente.
 */

// Aplicar o middleware de autenticação a TODAS as rotas
clienteRouter.use(authMiddleware);

// POST /api/v1/clientes
// Cria um novo cliente
clienteRouter.post('/', (req, res) => clienteController.create(req, res));

// GET /api/v1/clientes
// Lista todos os clientes
clienteRouter.get('/', (req, res) => clienteController.findAll(req, res));

// GET /api/v1/clientes/:id
// Busca um cliente específico pelo ID
clienteRouter.get('/:id', (req, res) => clienteController.findOne(req, res));

// PUT /api/v1/clientes/:id
// Atualiza um cliente existente
clienteRouter.put('/:id', (req, res) => clienteController.update(req, res));

// DELETE /api/v1/clientes/:id
// Exclui um cliente
clienteRouter.delete('/:id', (req, res) => clienteController.delete(req, res));


export default clienteRouter;