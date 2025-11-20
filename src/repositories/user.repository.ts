import { AppDataSource } from '../datasource';
import { User } from '../models/user.model';
import { Repository } from 'typeorm';

/**
 * @description Repositório para a entidade User.
 * Adiciona métodos personalizados para busca de usuário, especialmente com a senha.
 */
export class UserRepository extends Repository<User> {
  constructor() {
    super(User, AppDataSource.manager);
  }

  /**
   * @description Busca um usuário pelo email, incluindo a coluna 'password'.
   * É necessário selecionar explicitamente o password, pois foi definido com `select: false` na Entity.
   * @param email Email do usuário.
   * @returns Uma promessa que resolve para o User (com password) ou null.
   */
  public async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password', 'role'], 
    });
  }

  /**
   * @description Encontra um usuário pelo ID.
   * @param id O ID único do usuário.
   * @returns Uma promessa que resolve para o User (sem password) ou null.
   */
  public async findById(id: number): Promise<User | null> {
    return this.findOne({ where: { id } });
  }
}