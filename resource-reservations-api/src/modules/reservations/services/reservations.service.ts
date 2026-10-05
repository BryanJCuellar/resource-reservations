import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../entities/reservation.entity.js';
import { User } from '../../users/entities/user.entity.js';
import { Resource } from '../../resources/entities/resource.entity.js';
import {
  CreateReservationDto,
  EditReservationDto,
  SearchReservationsByDto,
} from '../dtos/index.js';
import { HttpErrorsExceptions } from '../../../common/exceptions/index.js';
import { paginationValues } from '../../../common/consts/index.js';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationsRepo: Repository<Reservation>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(Resource)
    private readonly resourcesRepo: Repository<Resource>,
  ) {}

  async create(dto: CreateReservationDto): Promise<Reservation> {
    try {
      // Validar FKs de User y Resource
      const [user, resource] = await Promise.all([
        this.getActiveUser(dto.userId),
        this.getActiveResource(dto.resourceId),
      ]);

      const startAt = new Date(dto.startAt);
      const endAt = new Date(dto.endAt);
      // endAt debe ser posterior a startAt
      if (endAt <= startAt) {
        throw new BadRequestException('End date must be later than start date');
      }

      const reservation = this.reservationsRepo.create({
        description: dto.description ?? null,
        startAt,
        endAt,
        user,
        resource,
      });
      return await this.reservationsRepo.save(reservation);
    } catch (error) {
      HttpErrorsExceptions.handleHttpException(
        error,
        'Error creating reservation',
      );
    }
  }

  async findAll(dto: SearchReservationsByDto): Promise<{
    data: Reservation[];
    count: number;
  }> {
    try {
      const {
        term,
        dateFrom,
        dateTo,
        status,
        userId,
        resourceId,
        page = paginationValues.page,
        limit = paginationValues.limit,
      } = dto;

      const qb = this.reservationsRepo
        .createQueryBuilder('reservation')
        .innerJoinAndSelect('reservation.user', 'user')
        .innerJoinAndSelect('reservation.resource', 'resource');

      if (term) {
        qb.andWhere(
          `(
          UPPER(reservation.description) LIKE UPPER(:term) 
          OR UPPER(user.name) LIKE UPPER(:term) 
          OR UPPER(resource.name) LIKE UPPER(:term)
          )`,
          { term: `%${term}%` },
        );
      }

      const from = dateFrom ? new Date(dateFrom) : null;
      const to = dateTo ? new Date(dateTo) : null;

      if (from && !to) {
        qb.andWhere('reservation.endAt > :from', { from });
      }

      if (!from && to) {
        qb.andWhere('reservation.startAt < :to', { to });
      }

      if (from && to) {
        if (to <= from) {
          throw new BadRequestException(
            'End date must be later than start date',
          );
        }
        qb.andWhere('reservation.endAt > :from', { from });
        qb.andWhere('reservation.startAt < :to', { to });
      }

      if (status) {
        qb.andWhere('reservation.status = :status', { status });
      }

      if (userId) {
        qb.andWhere('user.id = :userId', { userId });
      }

      if (resourceId) {
        qb.andWhere('resource.id = :resourceId', { resourceId });
      }

      qb.orderBy('reservation.startAt', 'ASC');

      const skip = (page - 1) * limit;
      qb.skip(skip);
      qb.take(limit);

      const [data, count] = await qb.getManyAndCount();

      return { data, count };
    } catch (error) {
      HttpErrorsExceptions.handleHttpException(
        error,
        'Error fetching reservations',
      );
    }
  }

  async findOne(id: string): Promise<Reservation> {
    try {
      const reservation = await this.reservationsRepo.findOne({
        where: { id },
        relations: { user: true, resource: true },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      return reservation;
    } catch (error) {
      HttpErrorsExceptions.handleHttpException(
        error,
        'Error fetching reservation',
      );
    }
  }

  async update(id: string, dto: EditReservationDto): Promise<Reservation> {
    try {
      if (Object.values(dto).every((value) => value === undefined)) {
        throw new BadRequestException('No fields provided to update');
      }

      const reservation = await this.reservationsRepo.findOne({
        where: { id },
        relations: { user: true, resource: true },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      if (dto.description !== undefined) {
        reservation.description =
          dto.description === '' ? null : dto.description;
      }

      if (dto.startAt !== undefined) {
        reservation.startAt = new Date(dto.startAt);
      }

      if (dto.endAt !== undefined) {
        reservation.endAt = new Date(dto.endAt);
      }

      if (reservation.endAt <= reservation.startAt) {
        throw new BadRequestException('End date must be later than start date');
      }

      if (dto.userId !== undefined) {
        reservation.user = await this.getActiveUser(dto.userId);
      }

      if (dto.resourceId !== undefined) {
        reservation.resource = await this.getActiveResource(dto.resourceId);
      }

      if (dto.status !== undefined) {
        reservation.status = dto.status;
      }

      reservation.updatedAt = new Date();

      return await this.reservationsRepo.save(reservation);
    } catch (error) {
      HttpErrorsExceptions.handleHttpException(
        error,
        'Error updating reservation',
      );
    }
  }

  private async getActiveUser(id: string): Promise<User> {
    const user = await this.usersRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isActive) {
      throw new BadRequestException('Reservation requires an active user');
    }

    return user;
  }

  private async getActiveResource(id: string): Promise<Resource> {
    const resource = await this.resourcesRepo.findOneBy({ id });

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    if (!resource.isActive) {
      throw new BadRequestException('Reservation requires an active resource');
    }

    return resource;
  }
}
