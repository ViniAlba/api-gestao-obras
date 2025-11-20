import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cliente } from './cliente.model'; // Importamos as entidades relacionadas
import { Engenheiro } from './engenheiro.model'; 
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
 * @description Entidade Obra (Mapeia para a tabela 'obras').
 * Representa os projetos de obra, com relações obrigatórias a Cliente e Engenheiro.
 */
@Entity('obras')
export class Obra {
  @PrimaryGeneratedColumn('increment')
  idObra!: number;

  // --- Relacionamento Cliente (Obrigatório) ---
  
  /**
   * @description ID do cliente contratante (Foreign Key).
   */
  @Column({ type: 'int' })
  idCliente!: number;

  @ManyToOne(() => Cliente, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idCliente' }) // Coluna que armazena a FK
  cliente!: Cliente;

  // --- Relacionamento Engenheiro (Obrigatório) ---
  
  /**
   * @description ID do engenheiro responsável (Foreign Key).
   */
  @Column({ type: 'int' })
  idEngenheiro!: number;

  @ManyToOne(() => Engenheiro, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idEngenheiro' }) // Coluna que armazena a FK
  engenheiro!: Engenheiro;


  // --- Outras Colunas ---

  @Column({ type: 'varchar', length: 100 })
  tipoobra!: string; // Ex: residencial, comercial, industrial [cite: 50]

  @Column({ type: 'varchar', length: 300 })
  enderecoobra!: string; // Endereço onde a obra será realizada [cite: 50]

  @Column({ type: 'date' })
  dataInicio!: Date; // Data de inicio da obra (ISO 8601) [cite: 50]

  @Column({ type: 'date' })
  prevTermino!: Date; // Previsão de término (ISO 8601) [cite: 50]

  @Column('decimal', { precision: 12, scale: 2 })
  valorTotal!: number; // Valor total da obra [cite: 50]

  @Column({ type: 'varchar', length: 100 })
  formaPagamento!: string; // Forma de pagamento acordada [cite: 51]

  @Column({ type: 'varchar', length: 50 })
  status!: string; // Ex: planejamento, execução, concluída [cite: 51]

  @Column('simple-array', { nullable: true })
  alvarasLicencas!: string[] | null; // Lista de alvarás e licenças [cite: 51]

  @Column({ type: 'varchar', length: 100, nullable: true })
  contrato!: string | null; // Referência ao documento de contrato [cite: 51]

  @CreateDateColumn({ type: 'timestamp with time zone', transformer: dateTransformer })
  criadoEm!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', transformer: dateTransformer })
  atualizadoEm!: Date;

  /**
   * Busca uma obra pelo ID, incluindo cliente e engenheiro.
   */
  static async findById(repository: Repository<Obra>, id: number): Promise<Obra | null> {
    return repository.findOne({
      where: { idObra: id },
      relations: ['cliente', 'engenheiro']
    });
  }

  /**
   * Busca obras com filtros de status e cliente, e paginação.
   */
  static async findAndCountWithFilters(
    repository: Repository<Obra>,
    options: import('typeorm').FindManyOptions<Obra>,
    status?: string,
    idCliente?: number
  ): Promise<[Obra[], number]> {
    const where: any = options.where || {};
    if (status) where.status = status;
    if (idCliente) where.idCliente = idCliente;
    options.where = where;
    return repository.findAndCount(options);
  }
}