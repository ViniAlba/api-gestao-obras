import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Obra } from './obra.model';
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
 * @description Entidade Cliente (Mapeia para a tabela 'clientes').
 * Representa os clientes que contratam as empreiteiras.
 */
@Entity('clientes')
export class Cliente {
  /**
   * @description Identificador único do cliente (Primary Key - Incremental).
   */
  @PrimaryGeneratedColumn('increment')
  idCliente!: number;

  /**
   * @description Nome completo ou razão social.
   */
  @Column({ type: 'varchar', length: 255 })
  nome!: string;

  /**
   * @description Endereço do cliente.
   */
  @Column({ type: 'varchar', length: 300 })
  endereco!: string;

  /**
   * @description Telefone de contato.
   */
  @Column({ type: 'varchar', length: 20 })
  telefone!: string;

  /**
   * @description CPF ou CNPJ do cliente. Único.
   */
  @Column({ type: 'varchar', length: 30, unique: true })
  cpfCnpj!: string;

  /**
   * @description RG ou Inscrição Estadual.
   */
  @Column({ type: 'varchar', length: 30 })
  rgIe!: string;

  @OneToMany(() => Obra, (obra) => obra.cliente)
  obras!: Obra[];

  /**
   * @description Data e hora de criação (ISO 8601).
   */
  @CreateDateColumn({ type: 'timestamp with time zone', transformer: dateTransformer })
  criadoEm!: Date;

  /**
   * @description Data e hora da última atualização (ISO 8601).
   */
  @UpdateDateColumn({ type: 'timestamp with time zone', transformer: dateTransformer })
  atualizadoEm!: Date;

  /**
   * Busca um cliente pelo ID.
   */
  static async findById(repository: Repository<Cliente>, id: number): Promise<Cliente | null> {
    return repository.findOne({ where: { idCliente: id } });
  }
}