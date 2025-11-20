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

  /**
   * @description Encontra um trabalhador pelo ID (idEmpregado).
   * @param id O ID único do trabalhador.
   * @returns Uma promessa que resolve para a Trabalhador ou null.
   */
  public async findById(id: number): Promise<Trabalhador | null> {
    return this.findOne({ where: { idEmpregado: id } });
  }

  /**
   * @description Encontra trabalhadores, com suporte a paginação e filtro por Gerente.
   * @param options Opções de busca do TypeORM (incluindo skip e take).
   * @param idGerente Opcional. Filtra por trabalhadores que reportam a este gerente.
   * @returns Uma promessa que resolve para uma tupla [Trabalhadores, Total].
   */
  public async findAndCountWithFilters(
    options: FindManyOptions<Trabalhador>,
    idGerente?: number
  ): Promise<[Trabalhador[], number]> {
    
    // Adicionar a condição WHERE para filtrar por idGerente
    const where: any = options.where || {};
    if (idGerente) {
      where.idGerente = idGerente;
    }
    options.where = where;

    return this.findAndCount(options);
  }
}