import { Request, Response } from 'express';
import { EmpreiteiraRepository } from '../repositories/empreiteira.repository';
import { Empreiteira } from '../models/empreiteira.model';

/**
 * @description Controller responsável por lidar com todas as operações CRUD 
 * para a entidade Empreiteira.
 */
export class EmpreiteiraController {
  private empreiteiraRepository: EmpreiteiraRepository;

  constructor(repository?: EmpreiteiraRepository) {
    this.empreiteiraRepository = repository || new EmpreiteiraRepository();
  }

  /**
   * @description Cria uma nova Empreiteira.
   * Rota: POST /empreiteiras
   */
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const empreiteiraData = req.body;
      
      if (!empreiteiraData.cnpjCpf || !empreiteiraData.nome || !empreiteiraData.email) {
        res.status(400).json({ success: false, message: 'Dados incompletos. CNPJ/CPF, nome e email são obrigatórios.' });
        return;
      }

      const novaEmpreiteira = this.empreiteiraRepository.create(empreiteiraData as Empreiteira);
      await this.empreiteiraRepository.save(novaEmpreiteira);

      res.status(201).json({ success: true, data: novaEmpreiteira });
      
    } catch (error: any) {
      console.error('Erro ao criar empreiteira:', error);
      if (error.code === '23505') { 
        res.status(400).json({ success: false, message: 'CNPJ/CPF ou Email já cadastrado.' });
        return;
      }
      res.status(500).json({ success: false, message: 'Erro interno ao processar a criação.' });
    }
  }

  /**
   * @description Lista todas as Empreiteiras.
   * Rota: GET /empreiteiras
   */
  public async findAll(req: Request, res: Response): Promise<void> {
    try {
      const empreiteiras = await this.empreiteiraRepository.find();
      res.status(200).json({ success: true, data: empreiteiras });
    } catch (error) {
      console.error('Erro ao listar empreiteiras:', error);
      res.status(500).json({ success: false, message: 'Erro interno ao listar empreiteiras.' });
    }
  }

  /**
   * @description Busca uma Empreiteira pelo ID.
   * Rota: GET /empreiteiras/:id
   */
  public async findOne(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'ID inválido.' });
        return;
      }

      const empreiteira = await Empreiteira.findById(this.empreiteiraRepository, id);

      if (!empreiteira) {
        res.status(404).json({ success: false, message: `Empreiteira com ID ${id} não encontrada.` });
        return;
      }

      res.status(200).json({ success: true, data: empreiteira });
      
    } catch (error) {
      console.error('Erro ao buscar empreiteira:', error);
      res.status(500).json({ success: false, message: 'Erro interno ao buscar empreiteira.' });
    }
  }

  /**
   * @description Atualiza uma Empreiteira existente.
   * Rota: PUT /empreiteiras/:id
   */
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'ID inválido.' });
        return;
      }

      const empreiteiraData = req.body;
      const empreiteira = await this.empreiteiraRepository.findById(id);

      if (!empreiteira) {
        res.status(404).json({ success: false, message: `Empreiteira com ID ${id} não encontrada para atualização.` });
        return;
      }

      this.empreiteiraRepository.merge(empreiteira, empreiteiraData);
      const empreiteiraAtualizada = await this.empreiteiraRepository.save(empreiteira);

      res.status(200).json({ success: true, data: empreiteiraAtualizada });
      
    } catch (error: any) {
      console.error('Erro ao atualizar empreiteira:', error);
       if (error.code === '23505') { 
        res.status(400).json({ success: false, message: 'CNPJ/CPF ou Email já cadastrado em outra empreiteira.' });
        return;
      }
      res.status(500).json({ success: false, message: 'Erro interno ao processar a atualização.' });
    }
  }

  /**
   * @description Exclui uma Empreiteira.
   * Rota: DELETE /empreiteiras/:id
   */
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'ID inválido.' });
        return;
      }

      const deleteResult = await this.empreiteiraRepository.delete(id);

      if (deleteResult.affected === 0) {
        res.status(404).json({ success: false, message: `Empreiteira com ID ${id} não encontrada para exclusão.` });
        return;
      }

      res.status(204).send();
      
    } catch (error: any) {
      console.error('Erro ao excluir empreiteira:', error);
      
      const errorCode = error.code || (error.driverError && error.driverError.code);

      if (errorCode === '23503' || errorCode === '23001') {
        res.status(400).json({ success: false, message: 'Não é possível excluir: A empreiteira está associada a uma ou mais obras.' });
        return;
      }
      
      res.status(500).json({ success: false, message: 'Erro interno ao processar a exclusão.' });
    }
  }
}