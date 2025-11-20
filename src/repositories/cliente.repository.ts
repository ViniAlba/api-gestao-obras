import { AppDataSource } from '../datasource';
import { Cliente } from '../models/cliente.model';
import { Repository } from 'typeorm';

/**
 * @description Repositório para a entidade Cliente.
 */
export class ClienteRepository extends Repository<Cliente> {
  constructor() {
    super(Cliente, AppDataSource.manager);
  }

  /**
   * @description Encontra um cliente pelo ID (idCliente).
   * @param id O ID único do cliente.
   * @returns Uma promessa que resolve para a Cliente ou null.
   */
  public async findById(id: number): Promise<Cliente | null> {
    return this.findOne({ where: { idCliente: id } });
  }
}