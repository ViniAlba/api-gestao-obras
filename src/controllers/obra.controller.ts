import { Request, Response } from 'express';
import { ObraRepository } from '../repositories/obra.repository';
import { AppDataSource } from '../datasource';
import { Obra } from '../models/obra.model';
import { ClienteRepository } from '../repositories/cliente.repository';
import { EngenheiroRepository } from '../repositories/engenheiro.repository';

/**
 * @description Controller responsável por lidar com todas as operações CRUD 
 * para a entidade Obra.
 */
export class ObraController {
  private obraRepository: ObraRepository;
  private clienteRepository: ClienteRepository;
  private engenheiroRepository: EngenheiroRepository;

  constructor() {
    this.obraRepository = new ObraRepository();
    this.clienteRepository = new ClienteRepository();
    this.engenheiroRepository = new EngenheiroRepository();
  }

  /**
   * @description Cria uma nova Obra.
   * Rota: POST /obras
   */
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const obraData = req.body;
      
      // Validação básica de campos obrigatórios (incluindo FKs)
      if (!obraData.idCliente || !obraData.idEngenheiro || !obraData.tipoobra || !obraData.enderecoobra || !obraData.dataInicio || !obraData.prevTermino || !obraData.valorTotal || !obraData.status) {
        res.status(400).json({ success: false, message: 'Dados incompletos. idCliente, idEngenheiro e dados da obra são obrigatórios.' });
        return;
      }
      
      // Validação das Chaves Estrangeiras (FKs)
  const clienteExiste = await this.clienteRepository.findById(obraData.idCliente);
  const engenheiroExiste = await this.engenheiroRepository.findById(obraData.idEngenheiro);

      if (!clienteExiste) {
          res.status(400).json({ success: false, message: `Cliente com ID ${obraData.idCliente} não encontrado.` });
          return;
      }
      if (!engenheiroExiste) {
          res.status(400).json({ success: false, message: `Engenheiro com ID ${obraData.idEngenheiro} não encontrado.` });
          return;
      }

      const novaObra = this.obraRepository.create(obraData as Obra);
      await this.obraRepository.save(novaObra);

      // Retorna 201 Created
      res.status(201).json({ success: true, data: novaObra });
      
    } catch (error: any) {
      console.error('Erro ao criar obra:', error);
      res.status(500).json({ success: false, message: 'Erro interno ao processar a criação.' });
    }
  }

  /**
   * @description Lista todas as Obras (com paginação e filtros).
   * Rota: GET /obras
   */
  public async findAll(req: Request, res: Response): Promise<void> {
    try {
      // Parâmetros de Query (Query Params)
      const pagina = parseInt(req.query.pagina as string) || 1;
      const limite = Math.min(parseInt(req.query.limite as string) || 10, 100);
      const status = req.query.status as string | undefined; // Filtro de status 
      const idCliente = Number(req.query.idCliente) || undefined; // Filtro de cliente 
      const skip = (pagina - 1) * limite;

      const [obras, total] = await this.obraRepository.findAndCountWithFilters({
        take: limite,
        skip: skip,
      }, status, idCliente);

      res.status(200).json({ 
        success: true, 
        data: obras,
        meta: {
            total,
            paginaAtual: pagina,
            limite,
            totalPaginas: Math.ceil(total / limite)
        }
      });
    } catch (error) {
      console.error('Erro ao listar obras:', error);
      res.status(500).json({ success: false, message: 'Erro interno ao listar obras.' });
    }
  }

  /**
   * @description Busca uma Obra pelo ID.
   * Rota: GET /obras/:id
   */
  public async findOne(req: Request, res: Response): Promise<void> {
    try {
  const id = Number(req.params.id);
  const obra = await Obra.findById(this.obraRepository, id);

      if (!obra) {
        res.status(404).json({ success: false, message: 'Obra não encontrada.' });
        return;
      }

      res.status(200).json({ success: true, data: obra });
      
    } catch (error) {
      console.error('Erro ao buscar obra:', error);
      res.status(500).json({ success: false, message: 'Erro interno ao buscar obra.' });
    }
  }

  /**
   * @description Atualiza uma Obra existente.
   * Rota: PUT /obras/:id
   */
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const obraData = req.body;

      const obra = await this.obraRepository.findById(id);

      if (!obra) {
        res.status(404).json({ success: false, message: `Obra com ID ${id} não encontrada para atualização.` });
        return;
      }

      // Validação das FKs (se idCliente ou idEngenheiro foram passados para atualização)
      if (obraData.idCliente && !(await this.clienteRepository.findById(obraData.idCliente))) {
          res.status(400).json({ success: false, message: `Cliente com ID ${obraData.idCliente} não encontrado.` });
          return;
      }
      if (obraData.idEngenheiro && !(await this.engenheiroRepository.findById(obraData.idEngenheiro))) {
          res.status(400).json({ success: false, message: `Engenheiro com ID ${obraData.idEngenheiro} não encontrado.` });
          return;
      }

      this.obraRepository.merge(obra, obraData);
      const obraAtualizada = await this.obraRepository.save(obra);

      res.status(200).json({ success: true, data: obraAtualizada });
      
    } catch (error: any) {
      console.error('Erro ao atualizar obra:', error);
      res.status(500).json({ success: false, message: 'Erro interno ao processar a atualização.' });
    }
  }

  /**
   * @description Exclui uma Obra.
   * Rota: DELETE /obras/:id
   */
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;

      const deleteResult = await this.obraRepository.delete(id);

      if (deleteResult.affected === 0) {
        res.status(404).json({ success: false, message: `Obra com ID ${id} não encontrada para exclusão.` });
        return;
      }

      // 204 No Content
      res.status(204).send();
      
    } catch (error: any) {
      console.error('Erro ao excluir obra:', error);
      res.status(500).json({ success: false, message: 'Erro interno ao processar a exclusão.' });
    }
  }
}