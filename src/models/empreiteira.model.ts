import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
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
 * @description Entidade Empreiteira (Mapeia para a tabela 'empreiteiras' no banco de dados).
 * Representa as empresas empreiteiras cadastradas no sistema[cite: 23].
 */
@Entity('empreiteiras')
export class Empreiteira {
  /**
   * @description Identificador único da empreiteira (Primary Key).
   * O 'uuid' garante que o ID é uma string única.
   */
  @PrimaryGeneratedColumn('increment')
  idEmp!: number;

  /**
   * @description CNPJ ou CPF da empreiteira.
   * Usamos `unique: true` para garantir que não haja duplicatas.
   */
  @Column({ type: 'varchar', length: 30, unique: true })
  cnpjCpf!: string; // Obrigatório [cite: 26]

  /**
   * @description Nome completo da empreiteira.
   */
  @Column({ type: 'varchar', length: 255 })
  nome!: string; // Obrigatório [cite: 26]

  /**
   * @description Telefone de contato.
   */
  @Column({ type: 'varchar', length: 20 })
  telefone!: string; // Obrigatório [cite: 26]

  /**
   * @description Email para contato.
   * Também definido como único.
   */
  @Column({ type: 'varchar', length: 100, unique: true })
  email!: string; // Obrigatório [cite: 26]

  /**
   * @description Data de fundação (ISO 8601).
   * Tipo 'date' para armazenar apenas a data.
   */
  @Column({ type: 'date', nullable: true })
  fundacao!: Date | null; // Não obrigatório [cite: 26]

  /**
   * @description Lista de licenças e alvarás.
   * O TypeORM armazena 'simple-array' como texto, separando os itens.
   */
  @Column('simple-array', { nullable: true })
  licencas!: string[] | null; // Não obrigatório [cite: 26]

  /**
   * @description Data e hora de criação (ISO 8601). Gerada automaticamente.
   */
  @CreateDateColumn({ type: 'timestamp with time zone',
    transformer: dateTransformer })
  criadoEm!: Date; // Não obrigatório [cite: 26]

  /**
   * @description Data e hora da última atualização (ISO 8601). Gerada automaticamente.
   */
  @UpdateDateColumn({ type: 'timestamp with time zone',
    transformer: dateTransformer })
  atualizadoEm!: Date; // Não obrigatório [cite: 26]

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