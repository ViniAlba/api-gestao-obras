import { Router } from 'express';
import { EngenheiroController } from '../controllers/engenheiro.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const engenheiroRouter = Router();
const engenheiroController = new EngenheiroController();

/**
 * @description Rotas para a entidade Engenheiro.
 * Todos os endpoints implementam CRUD completo e são protegidos por JWT.
 */

engenheiroRouter.use(authMiddleware);

engenheiroRouter.post('/', (req, res) => engenheiroController.create(req, res));

engenheiroRouter.get('/', (req, res) => engenheiroController.findAll(req, res));

engenheiroRouter.get('/:id', (req, res) => engenheiroController.findOne(req, res));

engenheiroRouter.put('/:id', (req, res) => engenheiroController.update(req, res));

engenheiroRouter.delete('/:id', (req, res) => engenheiroController.delete(req, res));


export default engenheiroRouter;