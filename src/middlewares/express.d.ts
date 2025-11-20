// src/types/express.d.ts
import { Request } from 'express';

// Reutilizamos a interface do payload definida no middleware
import { JwtPayload } from '../middlewares/auth.middleware';

// Estendemos o namespace global do Express
declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload; // Adicionamos a propriedade 'user' opcional ao Request
    }
  }
}