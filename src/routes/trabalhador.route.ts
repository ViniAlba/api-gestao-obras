import { Router } from 'express';
import { TrabalhadorController } from '../controllers/trabalhador.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const trabalhadorRouter = Router();
const trabalhadorController = new TrabalhadorController();

/**
 * @description Rotas para a entidade Trabalhador.
 */

trabalhadorRouter.use(authMiddleware);

trabalhadorRouter.post('/', (req, res) => trabalhadorController.create(req, res));

trabalhadorRouter.get('/', (req, res) => trabalhadorController.findAll(req, res));

trabalhadorRouter.get('/:id', (req, res) => trabalhadorController.findOne(req, res));

trabalhadorRouter.put('/:id', (req, res) => trabalhadorController.update(req, res));

trabalhadorRouter.delete('/:id', (req, res) => trabalhadorController.delete(req, res));


export default trabalhadorRouter;