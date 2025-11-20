import { EmpreiteiraController } from '../controllers/empreiteira.controller';
import { EmpreiteiraRepository } from '../repositories/empreiteira.repository';
import { Request, Response } from 'express';

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  merge: jest.fn(),
  delete: jest.fn(),
} as unknown as EmpreiteiraRepository;

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

describe('EmpreiteiraController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest.body = { nome: 'Empreiteira X', cnpjCpf: '0001', email: 'emp@test.com', telefone: '123' };
    mockRequest.params = {};
  });

  it('Deve criar empreiteira (201)', async () => {
    const controller = new EmpreiteiraController(mockRepository);
    (mockRepository.create as jest.Mock).mockReturnValue(mockRequest.body);
    (mockRepository.save as jest.Mock).mockResolvedValue(mockRequest.body);

    await controller.create(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
  });

  it('Deve listar empreiteiras (200)', async () => {
    const controller = new EmpreiteiraController(mockRepository);
    (mockRepository.find as jest.Mock).mockResolvedValue([]);

    await controller.findAll(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });

  it('Deve buscar por ID (200)', async () => {
    const controller = new EmpreiteiraController(mockRepository);
    mockRequest.params = { id: '1' };
    (mockRepository.findOne as jest.Mock).mockResolvedValue(mockRequest.body);

    await controller.findOne(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });

  it('Deve retornar 404 se não encontrar ID', async () => {
    const controller = new EmpreiteiraController(mockRepository);
    mockRequest.params = { id: '99' };
    (mockRepository.findOne as jest.Mock).mockResolvedValue(null);

    await controller.findOne(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
  });
});