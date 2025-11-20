import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Repository, FindManyOptions } from 'typeorm';

const dateTransformer = {
  to: (value: Date | null) => value,
  from: (value: Date | string | null) => {
    if (!value) return null;
    const date = new Date(value);
    return date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  },
};

/**
 * @description Entidade Trabalhador (Mapeia para a tabela 'trabalhadores').
 */
@Entity('trabalhadores')
export class Trabalhador {
  /**
   * @description Identificador único (Primary Key - Incremental).
   */
  @PrimaryGeneratedColumn('increment')
  idEmpregado!: number;

  /**
   * @description ID do gerente (FK Numérica - Auto-relacionamento).
   */
  @Column({ type: 'int', nullable: true })
  idGerente!: number | null;

  @ManyToOne(() => Trabalhador, (trabalhador) => trabalhador.subordinados, { 
    nullable: true,
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'idGerente' })
  gerente!: Trabalhador | null;
  
  @OneToMany(() => Trabalhador, (trabalhador) => trabalhador.gerente)
  subordinados!: Trabalhador[];

  @Column({ type: 'varchar', length: 255 })
  nome!: string;

  @Column({ type: 'varchar', length: 30, unique: true })
  cpfCnpj!: string;

  @Column({ type: 'varchar', length: 30 })
  rgie!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  salario!: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  ctps!: string;

  @Column({ type: 'varchar', length: 100 })
  funcao!: string;

  @CreateDateColumn({ type: 'timestamp with time zone', transformer: dateTransformer})
  criadoEm!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', transformer: dateTransformer })
  atualizadoEm!: Date;

  /**
   * Busca um trabalhador pelo ID.
   */
  static async findById(repository: Repository<Trabalhador>, id: number): Promise<Trabalhador | null> {
    return repository.findOne({ where: { idEmpregado: id } });
  }
}