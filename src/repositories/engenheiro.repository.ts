import { AppDataSource } from '../datasource';
import { Engenheiro } from '../models/engenheiro.model';
import { Repository } from 'typeorm';

/**
 * @description Repositório para a entidade Engenheiro.
 * Estende o repositório base do TypeORM, permitindo métodos personalizados.
 */
export class EngenheiroRepository extends Repository<Engenheiro> {
  constructor() {
    super(Engenheiro, AppDataSource.manager);
  }

  /**
   * @description Encontra um engenheiro pelo ID (idEngenheiro).
   * @param id O ID único do engenheiro.
   * @returns Uma promessa que resolve para a Engenheiro ou null.
   */
  public async findById(id: number): Promise<Engenheiro | null> {
    return this.findOne({ where: { idEngenheiro: id } });
  }

  /**
   * @description Encontra um engenheiro pelo número CREA.
   * @param crea O número de registro CREA.
   * @returns Uma promessa que resolve para o Engenheiro ou null.
   */
  public async findByCrea(crea: string): Promise<Engenheiro | null> {
    return this.findOne({ where: { crea } });
  }
}