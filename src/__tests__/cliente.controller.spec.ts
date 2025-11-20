import { Request, Response } from 'express';
import { ClienteController } from '../controllers/cliente.controller'; // Caminho corrigido
import { Cliente } from '../models/cliente.model'; // Caminho corrigido

// Mockamos a dependência do modelo para isolar o controller.
// Não queremos que o teste acesse o banco de dados real.
jest.mock('../models/cliente.model'); // Caminho corrigido

describe('ClienteController', () => {
  let clienteController: ClienteController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  // O bloco beforeEach roda antes de cada teste ('it')
  beforeEach(() => {
    // Reiniciamos os mocks para garantir que cada teste seja independente
    clienteController = new ClienteController();

    // Criamos mocks para os objetos 'req' e 'res' do Express
    mockRequest = {
      params: {},
      body: {},
    };

    responseJson = jest.fn();
    responseStatus = jest.fn().mockReturnValue({ json: responseJson });
    mockResponse = {
      status: responseStatus,
      json: responseJson,
    };

    // Limpa os mocks de chamadas anteriores
    jest.clearAllMocks();
  });

  // Grupo de testes para o método findOne
  describe('findOne', () => {
    it('deve retornar um cliente e status 200 se o ID for válido', async () => {
      // Arrange (Organizar)
      const clienteId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
      const mockCliente = {
        idCliente: clienteId,
        nome: 'Cliente Teste',
        cpfCnpj: '123.456.789-00',
      };
      mockRequest.params = { id: clienteId };

      // Dizemos ao nosso mock do Cliente.findById para retornar o cliente falso
      (Cliente.findOneBy as jest.Mock).mockResolvedValue(mockCliente);

      // Act (Agir)
      await clienteController.findOne(mockRequest as Request, mockResponse as Response);

      // Assert (Verificar)
      expect(Cliente.findOneBy).toHaveBeenCalledWith({ idCliente: clienteId });
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockCliente,
      });
    });

    it('deve retornar um erro 404 se o cliente não for encontrado', async () => {
      // Arrange
      const clienteId = 'id-inexistente';
      mockRequest.params = { id: clienteId };

      // Configuramos o mock para simular que o cliente não foi encontrado (retorna null)
      (Cliente.findOneBy as jest.Mock).mockResolvedValue(null);

      // Act
      await clienteController.findOne(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(Cliente.findOneBy).toHaveBeenCalledWith({ idCliente: clienteId });
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        message: 'Cliente não encontrado.',
      });
    });
  });

  // Grupo de testes para o método create
  describe('create', () => {
    it('deve criar um novo cliente e retornar status 201', async () => {
      // Arrange
      const novoCliente = {
        nome: 'Novo Cliente',
        cpfCnpj: '987.654.321-00',
        endereco: 'Rua dos Testes, 123',
      };
      mockRequest.body = novoCliente;

      // Mock do método save do repositório
      (Cliente.save as jest.Mock).mockResolvedValue({ idCliente: 'novo-id', ...novoCliente });

      // Act
      await clienteController.create(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(Cliente.save).toHaveBeenCalledWith(expect.objectContaining(novoCliente));
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: { idCliente: 'novo-id', ...novoCliente },
        })
      );
    });

    it('deve retornar um erro 500 se a criação falhar', async () => {
      // Arrange
      const erro = new Error('Erro no banco de dados');
      mockRequest.body = { nome: 'Cliente Falho' };

      // Simula uma falha no banco de dados
      (Cliente.save as jest.Mock).mockRejectedValue(erro);

      // Act
      await clienteController.create(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        message: 'Erro ao criar cliente.',
        error: erro.message,
      });
    });
  });

  // Grupo de testes para o método update
  describe('update', () => {
    it('deve atualizar um cliente e retornar status 200', async () => {
      // Arrange
      const clienteId = 'id-existente';
      const dadosUpdate = { nome: 'Nome Atualizado' };
      mockRequest.params = { id: clienteId };
      mockRequest.body = dadosUpdate;

      // Mock para o update retornar um resultado positivo
      (Cliente.update as jest.Mock).mockResolvedValue({ affected: 1 });

      // Act
      await clienteController.update(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(Cliente.update).toHaveBeenCalledWith(clienteId, dadosUpdate);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        message: 'Cliente atualizado com sucesso.',
      });
    });

    it('deve retornar um erro 404 se o cliente a ser atualizado não for encontrado', async () => {
      // Arrange
      const clienteId = 'id-inexistente';
      mockRequest.params = { id: clienteId };
      mockRequest.body = { nome: 'Nome Fantasma' };

      // Simula que nenhuma linha foi afetada no update
      (Cliente.update as jest.Mock).mockResolvedValue({ affected: 0 });

      // Act
      await clienteController.update(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        message: 'Cliente não encontrado para atualização.',
      });
    });
  });

  // Grupo de testes para o método delete
  describe('delete', () => {
    it('deve retornar um erro 404 se o cliente a ser deletado não for encontrado', async () => {
      const clienteId = 'id-inexistente';
      mockRequest.params = { id: clienteId };
      (Cliente.delete as jest.Mock).mockResolvedValue({ affected: 0 });
      await clienteController.delete(mockRequest as Request, mockResponse as Response);
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ success: false, message: 'Cliente não encontrado para exclusão.' });
    });
  });
});