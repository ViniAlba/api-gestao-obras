import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';

const dateTransformer = {
  to: (value: Date | null) => value,
  from: (value: Date | string | null) => {
    if (!value) return null;
    const date = new Date(value);
    return date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  },
};

/**
 * @description Entidade User (Mapeia para a tabela 'users').
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password!: string;

  @Column({ type: 'varchar', length: 50, default: 'viewer' })
  role!: string;

  @CreateDateColumn({ type: 'timestamp with time zone', transformer: dateTransformer })
  criadoEm!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', transformer: dateTransformer })
  atualizadoEm!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  public async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  static async findByEmailWithPassword(
    repository: Repository<User>,
    email: string
  ): Promise<User | undefined> {
    return (await repository.createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne()) || undefined;
  }
}