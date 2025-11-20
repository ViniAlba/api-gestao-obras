import { Request, Response } from 'express';
import { EngenheiroRepository } from '../repositories/engenheiro.repository';
import { Engenheiro } from '../models/engenheiro.model';

/**
 * @description Controller responsável por lidar com todas as operações CRUD 
 * para a entidade Engenheiro.
 */
export class EngenheiroController {
  private engenheiroRepository: EngenheiroRepository;

  constructor(repository?: EngenheiroRepository) {
    this.engenheiroRepository = repository || new EngenheiroRepository();
  }

  /**
   * @description Cria um novo Engenheiro.
   * Rota: POST /engenheiros
   */
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const engenheiroData = req.body;
      
      if (!engenheiroData.nome || !engenheiroData.telefone || !engenheiroData.endereco || !engenheiroData.crea) {
        res.status(400).json({ success: false, message: 'Dados incompletos. Nome, telefone, endereço e CREA são obrigatórios.' });
        return;
      }

      const novoEngenheiro = this.engenheiroRepository.create(engenheiroData as Engenheiro);
      await this.engenheiroRepository.save(novoEngenheiro);

      res.status(201).json({ success: true, data: novoEngenheiro });
      
    } catch (error: any) {
      console.error('Erro ao criar engenheiro:', error);
      if (error.code === '23505') { 
        res.status(400).json({ success: false, message: 'Número CREA já cadastrado.' });
        return;
      }
      res.status(500).json({ success: false, message: 'Erro interno ao processar a criação.' });
    }
  }

  /**
   * @description Lista todos os Engenheiros (com paginação).
   * Rota: GET /engenheiros
   */
  public async findAll(req: Request, res: Response): Promise<void> {
    try {
      const pagina = parseInt(req.query.pagina as string) || 1;
      const limite = Math.min(parseInt(req.query.limite as string) || 10, 100);
      const skip = (pagina - 1) * limite;

      const [engenheiros, total] = await this.engenheiroRepository.findAndCount({
        take: limite,
        skip: skip,
      });

      res.status(200).json({ 
        success: true, 
        data: engenheiros,
        meta: {
            total,
            paginaAtual: pagina,
            limite,
            totalPaginas: Math.ceil(total / limite)
        }
      });
    } catch (error) {
      console.error('Erro ao listar engenheiros:', error);
      res.status(500).json({ success: false, message: 'Erro interno ao listar engenheiros.' });
    }
  }

  /**
   * @description Busca um Engenheiro pelo ID.
   * Rota: GET /engenheiros/:id
   */
  public async findOne(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'ID inválido.' });
        return;
      }

      const engenheiro = await Engenheiro.findById(this.engenheiroRepository, id);

      if (!engenheiro) {
        res.status(404).json({ success: false, message: 'Engenheiro não encontrado.' });
        return;
      }

      res.status(200).json({ success: true, data: engenheiro });
      
    } catch (error) {
      console.error('Erro ao buscar engenheiro:', error);
      res.status(500).json({ success: false, message: 'Erro interno ao buscar engenheiro.' });
    }
  }

  /**
   * @description Atualiza um Engenheiro existente.
   * Rota: PUT /engenheiros/:id
   */
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'ID inválido.' });
        return;
      }

      const engenheiroData = req.body;
      const engenheiro = await Engenheiro.findById(this.engenheiroRepository, id);

      if (!engenheiro) {
        res.status(404).json({ success: false, message: `Engenheiro com ID ${id} não encontrado para atualização.` });
        return;
      }

      this.engenheiroRepository.merge(engenheiro, engenheiroData);
      const engenheiroAtualizado = await this.engenheiroRepository.save(engenheiro);

      res.status(200).json({ success: true, data: engenheiroAtualizado });
      
    } catch (error: any) {
      console.error('Erro ao atualizar engenheiro:', error);
      if (error.code === '23505') { 
        res.status(400).json({ success: false, message: 'Número CREA já cadastrado em outro engenheiro.' });
        return;
      }
      res.status(500).json({ success: false, message: 'Erro interno ao processar a atualização.' });
    }
  }

  /**
   * @description Exclui um Engenheiro.
   * Rota: DELETE /engenheiros/:id
   */
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'ID inválido.' });
        return;
      }

      const deleteResult = await this.engenheiroRepository.delete(id);

      if (deleteResult.affected === 0) {
        res.status(404).json({ success: false, message: `Engenheiro com ID ${id} não encontrado para exclusão.` });
        return;
      }

      res.status(204).send();
      
    } catch (error: any) {
      console.error('Erro ao excluir engenheiro:', error);
      
      const errorCode = error.code || (error.driverError && error.driverError.code);

      if (errorCode === '23503' || errorCode === '23001') {
        res.status(400).json({ success: false, message: 'Não é possível excluir: O engenheiro está associado a uma ou mais obras.' });
        return;
      }
      
      res.status(500).json({ success: false, message: 'Erro interno ao processar a exclusão.' });
    }
  }
}