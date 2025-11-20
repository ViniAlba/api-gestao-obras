import { AppDataSource } from '../datasource';
import { Obra } from '../models/obra.model';
import { Repository, FindManyOptions } from 'typeorm';

/**
 * @description Repositório para a entidade Obra.
 */
export class ObraRepository extends Repository<Obra> {
  constructor() {
    super(Obra, AppDataSource.manager);
  }

  public async findById(id: number): Promise<Obra | null> {
    return this.findOne({ 
        where: { idObra: id },
        relations: ['cliente', 'engenheiro']
    });
  }

  public async findAndCountWithFilters(
    options: FindManyOptions<Obra>,
    status?: string,
    idCliente?: number
  ): Promise<[Obra[], number]> {
    
    const where: any = options.where || {};
    
    if (status) where.status = status;
    if (idCliente) where.idCliente = idCliente;
    
    options.where = where;
    options.relations = ['cliente', 'engenheiro'];

    return this.findAndCount(options);
  }
}