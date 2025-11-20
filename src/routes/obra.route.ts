import { Router } from 'express';
import { ObraController } from '../controllers/obra.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const obraRouter = Router();
const obraController = new ObraController();

/**
 * @description Rotas para a entidade Obra.
 */

obraRouter.use(authMiddleware);

obraRouter.post('/', (req, res) => obraController.create(req, res));

obraRouter.get('/', (req, res) => obraController.findAll(req, res));

obraRouter.get('/:id', (req, res) => obraController.findOne(req, res));

obraRouter.put('/:id', (req, res) => obraController.update(req, res));

obraRouter.delete('/:id', (req, res) => obraController.delete(req, res));


export default obraRouter;