import { AppDataSource } from '../datasource';
import { Empreiteira } from '../models/empreiteira.model';
import { Repository } from 'typeorm';

/**
 * @description Repositório para a entidade Empreiteira.
 */
export class EmpreiteiraRepository extends Repository<Empreiteira> {
  constructor() {
    super(Empreiteira, AppDataSource.manager);
  }

  public async findById(id: number): Promise<Empreiteira | null> {
    return this.findOne({ where: { idEmp: id } });
  }
}