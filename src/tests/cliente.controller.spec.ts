import { ClienteController } from '../controllers/cliente.controller';
import { ClienteRepository } from '../repositories/cliente.repository';
import { Request, Response } from 'express';

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findAndCount: jest.fn(),
  findOne: jest.fn(),
  merge: jest.fn(),
  delete: jest.fn(),
} as unknown as ClienteRepository;

const mockRequest = {
  body: {},
  params: {},
  query: {},
} as unknown as Request;

const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  send: jest.fn()
} as unknown as Response;

describe('ClienteController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest.body = { nome: 'Cliente Teste', cpfCnpj: '123', telefone: '11999', endereco: 'Rua 1', rgIe: '123' };
    mockRequest.params = {};
    mockRequest.query = {};
  });

  it('Deve criar cliente (201)', async () => {
    const controller = new ClienteController(mockRepository);
    (mockRepository.create as jest.Mock).mockReturnValue(mockRequest.body);
    (mockRepository.save as jest.Mock).mockResolvedValue(mockRequest.body);

    await controller.create(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
  });

  it('Deve listar clientes (200)', async () => {
    const controller = new ClienteController(mockRepository);
    (mockRepository.findAndCount as jest.Mock).mockResolvedValue([[], 0]);

    await controller.findAll(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });

  it('Deve buscar um cliente por ID (200)', async () => {
    const controller = new ClienteController(mockRepository);
    mockRequest.params = { id: '1' };
    (mockRepository.findOne as jest.Mock).mockResolvedValue(mockRequest.body);

    await controller.findOne(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });

  it('Deve deletar cliente (204)', async () => {
    const controller = new ClienteController(mockRepository);
    mockRequest.params = { id: '1' };
    (mockRepository.delete as jest.Mock).mockResolvedValue({ affected: 1 });

    await controller.delete(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(204);
  });
});