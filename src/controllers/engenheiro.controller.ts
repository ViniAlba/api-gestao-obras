import { Request, Response } from 'express';
import { EngenheiroRepository } from '../repositories/engenheiro.repository';
import { AppDataSource } from '../datasource';
import { Engenheiro } from '../models/engenheiro.model';

/**
 * @description Controller responsável por lidar com todas as operações CRUD 
 * para a entidade Engenheiro.
 */
export class EngenheiroController {
  private engenheiroRepository: EngenheiroRepository;

  constructor() {
  this.engenheiroRepository = new EngenheiroRepository;
  }

  /**
   * @description Cria um novo Engenheiro.
   * Rota: POST /engenheiros
   */
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const engenheiroData = req.body;
      
      // Validação básica de campos obrigatórios [cite: 239]
      if (!engenheiroData.nome || !engenheiroData.telefone || !engenheiroData.endereco || !engenheiroData.crea) {
        res.status(400).json({ success: false, message: 'Dados incompletos. Nome, telefone, endereço e CREA são obrigatórios.' });
        return;
      }

      const novoEngenheiro = this.engenheiroRepository.create(engenheiroData as Engenheiro);
      await this.engenheiroRepository.save(novoEngenheiro);

      // Retorna 201 Created [cite: 251]
      res.status(201).json({ success: true, data: novoEngenheiro });
      
    } catch (error: any) {
      console.error('Erro ao criar engenheiro:', error);
      // Lidar com erro de duplicidade (CREA)
      if (error.code === '23505') { 
        res.status(400).json({ success: false, message: 'Número CREA já cadastrado.' });
        return;
      }
      res.status(500).json({ success: false, message: 'Erro interno ao processar a criação.' });
    }
  }

  /**
   * @description Lista todos os Engenheiros (com paginação).
   * Rota: GET /engenheiros [cite: 34]
   */
  public async findAll(req: Request, res: Response): Promise<void> {
    try {
      // Implementando a paginação conforme a documentação [cite: 185]
      const pagina = parseInt(req.query.pagina as string) || 1;
      const limite = Math.min(parseInt(req.query.limite as string) || 10, 100); // Máx. 100 [cite: 185]
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
   * Rota: GET /engenheiros/:id [cite: 34]
   */
  public async findOne(req: Request, res: Response): Promise<void> {
    try {
  const id = Number(req.params.id);
  const engenheiro = await Engenheiro.findById(this.engenheiroRepository, id);

      if (!engenheiro) {
        // Status 404 Not Found conforme a documentação [cite: 232]
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
   * Rota: PUT /engenheiros/:id [cite: 34]
   */
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
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
      // Lidar com erro de duplicidade (CREA)
      if (error.code === '23505') { 
        res.status(400).json({ success: false, message: 'Número CREA já cadastrado em outro engenheiro.' });
        return;
      }
      res.status(500).json({ success: false, message: 'Erro interno ao processar a atualização.' });
    }
  }

  /**
   * @description Exclui um Engenheiro.
   * Rota: DELETE /engenheiros/:id [cite: 34]
   */
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;

      const deleteResult = await this.engenheiroRepository.delete(id);

      if (deleteResult.affected === 0) {
        res.status(404).json({ success: false, message: `Engenheiro com ID ${id} não encontrado para exclusão.` });
        return;
      }

      // 204 No Content: Sucesso, sem corpo de resposta [cite: 297]
      res.status(204).send();
      
    } catch (error: any) {
      console.error('Erro ao excluir engenheiro:', error);
      // Se houver uma Obra ligada a este engenheiro, o DB impede a exclusão
      if (error.code === '23503') { 
        res.status(400).json({ success: false, message: 'Não é possível excluir: O engenheiro está associado a uma ou mais obras.' });
        return;
      }
      res.status(500).json({ success: false, message: 'Erro interno ao processar a exclusão.' });
    }
  }
}