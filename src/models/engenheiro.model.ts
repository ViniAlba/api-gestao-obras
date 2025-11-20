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
 * @description Entidade Engenheiro (Mapeia para a tabela 'engenheiros').
 * Representa os engenheiros responsáveis técnicos pelas obras.
 */
@Entity('engenheiros')
export class Engenheiro {
  /**
   * @description Identificador único do engenheiro (Primary Key - Incremental).
   */
  @PrimaryGeneratedColumn('increment')
  idEngenheiro!: number;

  /**
   * @description Nome completo do engenheiro.
   */
  @Column({ type: 'varchar', length: 255 })
  nome!: string;

  /**
   * @description Telefone de contato.
   */
  @Column({ type: 'varchar', length: 20 })
  telefone!: string;

  /**
   * @description Endereço residencial.
   */
  @Column({ type: 'varchar', length: 300 })
  endereco!: string;

  /**
   * @description Número do registro CREA. Único.
   */
  @Column({ type: 'varchar', length: 50, unique: true })
  crea!: string;

  /**
   * @description Lista de certificações adicionais.
   */
  @Column('simple-array', { nullable: true })
  certificacoesAdicionais!: string[] | null;

  @OneToMany(() => Obra, (obra) => obra.engenheiro)
  obras!: Obra[];

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
   * Busca um engenheiro pelo ID.
   */
  static async findById(repository: Repository<Engenheiro>, id: number): Promise<Engenheiro | null> {
    return repository.findOne({ where: { idEngenheiro: id } });
  }
}