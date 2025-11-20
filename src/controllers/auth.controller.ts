import { Request, Response } from 'express';
import { UserRepository } from '../repositories/user.repository';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

/**
 * @description Controller responsável por lidar com o Login e geração de JWT.
 */
export class AuthController {
  private userRepository: UserRepository;

  constructor(repository?: UserRepository) {
    this.userRepository = repository || new UserRepository();
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

      const user = await User.findByEmailWithPassword(this.userRepository, email);

      if (!user) {
        res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
        return;
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
        return;
      }

      const payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

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

        res.status(201).json({ 
            success: true, 
            message: 'Usuário registrado com sucesso.', 
            data: { id: newUser.id, name: newUser.name, email: newUser.email } 
        });

    } catch (error: any) {
        console.error('Erro no registro:', error);
        if (error.code === '23505') {
            res.status(400).json({ success: false, message: 'Este email já está em uso.' });
            return;
        }
        res.status(500).json({ success: false, message: 'Erro interno ao registrar usuário.' });
    }
  }
}