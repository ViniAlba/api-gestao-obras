import { Router } from 'express';
import { ClienteController } from '../controllers/cliente.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const clienteRouter = Router();
const clienteController = new ClienteController();

/**
 * @description Rotas para a entidade Cliente.
 */

clienteRouter.use(authMiddleware);

clienteRouter.post('/', (req, res) => clienteController.create(req, res));

clienteRouter.get('/', (req, res) => clienteController.findAll(req, res));

clienteRouter.get('/:id', (req, res) => clienteController.findOne(req, res));

clienteRouter.put('/:id', (req, res) => clienteController.update(req, res));

clienteRouter.delete('/:id', (req, res) => clienteController.delete(req, res));


export default clienteRouter;