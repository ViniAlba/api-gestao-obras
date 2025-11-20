import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { Obra } from './obra.model';
import { Repository } from 'typeorm';
import { Mock } from 'node:test';

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



// No próximo passo, vamos importar Obra. Por enquanto, a importação é comentada.
// import { Obra } from './obra.model'; 

/**
 * @description Entidade Cliente (Mapeia para a tabela 'clientes').
 * Representa os clientes que contratam as empreiteiras.
 */
@Entity('clientes')
export class Cliente {
  /**
   * @description Identificador único do cliente (Primary Key).
   */
  @PrimaryGeneratedColumn('increment')
  idCliente!: number;

  /**
   * @description Nome completo ou razão social.
   */
  @Column({ type: 'varchar', length: 255 })
  nome!: string; // Obrigatório 

  /**
   * @description Endereço do cliente.
   */
  @Column({ type: 'varchar', length: 300 })
  endereco!: string; // Obrigatório 

  /**
   * @description Telefone de contato.
   */
  @Column({ type: 'varchar', length: 20 })
  telefone!: string; // Obrigatório 

  /**
   * @description CPF ou CNPJ do cliente.
   * Único para garantir a não duplicação.
   */
  @Column({ type: 'varchar', length: 30, unique: true })
  cpfCnpj!: string; // Obrigatório 

  /**
   * @description RG ou Inscrição Estadual.
   */
  @Column({ type: 'varchar', length: 30 })
  rgIe!: string; // Obrigatório 

  // Um Cliente pode ter Múltiplas Obras
  @OneToMany(() => Obra, (obra) => obra.cliente)
  obras!: Obra[];

  /**
   * @description Data e hora de criação (ISO 8601).
   */
  @CreateDateColumn({ type: 'timestamp with time zone',
    transformer: dateTransformer })
  criadoEm!: Date;

  /**
   * @description Data e hora da última atualização (ISO 8601).
   */
  @UpdateDateColumn({ type: 'timestamp with time zone',
    transformer: dateTransformer })
  atualizadoEm!: Date;
  static findOneBy: any;
  static save: any;
  static update: any;
  static delete: any;
  /**
   * Busca um cliente pelo ID.
   */
  static async findById(repository: Repository<Cliente>, id: number): Promise<Cliente | null> {
    return repository.findOne({ where: { idCliente: id } });
  }
}