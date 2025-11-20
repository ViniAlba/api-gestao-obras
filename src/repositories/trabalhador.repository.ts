import { AppDataSource } from '../datasource';
import { Trabalhador } from '../models/trabalhador.model';
import { Repository, FindManyOptions } from 'typeorm';

/**
 * @description Repositório para a entidade Trabalhador.
 */
export class TrabalhadorRepository extends Repository<Trabalhador> {
  constructor() {
    super(Trabalhador, AppDataSource.manager);
  }

  public async findById(id: number): Promise<Trabalhador | null> {
    return this.findOne({ where: { idEmpregado: id } });
  }

  public async findAndCountWithFilters(
    options: FindManyOptions<Trabalhador>,
    idGerente?: number
  ): Promise<[Trabalhador[], number]> {

    const where: any = options.where || {};
    if (idGerente) {
      where.idGerente = idGerente;
    }
    options.where = where;

    return this.findAndCount(options);
  }
}