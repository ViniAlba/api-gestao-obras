import { AppDataSource } from '../datasource';
import { User } from '../models/user.model';
import { Repository } from 'typeorm';

/**
 * @description Repositório para a entidade User.
 */
export class UserRepository extends Repository<User> {
  constructor() {
    super(User, AppDataSource.manager);
  }

  public async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password', 'role'], 
    });
  }

  public async findById(id: number): Promise<User | null> {
    return this.findOne({ where: { id } });
  }
}