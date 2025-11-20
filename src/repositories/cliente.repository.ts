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

  public async findById(id: number): Promise<Cliente | null> {
    return this.findOne({ where: { idCliente: id } });
  }
}