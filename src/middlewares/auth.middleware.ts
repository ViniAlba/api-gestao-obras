import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export interface JwtPayload {
  userId: string;
  email: string; 
  role: string;
}

/**
 * @description Middleware de autenticação JWT.
 * * Verifica se um token válido foi fornecido no header 'Authorization' 
 * no formato 'Bearer <token>'.
 * * Se o token for válido, o payload é anexado ao objeto Request.
 * Se o token for inválido ou ausente, retorna 401 Unauthorized.
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!JWT_SECRET) {
    console.error('JWT_SECRET não está configurado.');
    return res.status(500).json({ success: false, message: 'Erro de configuração do servidor.' }); 
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Acesso negado. Token não fornecido ou formato incorreto (Bearer <token>).' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    req.user = decoded; 

    next();

  } catch (error) {
    console.error('Erro de autenticação JWT:', error);
    return res.status(401).json({ success: false, message: 'Token inválido ou expirado.' });
  }
};