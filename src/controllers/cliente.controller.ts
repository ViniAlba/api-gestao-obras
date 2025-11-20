import { Request, Response } from 'express';
import { ClienteRepository } from '../repositories/cliente.repository';
import { Cliente } from '../models/cliente.model';

/**
 * @description Controller responsável por lidar com todas as operações CRUD 
 * para a entidade Cliente.
 */
export class ClienteController {
  private clienteRepository: ClienteRepository;

  constructor(repository?: ClienteRepository) {
    this.clienteRepository = repository || new ClienteRepository();
  }

  /**
   * @description Cria um novo Cliente.
   * Rota: POST /clientes
   */
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const clienteData = req.body;
      
      if (!clienteData.nome || !clienteData.endereco || !clienteData.telefone || !clienteData.cpfCnpj || !clienteData.rgIe) {
        res.status(400).json({ success: false, message: 'Dados incompletos. Todos os campos são obrigatórios.' });
        return;
      }

      const novoCliente = this.clienteRepository.create(clienteData as Cliente);
      await this.clienteRepository.save(novoCliente);

      res.status(201).json({ success: true, data: novoCliente });
      
    } catch (error: any) {
      console.error('Erro ao criar cliente:', error);
      if (error.code === '23505') { 
        res.status(400).json({ success: false, message: 'CPF/CNPJ já cadastrado.' });
        return;
      }
      res.status(500).json({ success: false, message: 'Erro interno ao processar a criação.' });
    }
  }

  /**
   * @description Lista todos os Clientes (com paginação).
   * Rota: GET /clientes 
   */
  public async findAll(req: Request, res: Response): Promise<void> {
    try {
      const pagina = parseInt(req.query.pagina as string) || 1;
      const limite = Math.min(parseInt(req.query.limite as string) || 10, 100);
      const skip = (pagina - 1) * limite;

      const [clientes, total] = await this.clienteRepository.findAndCount({
        take: limite,
        skip: skip,
      });

      res.status(200).json({ 
        success: true, 
        data: clientes,
        meta: {
            total,
            paginaAtual: pagina,
            limite,
            totalPaginas: Math.ceil(total / limite)
        }
      });
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      res.status(500).json({ success: false, message: 'Erro interno ao listar clientes.' });
    }
  }

  /**
   * @description Busca um Cliente pelo ID.
   * Rota: GET /clientes/:id
   */
  public async findOne(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'ID inválido.' });
        return;
      }

      const cliente = await Cliente.findById(this.clienteRepository, id);

      if (!cliente) {
        res.status(404).json({ success: false, message: 'Cliente não encontrado.' });
        return;
      }

      res.status(200).json({ success: true, data: cliente });
      
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      res.status(500).json({ success: false, message: 'Erro interno ao buscar cliente.' });
    }
  }

  /**
   * @description Atualiza um Cliente existente.
   * Rota: PUT /clientes/:id
   */
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'ID inválido.' });
        return;
      }
      
      const clienteData = req.body;
      const cliente = await Cliente.findById(this.clienteRepository, id);

      if (!cliente) {
        res.status(404).json({ success: false, message: `Cliente com ID ${id} não encontrado para atualização.` });
        return;
      }

      this.clienteRepository.merge(cliente, clienteData);
      const clienteAtualizado = await this.clienteRepository.save(cliente);

      res.status(200).json({ success: true, data: clienteAtualizado });
      
    } catch (error: any) {
      console.error('Erro ao atualizar cliente:', error);
      if (error.code === '23505') { 
        res.status(400).json({ success: false, message: 'CPF/CNPJ já cadastrado em outro cliente.' });
        return;
      }
      res.status(500).json({ success: false, message: 'Erro interno ao processar a atualização.' });
    }
  }

  /**
   * @description Exclui um Cliente.
   * Rota: DELETE /clientes/:id
   */
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'ID inválido.' });
        return;
      }

      const deleteResult = await this.clienteRepository.delete(id);

      if (deleteResult.affected === 0) {
        res.status(404).json({ success: false, message: `Cliente com ID ${id} não encontrado para exclusão.` });
        return;
      }

      res.status(204).send();
      
    } catch (error: any) {
      console.error('Erro ao excluir cliente:', error);
      
      const errorCode = error.code || (error.driverError && error.driverError.code);

      if (errorCode === '23503' || errorCode === '23001') {
        res.status(400).json({ success: false, message: 'Não é possível excluir: O cliente está associado a uma ou mais obras.' });
        return;
      }
      
      res.status(500).json({ success: false, message: 'Erro interno ao processar a exclusão.' });
    }
  }
}