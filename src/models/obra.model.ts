import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cliente } from './cliente.model';
import { Engenheiro } from './engenheiro.model'; 
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
 * @description Entidade Obra (Mapeia para a tabela 'obras').
 */
@Entity('obras')
export class Obra {
  @PrimaryGeneratedColumn('increment')
  idObra!: number;
  
  /**
   * @description ID do cliente contratante (FK Numérica).
   */
  @Column({ type: 'int' })
  idCliente!: number;

  @ManyToOne(() => Cliente, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idCliente' })
  cliente!: Cliente;
  
  /**
   * @description ID do engenheiro responsável (FK Numérica).
   */
  @Column({ type: 'int' })
  idEngenheiro!: number;

  @ManyToOne(() => Engenheiro, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idEngenheiro' })
  engenheiro!: Engenheiro;

  @Column({ type: 'varchar', length: 100 })
  tipoobra!: string;

  @Column({ type: 'varchar', length: 300 })
  enderecoobra!: string;

  @Column({ type: 'date' })
  dataInicio!: Date;

  @Column({ type: 'date' })
  prevTermino!: Date;

  @Column('decimal', { precision: 12, scale: 2 })
  valorTotal!: number;

  @Column({ type: 'varchar', length: 100 })
  formaPagamento!: string;

  @Column({ type: 'varchar', length: 50 })
  status!: string;

  @Column('simple-array', { nullable: true })
  alvarasLicencas!: string[] | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  contrato!: string | null;

  @CreateDateColumn({ type: 'timestamp with time zone', transformer: dateTransformer })
  criadoEm!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', transformer: dateTransformer })
  atualizadoEm!: Date;

  /**
   * Busca uma obra pelo ID, incluindo relações.
   */
  static async findById(repository: Repository<Obra>, id: number): Promise<Obra | null> {
    return repository.findOne({
      where: { idObra: id },
      relations: ['cliente', 'engenheiro']
    });
  }
}