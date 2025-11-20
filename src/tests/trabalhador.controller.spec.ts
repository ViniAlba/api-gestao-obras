import { TrabalhadorController } from '../controllers/trabalhador.controller';
import { TrabalhadorRepository } from '../repositories/trabalhador.repository';
import { Request, Response } from 'express';

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findAndCountWithFilters: jest.fn(),
  findOne: jest.fn(),
  merge: jest.fn(),
  delete: jest.fn(),
  findById: jest.fn()
} as unknown as TrabalhadorRepository;

const mockRequest = { body: {}, params: {}, query: {} } as unknown as Request;
const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() } as unknown as Response;

describe('TrabalhadorController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest.body = { nome: 'Trab', cpfCnpj: '111', salario: 1000, ctps: '123', funcao: 'Pedreiro' };
    mockRequest.params = {};
    mockRequest.query = {};
  });

  it('Deve criar trabalhador (201)', async () => {
    const controller = new TrabalhadorController(mockRepository);
    (mockRepository.create as jest.Mock).mockReturnValue(mockRequest.body);
    (mockRepository.save as jest.Mock).mockResolvedValue(mockRequest.body);
    
    await controller.create(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
  });

  it('Deve validar se o gerente existe ao criar (400)', async () => {
    const controller = new TrabalhadorController(mockRepository);
    mockRequest.body.idGerente = 99;
    (mockRepository.findById as jest.Mock).mockResolvedValue(null);

    await controller.create(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'O Gerente informado não existe.' }));
  });

  it('Deve listar trabalhadores (200)', async () => {
    const controller = new TrabalhadorController(mockRepository);
    (mockRepository.findAndCountWithFilters as jest.Mock).mockResolvedValue([[], 0]);
    await controller.findAll(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });
});