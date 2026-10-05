import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity.js';
import { JwtService } from '@nestjs/jwt';

// Bcrypt Mock
const bcryptMock = vi.hoisted(() => ({
  compare: vi.fn(),
}));

vi.mock('bcrypt', () => ({
  default: bcryptMock,
}));

describe('AuthService', () => {
  let authService: AuthService;

  // Users Repository Mock
  const usersRepoMock = {
    createQueryBuilder: vi.fn(),
  };

  const queryBuilderMock = {
    addSelect: vi.fn(),
    where: vi.fn(),
    getOne: vi.fn(),
  };

  queryBuilderMock.addSelect.mockReturnThis();
  queryBuilderMock.where.mockReturnThis();

  usersRepoMock.createQueryBuilder.mockReturnValue(queryBuilderMock);

  const userMock = {
    id: 'uuid-test',
    email: 'test@test.com',
    passwordHash: 'hash-test',
    isActive: true,
  };

  queryBuilderMock.getOne.mockResolvedValue(userMock);

  // Jwt Service Mock
  const jwtServiceMock = {
    signAsync: vi.fn(),
  };

  jwtServiceMock.signAsync.mockResolvedValue('token-test');

  bcryptMock.compare.mockResolvedValue(true);

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: usersRepoMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
  });

  it('should login successfully', async () => {
    // ARRANGE

    // ACT
    const result = await authService.login({
      email: 'test@test.com',
      password: 'password-test',
    });

    // ASSERT
    expect(result).toEqual({ accessToken: 'token-test' });
  });
});
