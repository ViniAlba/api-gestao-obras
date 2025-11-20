import { AppDataSource } from '../datasource';
import { Empreiteira } from '../models/empreiteira.model';
import { Repository } from 'typeorm';

/**
 * @description Repositório para a entidade Empreiteira.
 * Estende o repositório base do TypeORM, permitindo métodos personalizados
 * de acesso e manipulação de dados para Empreiteiras.
 */
export class EmpreiteiraRepository extends Repository<Empreiteira> {
  // O construtor garante que o repositório TypeORM base é inicializado
  constructor() {
    super(Empreiteira, AppDataSource.manager);
  }

  /**
   * @description Encontra uma empreiteira pelo ID.
   * @param id O ID único da empreiteira.
   * @returns Uma promessa que resolve para a Empreiteira ou null.
   */
  public async findById(id: number): Promise<Empreiteira | null> {
    return this.findOne({ where: { idEmp: id } });
  }

  // Você adicionará aqui métodos complexos como findByCNPJ, findWithActiveWorks, etc.
}