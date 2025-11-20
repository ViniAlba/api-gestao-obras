import { Request, Response } from 'express';
import { TrabalhadorRepository } from '../repositories/trabalhador.repository';
import { AppDataSource } from '../datasource';
import { Trabalhador } from '../models/trabalhador.model';

/**
 * @description Controller responsável por lidar com todas as operações CRUD 
 * para a entidade Trabalhador.
 */
export class TrabalhadorController {
  private trabalhadorRepository: TrabalhadorRepository;

  constructor() {
  this.trabalhadorRepository = new TrabalhadorRepository();
  }

  /**
   * @description Cria um novo Trabalhador.
   * Rota: POST /trabalhadores
   */
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const trabalhadorData = req.body;
      
      // Validação básica de campos obrigatórios
      if (!trabalhadorData.nome || !trabalhadorData.cpfCnpj || !trabalhadorData.salario || !trabalhadorData.ctps || !trabalhadorData.funcao) {
        res.status(400).json({ success: false, message: 'Dados incompletos. Nome, CPF/CNPJ, Salário, CTPS e Função são obrigatórios.' });
        return;
      }

      const novoTrabalhador = this.trabalhadorRepository.create(trabalhadorData as Trabalhador);
      await this.trabalhadorRepository.save(novoTrabalhador);

      // Retorna 201 Created
      res.status(201).json({ success: true, data: novoTrabalhador });
      
    } catch (error: any) {
      console.error('Erro ao criar trabalhador:', error);
      // Lidar com erro de duplicidade (CPF/CNPJ, CTPS)
      if (error.code === '23505') { 
        res.status(400).json({ success: false, message: 'CPF/CNPJ ou CTPS já cadastrado.' });
        return;
      }
      res.status(500).json({ success: false, message: 'Erro interno ao processar a criação.' });
    }
  }

  /**
   * @description Lista todos os Trabalhadores (com paginação e filtro por gerente).
   * Rota: GET /trabalhadores
   */
  public async findAll(req: Request, res: Response): Promise<void> {
    try {
      // Parâmetros de Query (Query Params)
      const pagina = parseInt(req.query.pagina as string) || 1;
      const limite = Math.min(parseInt(req.query.limite as string) || 10, 100);
      const idGerente = Number(req.query.idGerente) || undefined;

      const [trabalhadores, total] = await this.trabalhadorRepository.findAndCountWithFilters({
        take: limite,
        //skip: skip,
        // Carregar a relação 'gerente' para mostrar quem é o gerente de cada um
        relations: ['gerente']
      }, idGerente);

      res.status(200).json({ 
        success: true, 
        data: trabalhadores.map(t => ({
          ...t,
          // Mapeia o objeto gerente para mostrar apenas o ID (ou null)
          idGerente: t.gerente ? t.gerente.idEmpregado : null 
        })),
        meta: {
            total,
            paginaAtual: pagina,
            limite,
            totalPaginas: Math.ceil(total / limite)
        }
      });
    } catch (error) {
      console.error('Erro ao listar trabalhadores:', error);
      res.status(500).json({ success: false, message: 'Erro interno ao listar trabalhadores.' });
    }
  }

  /**
   * @description Busca um Trabalhador pelo ID.
   * Rota: GET /trabalhadores/:id
   */
  public async findOne(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      // Busca o trabalhador e carrega o gerente
      const trabalhador = await Trabalhador.findById(this.trabalhadorRepository, id);

      if (!trabalhador) {
        res.status(404).json({ success: false, message: 'Trabalhador não encontrado.' });
        return;
      }

      // Retorna os dados, incluindo o idGerente para o padrão da API
      res.status(200).json({ 
        success: true, 
        data: {
          ...trabalhador,
          idGerente: trabalhador.gerente ? trabalhador.gerente.idEmpregado : null
        }
      });
      
    } catch (error) {
      console.error('Erro ao buscar trabalhador:', error);
      res.status(500).json({ success: false, message: 'Erro interno ao buscar trabalhador.' });
    }
  }

  /**
   * @description Atualiza um Trabalhador existente.
   * Rota: PUT /trabalhadores/:id
   */
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const trabalhadorData = req.body;

  const trabalhador = await Trabalhador.findById(this.trabalhadorRepository, id);

      if (!trabalhador) {
        res.status(404).json({ success: false, message: `Trabalhador com ID ${id} não encontrado para atualização.` });
        return;
      }

      this.trabalhadorRepository.merge(trabalhador, trabalhadorData);
      const trabalhadorAtualizado = await this.trabalhadorRepository.save(trabalhador);

      res.status(200).json({ success: true, data: trabalhadorAtualizado });
      
    } catch (error: any) {
      console.error('Erro ao atualizar trabalhador:', error);
      // Lidar com erro de duplicidade (CPF/CNPJ, CTPS)
      if (error.code === '23505') { 
        res.status(400).json({ success: false, message: 'CPF/CNPJ ou CTPS já cadastrado em outro trabalhador.' });
        return;
      }
      res.status(500).json({ success: false, message: 'Erro interno ao processar a atualização.' });
    }
  }

  /**
   * @description Exclui um Trabalhador.
   * Rota: DELETE /trabalhadores/:id
   */
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;

  const deleteResult = await this.trabalhadorRepository.delete(id);

      if (deleteResult.affected === 0) {
        res.status(404).json({ success: false, message: `Trabalhador com ID ${id} não encontrado para exclusão.` });
        return;
      }

      // 204 No Content
      res.status(204).send();
      
    } catch (error: any) {
      console.error('Erro ao excluir trabalhador:', error);
      // Se for gerente de outros, o 'onDelete: SET NULL' deve evitar o erro 23503, 
      // mas é bom ter um tratamento genérico para o 500.
      res.status(500).json({ success: false, message: 'Erro interno ao processar a exclusão.' });
    }
  }
}