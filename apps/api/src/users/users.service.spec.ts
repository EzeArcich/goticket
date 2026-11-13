import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  const prismaMock = { user: { findMany: jest.fn() } };

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
  });

  it('reads only public fields through Prisma', async () => {
    const users = [
      {
        id: '332835d9-04ad-473c-b173-b139dc020cc9',
        email: 'camila.torres@example.com',
        createdAt: new Date('2026-11-12T23:40:29.723Z'),
      },
    ];
    prismaMock.user.findMany.mockResolvedValue(users);
    const result = await service.findAll();
    expect(result).toEqual(users);
    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      select: { id: true, email: true, createdAt: true },
    });
    expect(result[0]).not.toHaveProperty('passwordHash');
  });

  it('returns an empty list when no users exist', async () => {
    prismaMock.user.findMany.mockResolvedValue([]);
    await expect(service.findAll()).resolves.toEqual([]);
  });

  it('propagates persistence errors instead of claiming an empty result', async () => {
    const error = new Error('Persistence unavailable');
    prismaMock.user.findMany.mockRejectedValue(error);
    await expect(service.findAll()).rejects.toBe(error);
  });
});
