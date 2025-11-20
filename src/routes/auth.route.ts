import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller'; 

const authRouter = Router();
const authController = new AuthController(); // Instância do controller

/**
 * @description Rota de Autenticação.
 * Endpoint para um usuário (ou sistema) obter um JSON Web Token (JWT) válido.
 */

authRouter.post('/login', (req, res) => authController.login(req, res));

authRouter.post('/register', (req, res) => authController.register(req, res));

export default authRouter;