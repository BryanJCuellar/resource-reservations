import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/index.js';
import { User } from '../users/entities/user.entity.js';
import { AuthenticatedUser, JwtPayload } from './interfaces/index.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersRepo
      .createQueryBuilder('users')
      .innerJoinAndSelect('users.role', 'role')
      .addSelect('users.passwordHash')
      .where('users.email = :email', { email: dto.email })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive || !user.role.isActive) {
      throw new UnauthorizedException('Invalid authentication');
    }

    const payload: JwtPayload = { sub: user.id, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload);

    const authUser: AuthenticatedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      roleName: user.role.name,
    };

    return {
      accessToken,
      user: authUser,
    };
  }
}
