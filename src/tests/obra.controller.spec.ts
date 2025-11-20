import { ObraController } from '../controllers/obra.controller';
import { ObraRepository } from '../repositories/obra.repository';
import { ClienteRepository } from '../repositories/cliente.repository';
import { EngenheiroRepository } from '../repositories/engenheiro.repository';
import { Request, Response } from 'express';

const mockObraRepo = {
  create: jest.fn(),
  save: jest.fn(),
  findAndCountWithFilters: jest.fn(),
  findOne: jest.fn(),
  merge: jest.fn(),
  delete: jest.fn(),
} as unknown as ObraRepository;

const mockClienteRepo = {
  findById: jest.fn(),
} as unknown as ClienteRepository;

const mockEngenheiroRepo = {
  findById: jest.fn(),
} as unknown as EngenheiroRepository;

const mockRequest = { body: {}, params: {}, query: {} } as unknown as Request;
const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() } as unknown as Response;

describe('ObraController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest.body = { 
      idCliente: 1, idEngenheiro: 1, tipoobra: 'Casa', enderecoobra: 'Rua A', 
      dataInicio: '2025-01-01', prevTermino: '2025-12-01', valorTotal: 100000, status: 'planejamento' 
    };
    mockRequest.params = {};
    mockRequest.query = {};
  });

  it('Deve criar obra com sucesso (201)', async () => {
    const controller = new ObraController(mockObraRepo, mockClienteRepo, mockEngenheiroRepo);

    (mockClienteRepo.findById as jest.Mock).mockResolvedValue({ id: 1, nome: 'Cliente' });
    (mockEngenheiroRepo.findById as jest.Mock).mockResolvedValue({ id: 1, nome: 'Eng' });

    (mockObraRepo.create as jest.Mock).mockReturnValue(mockRequest.body);
    (mockObraRepo.save as jest.Mock).mockResolvedValue(mockRequest.body);

    await controller.create(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
  });

  it('Deve falhar ao criar se cliente não existir (400)', async () => {
    const controller = new ObraController(mockObraRepo, mockClienteRepo, mockEngenheiroRepo);
    
    (mockClienteRepo.findById as jest.Mock).mockResolvedValue(null);

    await controller.create(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('Cliente com ID') }));
  });

  it('Deve listar obras (200)', async () => {
    const controller = new ObraController(mockObraRepo, mockClienteRepo, mockEngenheiroRepo);
    (mockObraRepo.findAndCountWithFilters as jest.Mock).mockResolvedValue([[], 0]);

    await controller.findAll(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });
});