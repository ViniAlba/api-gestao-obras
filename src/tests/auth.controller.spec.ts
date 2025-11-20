import { AuthController } from '../controllers/auth.controller';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../models/user.model';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const mockUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
} as unknown as UserRepository;

const mockRequest = {
  body: {},
} as unknown as Request;

const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as unknown as Response;

describe('AuthController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Deve registrar um usuário com sucesso (201)', async () => {
    const controller = new AuthController(mockUserRepository);
    mockRequest.body = { name: 'Test', email: 'test@email.com', password: '123' };
    
    (mockUserRepository.create as jest.Mock).mockReturnValue({ id: 1, ...mockRequest.body });
    (mockUserRepository.save as jest.Mock).mockResolvedValue({ id: 1, ...mockRequest.body });

    await controller.register(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  it('Deve realizar login com sucesso (200)', async () => {
    const controller = new AuthController(mockUserRepository);
    mockRequest.body = { email: 'test@email.com', password: '123' };

    const mockUser = new User();
    mockUser.id = 1;
    mockUser.email = 'test@email.com';
    mockUser.password = 'hash';
    mockUser.role = 'viewer';
    mockUser.comparePassword = jest.fn().mockResolvedValue(true);

    jest.spyOn(User, 'findByEmailWithPassword').mockResolvedValue(mockUser);

    await controller.login(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ token: expect.any(String) }));
  });

  it('Deve retornar 401 se a senha estiver incorreta', async () => {
    const controller = new AuthController(mockUserRepository);
    mockRequest.body = { email: 'test@email.com', password: 'errada' };

    const mockUser = new User();
    mockUser.comparePassword = jest.fn().mockResolvedValue(false);

    jest.spyOn(User, 'findByEmailWithPassword').mockResolvedValue(mockUser);

    await controller.login(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
  });
});