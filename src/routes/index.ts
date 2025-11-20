import { Router } from 'express';
import authRouter from '../routes/auth.route';
import empreiteiraRouter from '../routes/empreiteira.route';
import engenheiroRouter from '../routes/engenheiro.route';
import trabalhadorRouter from '../routes/trabalhador.route';
import clienteRouter from '../routes/cliente.route'; 
import obraRouter from '../routes/obra.route';

export const router = Router();

// 1. Rota de Autenticação
router.use('/auth', authRouter);

// 2. Rotas de Recursos
router.use('/empreiteiras', empreiteiraRouter);
router.use('/engenheiros', engenheiroRouter);
router.use('/trabalhadores', trabalhadorRouter);
router.use('/clientes', clienteRouter); 
router.use('/obras', obraRouter);