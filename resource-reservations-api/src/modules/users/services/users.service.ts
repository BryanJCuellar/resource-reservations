import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { User } from '../entities/user.entity.js';
import { Role } from '../../../roles/entities/role.entity.js';
import {
  CreateUserDto,
  EditProfileDto,
  EditUserDto,
  RegisterUserDto,
  SearchUsersByDto,
} from '../dtos/index.js';
import { paginationValues } from '../../../common/consts/index.js';
import { UserResponse } from '../interfaces/index.js';
import { HttpErrorsExceptions } from '../../../common/exceptions/index.js';
import { AuthenticatedUser } from '../../auth/interfaces/index.js';
import { UserRoles } from '../../../roles/enums/index.js';

@Injectable()
export class UsersService {
  private readonly saltOrRounds = 10;
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
  ) {}

  async register(dto: RegisterUserDto): Promise<UserResponse> {
    try {
      const { name, email, password, phone } = dto;

      const role = await this.rolesRepository.findOneBy({
        name: UserRoles.CLIENT,
      });

      if (!role) {
        throw new NotFoundException('Default role not found');
      }

      if (!role.isActive) {
        throw new BadRequestException('Default role is not active');
      }

      const hash = await bcrypt.hash(password, this.saltOrRounds);

      const user = this.usersRepository.create({
        name,
        email,
        passwordHash: hash,
        phone,
        role,
      });

      const savedUser = await this.usersRepository.save(user);

      return this.toResponse(savedUser);
    } catch (error) {
      HttpErrorsExceptions.handleHttpException(error, 'Error registering user');
    }
  }

  async findMyProfile(authUser: AuthenticatedUser): Promise<UserResponse> {
    try {
      const user = await this.usersRepository.findOneBy({ id: authUser.id });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      HttpErrorsExceptions.handleHttpException(error, 'Error fetching profile');
    }
  }

  async updateMyProfile(authUser: AuthenticatedUser, dto: EditProfileDto) {
    try {
      if (Object.values(dto).every((value) => value === undefined)) {
        throw new BadRequestException('No fields provided to update');
      }

      const user = await this.usersRepository.findOneBy({ id: authUser.id });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!user.isActive) {
        throw new BadRequestException('User is not active');
      }

      if (dto.name !== undefined) {
        user.name = dto.name;
      }

      if (dto.phone !== undefined) {
        user.phone = dto.phone;
      }

      user.updatedAt = new Date();

      const savedUser = await this.usersRepository.save(user);

      return this.toResponse(savedUser);
    } catch (error) {
      HttpErrorsExceptions.handleHttpException(error, 'Error updating profile');
    }
  }

  async create(dto: CreateUserDto): Promise<UserResponse> {
    try {
      const { name, email, password, phone, roleId } = dto;

      const role = await this.getActiveRole(roleId);

      const hash = await bcrypt.hash(password, this.saltOrRounds);

      const user = this.usersRepository.create({
        name,
        email,
        passwordHash: hash,
        phone,
        role,
      });

      const savedUser = await this.usersRepository.save(user);

      return this.toResponse(savedUser);
    } catch (error) {
      HttpErrorsExceptions.handleHttpException(error, 'Error creating user');
    }
  }

  async findAll(dto: SearchUsersByDto): Promise<{
    data: UserResponse[];
    count: number;
  }> {
    try {
      const {
        term,
        isActive,
        page = paginationValues.page,
        limit = paginationValues.limit,
      } = dto;

      const qb = this.usersRepository
        .createQueryBuilder('users')
        .select([
          'users.id',
          'users.name',
          'users.email',
          'users.phone',
          'users.isActive',
          'users.createdAt',
          'users.updatedAt',
          'users.deletedAt',
        ]);

      if (term) {
        qb.andWhere(
          '(UPPER(users.name) LIKE UPPER(:term) OR UPPER(users.email) LIKE UPPER(:term))',
          { term: `%${term}%` },
        );
      }

      if (isActive) {
        qb.andWhere('users.isActive = :isActive', {
          isActive: isActive === 'true',
        });
      }

      qb.orderBy('users.createdAt', 'DESC');

      const skip = (page - 1) * limit;
      qb.skip(skip);
      qb.take(limit);

      const [data, count] = await qb.getManyAndCount();
      return { data, count };
    } catch (error) {
      HttpErrorsExceptions.handleHttpException(error, 'Error fetching users');
    }
  }

  async findOne(id: string): Promise<UserResponse> {
    try {
      const user = await this.usersRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      HttpErrorsExceptions.handleHttpException(error, 'Error fetching user');
    }
  }

  async update(id: string, dto: EditUserDto): Promise<UserResponse> {
    try {
      if (Object.values(dto).every((value) => value === undefined)) {
        throw new BadRequestException('No fields provided to update');
      }

      const user = await this.usersRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!user.isActive) {
        throw new BadRequestException('User is not active');
      }

      if (dto.name !== undefined) {
        user.name = dto.name;
      }

      if (dto.email !== undefined) {
        user.email = dto.email;
      }

      if (dto.password !== undefined) {
        const hash = await bcrypt.hash(dto.password, this.saltOrRounds);
        user.passwordHash = hash;
      }

      if (dto.phone !== undefined) {
        user.phone = dto.phone;
      }

      if (dto.roleId !== undefined) {
        user.role = await this.getActiveRole(dto.roleId);
      }

      user.updatedAt = new Date();

      const savedUser = await this.usersRepository.save(user);
      return this.toResponse(savedUser);
    } catch (error) {
      HttpErrorsExceptions.handleHttpException(error, 'Error updating user');
    }
  }

  async deactivate(id: string): Promise<UserResponse> {
    try {
      const user = await this.usersRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!user.isActive) {
        throw new BadRequestException('User has been already deactivated');
      }

      const savedUser = await this.usersRepository.save({
        ...user,
        isActive: false,
        updatedAt: new Date(),
        deletedAt: new Date(),
      });
      return this.toResponse(savedUser);
    } catch (error) {
      HttpErrorsExceptions.handleHttpException(
        error,
        'Error deactivating user',
      );
    }
  }

  async reactivate(id: string): Promise<UserResponse> {
    try {
      const user = await this.usersRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.isActive) {
        throw new BadRequestException('User is already active');
      }

      const savedUser = await this.usersRepository.save({
        ...user,
        isActive: true,
        updatedAt: new Date(),
        deletedAt: null,
      });
      return this.toResponse(savedUser);
    } catch (error) {
      HttpErrorsExceptions.handleHttpException(
        error,
        'Error reactivating user',
      );
    }
  }

  private toResponse(user: User): UserResponse {
    const { passwordHash, ...result } = user;
    return result;
  }

  private async getActiveRole(id: string): Promise<Role> {
    const role = await this.rolesRepository.findOneBy({ id });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (!role.isActive) {
      throw new BadRequestException('User requires an active role');
    }

    return role;
  }
}
