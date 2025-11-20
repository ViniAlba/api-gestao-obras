import { AppDataSource } from '../datasource';
import { Engenheiro } from '../models/engenheiro.model';
import { Repository } from 'typeorm';

/**
 * @description Repositório para a entidade Engenheiro.
 */
export class EngenheiroRepository extends Repository<Engenheiro> {
  constructor() {
    super(Engenheiro, AppDataSource.manager);
  }

  public async findById(id: number): Promise<Engenheiro | null> {
    return this.findOne({ where: { idEngenheiro: id } });
  }
}