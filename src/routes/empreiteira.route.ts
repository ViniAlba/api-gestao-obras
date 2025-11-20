import { Router } from 'express';
import { EmpreiteiraController } from '../controllers/empreiteira.controller';
import { authMiddleware } from '../middlewares/auth.middleware'; // Importamos o nosso middleware de JWT

const empreiteiraRouter = Router();
const empreiteiraController = new EmpreiteiraController();

/**
 * @description Rotas para a entidade Empreiteira.
 * Todas as rotas abaixo estão sujeitas ao middleware de autenticação (JWT).
 */

// Aplicar o middleware de autenticação a TODAS as rotas de empreiteiras
// Apenas requisições com um JWT válido poderão acessar estas rotas.
empreiteiraRouter.use(authMiddleware);

// POST /api/v1/empreiteiras
// Cria uma nova empreiteira
empreiteiraRouter.post('/', (req, res) => empreiteiraController.create(req, res));

// GET /api/v1/empreiteiras
// Lista todas as empreiteiras
empreiteiraRouter.get('/', (req, res) => empreiteiraController.findAll(req, res));

// GET /api/v1/empreiteiras/:id
// Busca uma empreiteira específica pelo ID
empreiteiraRouter.get('/:id', (req, res) => empreiteiraController.findOne(req, res));

// PUT /api/v1/empreiteiras/:id
// Atualiza uma empreiteira existente
empreiteiraRouter.put('/:id', (req, res) => empreiteiraController.update(req, res));

// DELETE /api/v1/empreiteiras/:id
// Exclui uma empreiteira
empreiteiraRouter.delete('/:id', (req, res) => empreiteiraController.delete(req, res));


export default empreiteiraRouter;