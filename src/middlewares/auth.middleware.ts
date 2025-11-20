import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Garante que a chave secreta JWT está carregada
const JWT_SECRET = process.env.JWT_SECRET;

// Interface para o payload do nosso token (o que estará dentro do token)
// Você pode adicionar mais dados aqui, como 'role' (função/cargo) do usuário
export interface JwtPayload { // Exportamos para poder usar em outros arquivos
  userId: string; // ou sub (subject) como é comum em JWT
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
  // 1. Verificar se a chave secreta está configurada
  if (!JWT_SECRET) {
    console.error('JWT_SECRET não está configurado.');
    // Em produção, isso deve ser 500
    return res.status(500).json({ success: false, message: 'Erro de configuração do servidor.' }); 
  }

  // 2. Obter o cabeçalho de autorização
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Acesso negado. Token não fornecido ou formato incorreto (Bearer <token>).' });
  }

  // 3. Extrair o token (removendo 'Bearer ')
  const token = authHeader.split(' ')[1];

  try {
    // 4. Verificar e decodificar o token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // 5. Anexar o payload do usuário à requisição (para uso nos controllers)
    // Isso é útil para saber quem está a fazer a requisição.
    req.user = decoded; 

    // 6. Prosseguir para o próximo middleware/controller
    next();

  } catch (error) {
    console.error('Erro de autenticação JWT:', error);
    // Se a verificação falhar (token expirado, inválido, etc.)
    return res.status(401).json({ success: false, message: 'Token inválido ou expirado.' });
  }
};