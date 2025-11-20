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
 * @description Entidade Trabalhador (Mapeia para a tabela 'trabalhadores').
 * Representa os funcionários da empreiteira, incluindo o auto-relacionamento com Gerente.
 */
@Entity('trabalhadores')
export class Trabalhador {
  /**
   * @description Identificador único do trabalhador (Primary Key).
   */
  @PrimaryGeneratedColumn('increment')
  idEmpregado!: number;

  /**
   * @description ID do gerente responsável (Chave Estrangeira - FK).
   */
  @Column({ type: 'int', nullable: true })
  idGerente!: number | null; // Não obrigatório

  /**
   * @description Relação de Muitos-para-Um (ManyToOne) com o Gerente (que é outro Trabalhador).
   * Define o lado do "empregado".
   */
  @ManyToOne(() => Trabalhador, (trabalhador) => trabalhador.subordinados, { 
    nullable: true, // Um trabalhador pode não ter gerente (é o Gerente principal)
    onDelete: 'SET NULL' // Se o Gerente for excluído, o idGerente do subordinado fica NULL
  })
  @JoinColumn({ name: 'idGerente' }) // Indica qual coluna armazena o FK
  gerente!: Trabalhador | null;
  
  /**
   * @description Relação de Um-para-Muitos (OneToMany) com os Subordinados.
   * Define o lado do "gerente". Carregado apenas quando solicitado.
   */
  @OneToMany(() => Trabalhador, (trabalhador) => trabalhador.gerente, { cascade: ['insert'] })
  subordinados!: Trabalhador[];


  // --- Outras Colunas ---

  @Column({ type: 'varchar', length: 255 })
  nome!: string; // Obrigatório

  @Column({ type: 'varchar', length: 30, unique: true })
  cpfCnpj!: string; // Obrigatório e Único

  @Column({ type: 'varchar', length: 30 })
  rgie!: string; // Obrigatório

  @Column('decimal', { precision: 10, scale: 2 })
  salario!: number; // Obrigatório

  @Column({ type: 'varchar', length: 50, unique: true })
  ctps!: string; // Obrigatório e Único

  @Column({ type: 'varchar', length: 100 })
  funcao!: string; // Obrigatório

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

  /**
   * Busca trabalhadores com filtro por gerente e paginação.
   */
  static async findAndCountWithFilters(
    repository: Repository<Trabalhador>,
    options: FindManyOptions<Trabalhador>,
    idGerente?: number
  ): Promise<[Trabalhador[], number]> {
    const where: any = options.where || {};
    if (idGerente) {
      where.idGerente = idGerente;
    }
    options.where = where;
    return repository.findAndCount(options);
  }
}