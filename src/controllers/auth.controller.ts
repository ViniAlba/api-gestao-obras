import { Request, Response } from 'express';
import { UserRepository } from '../repositories/user.repository';
import { AppDataSource } from '../datasource';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

// Garantir que a chave secreta JWT está carregada
const JWT_SECRET = process.env.JWT_SECRET || 'uma-chave-padrao-se-nao-estiver-no-env'; 

/**
 * @description Controller responsável por lidar com o Login e geração de JWT.
 */
export class AuthController {
  private userRepository;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }
  /**
   * @description Endpoint de login. Valida credenciais e emite um JWT.
   * Rota: POST /auth/login
   */
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email e senha são obrigatórios.' });
        return;
      }

      // 1. Buscar o usuário (incluindo a senha hash)
      const user = await User.findByEmailWithPassword(this.userRepository, email);

      if (!user) {
        // Mensagem genérica por segurança (para não revelar se o email existe)
        res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
        return;
      }

      // 2. Comparar a senha fornecida com o hash salvo
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
        return;
      }

      // 3. Geração do Payload JWT (o que será guardado no token)
      const payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      // 4. Criação do Token (expira em 1 dia, por exemplo)
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

      // 5. Resposta de sucesso
      res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso.',
        token: token,
        userData: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
      });
      
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ success: false, message: 'Erro interno do servidor durante a autenticação.' });
    }
  }

  /**
   * @description Endpoint para registro de novos usuários.
   * Rota: POST /auth/register
   */
  public async register(req: Request, res: Response): Promise<void> {
    try {
        const userData = req.body;
        
        if (!userData.email || !userData.password || !userData.name) {
             res.status(400).json({ success: false, message: 'Nome, email e senha são obrigatórios para o registro.' });
             return;
        }

        const newUser = this.userRepository.create(userData as User);
        await this.userRepository.save(newUser);

        // Retorna 201 Created
        res.status(201).json({ 
            success: true, 
            message: 'Usuário registrado com sucesso.', 
            data: { id: newUser.id, name: newUser.name, email: newUser.email } 
        });

    } catch (error: any) {
        console.error('Erro no registro:', error);
        if (error.code === '23505') { // Erro de duplicidade
            res.status(400).json({ success: false, message: 'Este email já está em uso.' });
            return;
        }
        res.status(500).json({ success: false, message: 'Erro interno ao registrar usuário.' });
    }
  }
}