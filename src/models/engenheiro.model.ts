import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OneToMany } from 'typeorm';
import { Obra } from './obra.model'; // Adicione este import
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
 * @description Entidade Engenheiro (Mapeia para a tabela 'engenheiros').
 * Representa os engenheiros responsáveis técnicos pelas obras[cite: 30].
 */
@Entity('engenheiros')
export class Engenheiro {
  /**
   * @description Identificador único do engenheiro (Primary Key)[cite: 32].
   */
  @PrimaryGeneratedColumn('increment')
  idEngenheiro!: number;

  /**
   * @description Nome completo do engenheiro[cite: 32].
   */
  @Column({ type: 'varchar', length: 255 })
  nome!: string; // Obrigatório [cite: 32]

  /**
   * @description Telefone de contato[cite: 32].
   */
  @Column({ type: 'varchar', length: 20 })
  telefone!: string; // Obrigatório [cite: 32]

  /**
   * @description Endereço residencial[cite: 32].
   */
  @Column({ type: 'varchar', length: 300 })
  endereco!: string; // Obrigatório [cite: 32]

  /**
   * @description Número do registro CREA[cite: 32].
   * Garante que cada engenheiro tem um registro único.
   */
  @Column({ type: 'varchar', length: 50, unique: true })
  crea!: string; // Obrigatório [cite: 32]

  /**
   * @description Lista de certificações adicionais[cite: 32].
   */
  @Column('simple-array', { nullable: true })
  certificacoesAdicionais!: string[] | null; // Não obrigatório [cite: 32]

    // Um Engenheiro pode ser responsável por Múltiplas Obras
  @OneToMany(() => Obra, (obra) => obra.engenheiro)
  obras!: Obra[];

  /**
   * @description Data e hora de criação (ISO 8601)[cite: 32].
   */
  @CreateDateColumn({ type: 'timestamp with time zone',
    transformer: dateTransformer })
  criadoEm!: Date;

  /**
   * @description Data e hora da última atualização (ISO 8601)[cite: 32].
   */
  @UpdateDateColumn({ type: 'timestamp with time zone',
    transformer: dateTransformer })
  atualizadoEm!: Date;

  /**
   * Busca um engenheiro pelo ID.
   */
  static async findById(repository: Repository<Engenheiro>, id: number): Promise<Engenheiro | null> {
    return repository.findOne({ where: { idEngenheiro: id } });
  }

  /**
   * Busca um engenheiro pelo número CREA.
   */
  static async findByCrea(repository: Repository<Engenheiro>, crea: string): Promise<Engenheiro | null> {
    return repository.findOne({ where: { crea } });
  }
}