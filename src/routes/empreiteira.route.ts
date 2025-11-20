import { Router } from 'express';
import { EmpreiteiraController } from '../controllers/empreiteira.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const empreiteiraRouter = Router();
const empreiteiraController = new EmpreiteiraController();

/**
 * @description Rotas para a entidade Empreiteira.
 * Todas as rotas abaixo estão sujeitas ao middleware de autenticação (JWT).
 */

empreiteiraRouter.use(authMiddleware);

empreiteiraRouter.post('/', (req, res) => empreiteiraController.create(req, res));

empreiteiraRouter.get('/', (req, res) => empreiteiraController.findAll(req, res));

empreiteiraRouter.get('/:id', (req, res) => empreiteiraController.findOne(req, res));

empreiteiraRouter.put('/:id', (req, res) => empreiteiraController.update(req, res));

empreiteiraRouter.delete('/:id', (req, res) => empreiteiraController.delete(req, res));


export default empreiteiraRouter;