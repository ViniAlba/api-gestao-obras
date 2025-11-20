import { Request, Response } from 'express';
import { EmpreiteiraRepository } from '../repositories/empreiteira.repository';
import { AppDataSource } from '../datasource';
import { Empreiteira } from '../models/empreiteira.model';

/**
 * @description Controller responsável por lidar com todas as operações CRUD 
 * para a entidade Empreiteira.
 */
export class EmpreiteiraController {
  // Instância do repositório, facilitando o acesso aos métodos de DB
  private empreiteiraRepository: EmpreiteiraRepository;

  constructor() {
  // É uma boa prática inicializar o repositório TypeORM na classe
    this.empreiteiraRepository = new EmpreiteiraRepository();
  }

  /**
   * @description Cria uma nova Empreiteira.
   * Rota: POST /empreiteiras
   */
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const empreiteiraData = req.body;
      
      // Validação básica de campos obrigatórios
      if (!empreiteiraData.cnpjCpf || !empreiteiraData.nome || !empreiteiraData.email) {
        res.status(400).json({ success: false, message: 'Dados incompletos. CNPJ/CPF, nome e email são obrigatórios.' });
        return;
      }

      // Cria a instância da entidade e popula com os dados
      const novaEmpreiteira = this.empreiteiraRepository.create(empreiteiraData as Empreiteira);
      
      // Salva a entidade no banco de dados
      await this.empreiteiraRepository.save(novaEmpreiteira);

      // Retorna 201 Created com o recurso criado
      res.status(201).json({ success: true, data: novaEmpreiteira });
      
    } catch (error: any) {
      console.error('Erro ao criar empreiteira:', error);
      // Lidar com erro de duplicidade (ex: CNPJ/CPF ou email já existe)
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
      const empreiteiraData = req.body;

      // 1. Verificar se a empreiteira existe
      const empreiteira = await this.empreiteiraRepository.findById(id);

      if (!empreiteira) {
        res.status(404).json({ success: false, message: `Empreiteira com ID ${id} não encontrada para atualização.` });
        return;
      }

      // 2. Atualizar o objeto e salvar. O método `merge` do TypeORM ajuda nisso.
      this.empreiteiraRepository.merge(empreiteira, empreiteiraData);
      const empreiteiraAtualizada = await this.empreiteiraRepository.save(empreiteira);

      res.status(200).json({ success: true, data: empreiteiraAtualizada });
      
    } catch (error: any) {
      console.error('Erro ao atualizar empreiteira:', error);
      // Lidar com erro de duplicidade
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
      const id = req.params.id;

      // O TypeORM retorna um objeto com 'affected: 1' se a linha for deletada
      const deleteResult = await this.empreiteiraRepository.delete(id);

      if (deleteResult.affected === 0) {
        res.status(404).json({ success: false, message: `Empreiteira com ID ${id} não encontrada para exclusão.` });
        return;
      }

      // 204 No Content: Sucesso, mas não há corpo de resposta
      res.status(204).send();
      
    } catch (error: any) {
      console.error('Erro ao excluir empreiteira:', error);
      // Lidar com erro de restrição de chave estrangeira (se a empreiteira estiver ligada a uma Obra)
      if (error.code === '23503') {
        res.status(400).json({ success: false, message: 'Não é possível excluir: A empreiteira está associada a uma ou mais obras.' });
        return;
      }
      res.status(500).json({ success: false, message: 'Erro interno ao processar a exclusão.' });
    }
  }
}