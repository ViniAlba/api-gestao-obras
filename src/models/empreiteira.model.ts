import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
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
 * @description Entidade Empreiteira (Mapeia para a tabela 'empreiteiras').
 * Representa as empresas empreiteiras cadastradas no sistema.
 */
@Entity('empreiteiras')
export class Empreiteira {
  /**
   * @description Identificador único da empreiteira (Primary Key - Incremental).
   */
  @PrimaryGeneratedColumn('increment')
  idEmp!: number;

  /**
   * @description CNPJ ou CPF da empreiteira. Único.
   */
  @Column({ type: 'varchar', length: 30, unique: true })
  cnpjCpf!: string;

  /**
   * @description Nome completo da empreiteira.
   */
  @Column({ type: 'varchar', length: 255 })
  nome!: string;

  /**
   * @description Telefone de contato.
   */
  @Column({ type: 'varchar', length: 20 })
  telefone!: string;

  /**
   * @description Email para contato. Único.
   */
  @Column({ type: 'varchar', length: 100, unique: true })
  email!: string;

  /**
   * @description Data de fundação.
   */
  @Column({ type: 'date', nullable: true })
  fundacao!: Date | null;

  /**
   * @description Lista de licenças e alvarás (array simples).
   */
  @Column('simple-array', { nullable: true })
  licencas!: string[] | null;

  /**
   * @description Data e hora de criação.
   */
  @CreateDateColumn({ type: 'timestamp with time zone', transformer: dateTransformer })
  criadoEm!: Date;

  /**
   * @description Data e hora da última atualização.
   */
  @UpdateDateColumn({ type: 'timestamp with time zone', transformer: dateTransformer })
  atualizadoEm!: Date;

  /**
   * Busca uma empreiteira pelo ID.
   */
  static async findById(
    repository: Repository<Empreiteira>,
    id: number
  ): Promise<Empreiteira | null> {
    return repository.findOne({ where: { idEmp: id } });
  }
}