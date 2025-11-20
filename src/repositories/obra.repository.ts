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

  /**
   * @description Encontra uma obra pelo ID (idObra).
   * @param id O ID único da obra.
   * @returns Uma promessa que resolve para a Obra ou null.
   */
  public async findById(id: number): Promise<Obra | null> {
    // Incluir as relações para ver os detalhes do cliente e engenheiro
    return this.findOne({ 
        where: { idObra: id },
        relations: ['cliente', 'engenheiro']
    });
  }

  /**
   * @description Encontra obras, com suporte a paginação e filtros por Status e Cliente.
   * @param options Opções de busca do TypeORM (incluindo skip e take).
   * @param status Opcional. Filtra por status (planejamento, execução, concluída).
   * @param idCliente Opcional. Filtra por ID do cliente.
   * @returns Uma promessa que resolve para uma tupla [Obras, Total].
   */
  public async findAndCountWithFilters(
    options: FindManyOptions<Obra>,
    status?: string,
    idCliente?: number
  ): Promise<[Obra[], number]> {
    
    // Configuração básica de filtros WHERE
    const where: any = options.where || {};
    
    if (status) {
      where.status = status;
    }
    if (idCliente) {
      where.idCliente = idCliente;
    }
    options.where = where;
    
    // Relações obrigatórias para a listagem
    options.relations = ['cliente', 'engenheiro'];

    return this.findAndCount(options);
  }
}