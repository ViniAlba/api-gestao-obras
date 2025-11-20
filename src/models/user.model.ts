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

// Transformador para formatar a data ao ler do banco
const dateTransformer = {
  to: (value: Date | null) => value, // Na hora de salvar, manda a data normal
  from: (value: Date | string | null) => { // Na hora de ler, formata
    if (!value) return null;
    const date = new Date(value);
    // Formata para pt-BR no fuso de SP
    return date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  },
};

/**
 * @description Entidade User (Mapeia para a tabela 'users').
 * Representa os usuários com acesso ao sistema da API.
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  /**
   * @description Nome completo do usuário.
   */
  @Column({ type: 'varchar', length: 255 })
  name!: string;

  /**
   * @description Email do usuário. Único para login.
   */
  @Column({ type: 'varchar', length: 100, unique: true })
  email!: string;

  /**
   * @description Senha do usuário (armazenada como hash).
   */
  @Column({ type: 'varchar', length: 255, select: false }) // 'select: false' impede que a senha seja retornada em consultas padrão
  password!: string;

  /**
   * @description Tipo de permissão/função do usuário.
   * Útil para Autorização (controle de acesso a endpoints).
   */
  @Column({ type: 'varchar', length: 50, default: 'viewer' })
  role!: string;

  @CreateDateColumn({ type: 'timestamp with time zone', transformer: dateTransformer })
  criadoEm!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', transformer: dateTransformer })
  atualizadoEm!: Date;

  // --- Funções de Hook TypeORM ---

  /**
   * @description Hook TypeORM que garante que a senha será hasheada 
   * antes de ser inserida (POST) no banco de dados.
   */
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  /**
   * @description Método auxiliar para comparar a senha fornecida com o hash salvo.
   * @param password Senha em texto simples fornecida no login.
   * @returns Verdadeiro se as senhas coincidirem.
   */
  public async comparePassword(password: string): Promise<boolean> {
    // Nota: 'this.password' deve ser buscada com `{ select: ['password'] }`
    return bcrypt.compare(password, this.password);
  }

  /**
   * @description Busca usuário por email, incluindo o campo de senha (necessário para login).
   * @param repository Repository<User> do TypeORM
   * @param email Email do usuário
   */
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