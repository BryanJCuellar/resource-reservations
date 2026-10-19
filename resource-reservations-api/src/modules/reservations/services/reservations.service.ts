import {
  BadRequestException,
  ForbiddenException,
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
import { AuthenticatedUser } from '../../auth/interfaces/index.js';
import { UserRoles } from '../../roles/enums/index.js';
import { ReservationStatus } from '../enums/index.js';

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

  async create(
    dto: CreateReservationDto,
    authUser: AuthenticatedUser,
  ): Promise<Reservation> {
    try {
      const isAuthClient = authUser.roleName === UserRoles.CLIENT;

      // Si usuario es CLIENT, solo puede reservar a su nombre
      const userId = isAuthClient ? authUser.id : dto.userId;

      // Si usuario es CLIENT, solo puede reservar con estado PENDING
      const status = isAuthClient ? ReservationStatus.PENDING : dto.status;

      // Una reserva no se puede crear en estado terminal (REJECTED, CANCELLED)
      if (
        status !== undefined &&
        [ReservationStatus.REJECTED, ReservationStatus.CANCELLED].includes(
          status,
        )
      ) {
        throw new BadRequestException(
          `You can't create a reservation with status ${status}`,
        );
      }

      // Validar FKs de User, Resource y createdBy
      const [user, resource, createdBy] = await Promise.all([
        this.getActiveUser(userId),
        this.getActiveResource(dto.resourceId),
        this.getActiveUser(authUser.id),
      ]);

      // Solo se puede reservar a usuarios CLIENT
      if (user.role.name !== UserRoles.CLIENT) {
        throw new BadRequestException(
          'Reservations can only be made for users registered as clients',
        );
      }

      const startAt = new Date(dto.startAt);
      const endAt = new Date(dto.endAt);

      // endAt debe ser posterior a startAt
      if (endAt <= startAt) {
        throw new BadRequestException('End date must be later than start date');
      }

      // Verificar traslape de recurso
      const reservationOverlap = await this.hasReservationOverlap(
        resource.id,
        startAt,
        endAt,
      );

      if (reservationOverlap) {
        throw new BadRequestException(
          'The resource is already booked for the selected time period',
        );
      }

      const reservation = this.reservationsRepo.create({
        description: dto.description ?? null,
        startAt,
        endAt,
        status,
        user,
        resource,
        createdBy,
      });
      return await this.reservationsRepo.save(reservation);
    } catch (error) {
      HttpErrorsExceptions.handleHttpException(
        error,
        'Error creating reservation',
      );
    }
  }

  async findAll(
    dto: SearchReservationsByDto,
    authUser: AuthenticatedUser,
  ): Promise<{
    data: Reservation[];
    count: number;
  }> {
    try {
      const {
        term,
        status,
        resourceId,
        page = paginationValues.page,
        limit = paginationValues.limit,
      } = dto;

      const isAuthClient = authUser.roleName === UserRoles.CLIENT;

      const userId = isAuthClient ? authUser.id : dto.userId;

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

      const dateFrom = dto.dateFrom ? new Date(dto.dateFrom) : null;
      const dateTo = dto.dateTo ? new Date(dto.dateTo) : null;

      if (dateFrom && !dateTo) {
        qb.andWhere('reservation.endAt > :dateFrom', { dateFrom });
      }

      if (!dateFrom && dateTo) {
        qb.andWhere('reservation.startAt < :dateTo', { dateTo });
      }

      if (dateFrom && dateTo) {
        if (dateTo <= dateFrom) {
          throw new BadRequestException(
            'End date must be later than start date',
          );
        }
        qb.andWhere('reservation.endAt > :dateFrom', { dateFrom });
        qb.andWhere('reservation.startAt < :dateTo', { dateTo });
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

  async findOne(id: string, authUser: AuthenticatedUser): Promise<Reservation> {
    try {
      const reservation = await this.reservationsRepo.findOne({
        where: { id },
        relations: { user: true, resource: true },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      const isAuthClient = authUser.roleName === UserRoles.CLIENT;

      // Un cliente solo puede ver sus propias reservas
      if (isAuthClient && reservation.user.id !== authUser.id) {
        throw new ForbiddenException(
          "You don't have permission to view this reservation",
        );
      }

      return reservation;
    } catch (error) {
      HttpErrorsExceptions.handleHttpException(
        error,
        'Error fetching reservation',
      );
    }
  }

  async update(
    id: string,
    dto: EditReservationDto,
    authUser: AuthenticatedUser,
  ): Promise<Reservation> {
    try {
      if (Object.values(dto).every((value) => value === undefined)) {
        throw new BadRequestException('No fields provided to update');
      }

      const isAuthAdmin = authUser.roleName === UserRoles.ADMIN;
      const isAuthStaff = authUser.roleName === UserRoles.STAFF;
      const isAuthClient = authUser.roleName === UserRoles.CLIENT;

      const reservation = await this.reservationsRepo.findOne({
        where: { id },
        relations: { user: true, resource: true, createdBy: true },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      /** Un cliente para modificar una reserva debe cumplir las siguientes condiciones:
       *  1. La reserva debe estar a su nombre
       *  2. La reserva tuvo que ser creada por él mismo (Si la creo un STAFF, no puede alterarla)
       *  3. La reserva debe estar en estado 'PENDING'
       */
      if (isAuthClient) {
        if (
          reservation.user.id !== authUser.id ||
          reservation.createdBy.id !== authUser.id ||
          reservation.status !== ReservationStatus.PENDING
        ) {
          throw new ForbiddenException(
            "You don't have permission to modify this reservation",
          );
        }
      }

      // Una reserva ya no se puede modificar si tiene estado terminal (REJECTED, CANCELLED)
      if (
        [ReservationStatus.REJECTED, ReservationStatus.CANCELLED].includes(
          reservation.status,
        )
      ) {
        throw new BadRequestException(
          `You can't modify a reservation with status ${reservation.status}`,
        );
      }

      if (dto.status !== undefined) {
        // Un cliente solo tiene permitido la transicion de estado: PENDING -> CANCELLED
        if (isAuthClient) {
          const validStatus = [
            ReservationStatus.PENDING,
            ReservationStatus.CANCELLED,
          ].includes(dto.status);

          if (!validStatus) {
            throw new ForbiddenException(
              `You don't have permission to assign the status to ${dto.status}`,
            );
          }
        }

        /** El personal tiene permitido las siguientes transiciones de estado:
         *  PENDING -> cualquier otro estado
         *  CONFIRMED -> CANCELLED
         */
        if (isAuthAdmin || isAuthStaff) {
          if (reservation.status === ReservationStatus.CONFIRMED) {
            const validStatus = [
              ReservationStatus.CONFIRMED,
              ReservationStatus.CANCELLED,
            ].includes(dto.status);

            if (!validStatus) {
              throw new BadRequestException(
                `You can't change a reservation from ${reservation.status} to ${dto.status}`,
              );
            }
          }
        }

        reservation.status = dto.status;
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
        const userId = isAuthClient ? authUser.id : dto.userId;

        const user = await this.getActiveUser(userId);

        if (user.role.name !== UserRoles.CLIENT) {
          throw new BadRequestException(
            'Reservations can only be made for users registered as clients',
          );
        }

        reservation.user = user;
      }

      if (dto.resourceId !== undefined) {
        reservation.resource = await this.getActiveResource(dto.resourceId);
      }

      // Verificar traslape de recurso (solo si esta en PENDING o CONFIRMED)
      if (
        [ReservationStatus.PENDING, ReservationStatus.CONFIRMED].includes(
          reservation.status,
        )
      ) {
        const reservationOverlap = await this.hasReservationOverlap(
          reservation.resource.id,
          reservation.startAt,
          reservation.endAt,
          reservation.id,
        );

        if (reservationOverlap) {
          throw new BadRequestException(
            'The resource is already booked for the selected time period',
          );
        }
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
    const user = await this.usersRepo.findOne({
      where: { id },
      relations: { role: true },
    });

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

  private async hasReservationOverlap(
    resourceId: string,
    startAt: Date,
    endAt: Date,
    reservationId?: string,
  ): Promise<boolean> {
    // Buscamos reservas confirmadas del mismo recurso que se traslapen
    const qb = this.reservationsRepo
      .createQueryBuilder('reservation')
      .innerJoin('reservation.resource', 'resource')
      .where('reservation.status = :status', {
        status: ReservationStatus.CONFIRMED,
      })
      .andWhere('resource.id = :resourceId', { resourceId })
      .andWhere('reservation.startAt < :endAt', { endAt })
      .andWhere('reservation.endAt > :startAt', { startAt });

    // Excluimos la reserva actual en modo edicion
    if (reservationId !== undefined) {
      qb.andWhere('reservation.id != :reservationId', { reservationId });
    }

    return await qb.getExists();
  }
}
