import { EngenheiroController } from '../controllers/engenheiro.controller';
import { EngenheiroRepository } from '../repositories/engenheiro.repository';
import { Request, Response } from 'express';

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findAndCount: jest.fn(),
  findOne: jest.fn(),
  merge: jest.fn(),
  delete: jest.fn(),
} as unknown as EngenheiroRepository;

const mockRequest = { body: {}, params: {}, query: {} } as unknown as Request;
const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() } as unknown as Response;

describe('EngenheiroController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest.body = { nome: 'Engenheiro Teste', crea: '12345', telefone: '123', endereco: 'Rua Eng' };
    mockRequest.params = {};
    mockRequest.query = {};
  });

  it('Deve criar engenheiro (201)', async () => {
    const controller = new EngenheiroController(mockRepository);
    (mockRepository.create as jest.Mock).mockReturnValue(mockRequest.body);
    (mockRepository.save as jest.Mock).mockResolvedValue(mockRequest.body);
    await controller.create(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
  });

  it('Deve listar engenheiros (200)', async () => {
    const controller = new EngenheiroController(mockRepository);
    (mockRepository.findAndCount as jest.Mock).mockResolvedValue([[], 0]);
    await controller.findAll(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });

  it('Deve buscar por ID (200)', async () => {
    const controller = new EngenheiroController(mockRepository);
    mockRequest.params = { id: '1' };
    (mockRepository.findOne as jest.Mock).mockResolvedValue(mockRequest.body);
    await controller.findOne(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });
});