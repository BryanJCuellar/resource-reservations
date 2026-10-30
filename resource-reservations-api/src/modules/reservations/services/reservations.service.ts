import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
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

/******************************************
 *  TRANSICIONES DE ESTADO DE RESERVA
 * ***************************************/
// Un cliente solo tiene permitido la transicion de estado: PENDING -> CANCELLED
const clientTransitions: Record<ReservationStatus, ReservationStatus[]> = {
  [ReservationStatus.PENDING]: [ReservationStatus.CANCELLED],
  [ReservationStatus.CONFIRMED]: [],
  [ReservationStatus.REJECTED]: [],
  [ReservationStatus.CANCELLED]: [],
};

/** El personal tiene permitido las siguientes transiciones de estado:
 *  PENDING -> cualquier otro estado
 *  CONFIRMED -> CANCELLED
 */
const staffTransitions: Record<ReservationStatus, ReservationStatus[]> = {
  [ReservationStatus.PENDING]: [
    ReservationStatus.CONFIRMED,
    ReservationStatus.REJECTED,
    ReservationStatus.CANCELLED,
  ],
  [ReservationStatus.CONFIRMED]: [ReservationStatus.CANCELLED],
  [ReservationStatus.REJECTED]: [],
  [ReservationStatus.CANCELLED]: [],
};

const statusTransitions = {
  [UserRoles.CLIENT]: clientTransitions,
  [UserRoles.STAFF]: staffTransitions,
  [UserRoles.ADMIN]: staffTransitions,
};

@Injectable()
export class ReservationsService {
  constructor(
    private readonly dataSource: DataSource,
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
    const maxAttempts = 3;
    for (let attempt = 1; ; attempt++) {
      try {
        return await this.dataSource.transaction(async (manager) => {
          const reservationsRepo = manager.getRepository(Reservation);
          const usersRepo = manager.getRepository(User);
          const resourcesRepo = manager.getRepository(Resource);

          const isAuthClient = authUser.roleName === UserRoles.CLIENT;

          // Si usuario es CLIENT, solo puede reservar a su nombre
          const userId = isAuthClient ? authUser.id : dto.userId;

          // Si usuario es CLIENT, solo puede reservar con estado PENDING
          const status = isAuthClient
            ? ReservationStatus.PENDING
            : (dto.status ?? ReservationStatus.PENDING);

          // Una reserva no se puede crear con un estado cerrado (REJECTED, CANCELLED)
          if (
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
            this.getUser(userId, true, usersRepo),
            this.getResourceLock(dto.resourceId, true, resourcesRepo),
            this.getUser(authUser.id, true, usersRepo),
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
            throw new BadRequestException(
              'End date must be later than start date',
            );
          }

          const isTimeRangeActive = new Date() < endAt;

          // Evitar crear reservas en estado PENDING cuyo horario ya finalizó
          if (status === ReservationStatus.PENDING && !isTimeRangeActive) {
            throw new BadRequestException(
              `You can't create a ${status} reservation with an expired time range`,
            );
          }

          // Verificar traslape de recurso
          const reservationOverlap = await this.hasReservationOverlap(
            resource.id,
            startAt,
            endAt,
            reservationsRepo,
          );

          if (reservationOverlap) {
            throw new BadRequestException(
              'The resource is already booked for the selected time period',
            );
          }

          const reservation = reservationsRepo.create({
            description: dto.description ?? null,
            startAt,
            endAt,
            status,
            user,
            resource,
            createdBy,
          });

          return await reservationsRepo.save(reservation);
        });
      } catch (error) {
        // Detectar si SQL Server canceló la transacción por un deadlock
        const isDeadlock =
          error instanceof QueryFailedError &&
          error.driverError?.number === 1205;

        // Hacer unos cuantos reintentos antes de lanzar error por deadlock
        if (isDeadlock && attempt < maxAttempts) {
          const delayMs = 100 * attempt + Math.floor(Math.random() * 100);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          continue;
        }

        if (isDeadlock) {
          throw new ConflictException(
            'The reservation could not be created due to a concurrent operation. Please try again.',
          );
        }

        HttpErrorsExceptions.handleHttpException(
          error,
          'Error creating reservation',
        );
      }
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
    const { version, ...fields } = dto;

    if (Object.values(fields).every((value) => value === undefined)) {
      throw new BadRequestException('No fields provided to update');
    }

    const maxAttempts = 3;

    for (let attempt = 1; ; attempt++) {
      try {
        return await this.dataSource.transaction(async (manager) => {
          const reservationsRepo = manager.getRepository(Reservation);
          const usersRepo = manager.getRepository(User);
          const resourcesRepo = manager.getRepository(Resource);

          const isAuthClient = authUser.roleName === UserRoles.CLIENT;

          const reservation = await reservationsRepo.findOne({
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

          // Una reserva ya no se puede modificar si tiene estado cerrado (REJECTED, CANCELLED)
          if (
            [ReservationStatus.REJECTED, ReservationStatus.CANCELLED].includes(
              reservation.status,
            )
          ) {
            throw new BadRequestException(
              `You can't modify a reservation with status ${reservation.status}`,
            );
          }

          /******************************************
           *  TRANSICIONES DE ESTADO DE RESERVA
           * ***************************************/
          if (dto.status !== undefined) {
            this.validateStatusTransition(
              reservation.status,
              dto.status,
              authUser.roleName as UserRoles,
            );

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
            throw new BadRequestException(
              'End date must be later than start date',
            );
          }

          const isTimeRangeActive = new Date() < reservation.endAt;

          // No se puede dejar una reserva en PENDING si el horario ya finalizó
          if (
            reservation.status === ReservationStatus.PENDING &&
            !isTimeRangeActive
          ) {
            throw new BadRequestException(
              `A reservation with status ${reservation.status} cannot have an expired time range. Change the reservation's time range or status.`,
            );
          }

          // Reserva abierta
          const isReservationOpen = [
            ReservationStatus.PENDING,
            ReservationStatus.CONFIRMED,
          ].includes(reservation.status);

          // Reserva activa = reserva vigente con estado abierto
          const isReservationActive = isReservationOpen && isTimeRangeActive;

          // Reservation User
          const userId = isAuthClient
            ? authUser.id
            : (dto.userId ?? reservation.user.id);

          const user = isReservationActive
            ? await this.getUser(userId, true, usersRepo)
            : await this.getUser(userId, false, usersRepo);

          const isUserChanging = reservation.user.id !== userId;

          // Si se cambia de usuario, se debe seguir verificando que el nuevo sea cliente
          if (isUserChanging && user.role.name !== UserRoles.CLIENT) {
            throw new BadRequestException(
              'Reservations can only be made for users registered as clients',
            );
          }

          reservation.user = user;

          // Reservation Resource
          const resourceId = dto.resourceId ?? reservation.resource.id;

          reservation.resource = isReservationActive
            ? await this.getResourceLock(resourceId, true, resourcesRepo)
            : await this.getResourceLock(resourceId, false, resourcesRepo);

          // Verificar traslape de recurso (solo si reserva esta en PENDING o CONFIRMED)
          if (isReservationOpen) {
            const reservationOverlap = await this.hasReservationOverlap(
              reservation.resource.id,
              reservation.startAt,
              reservation.endAt,
              reservationsRepo,
              reservation.id,
            );

            if (reservationOverlap) {
              throw new BadRequestException(
                'The resource is already booked for the selected time period',
              );
            }
          }

          reservation.updatedAt = new Date();

          // Optimistic Lock
          const lock = await reservationsRepo
            .createQueryBuilder()
            .update(Reservation)
            .set({
              description: reservation.description,
              startAt: reservation.startAt,
              endAt: reservation.endAt,
              status: reservation.status,
              user: reservation.user,
              resource: reservation.resource,
              updatedAt: reservation.updatedAt,
              version: () => 'version + 1',
            })
            .where('id = :id AND version = :version', { id, version })
            .execute();

          if (lock.affected === 0) {
            throw new ConflictException(
              'The reservation was modified by another user. Please reload and try again.',
            );
          }

          const updatedReservation = await reservationsRepo.findOne({
            where: { id },
            relations: { user: true, resource: true, createdBy: true },
          });

          if (!updatedReservation) {
            throw new NotFoundException('Reservation not found');
          }

          return updatedReservation;
        });
      } catch (error) {
        // Detectar SQL Server deadlock
        const isDeadlock =
          error instanceof QueryFailedError &&
          error.driverError?.number === 1205;

        // Hacer unos cuantos reintentos antes de lanzar error por deadlock
        if (isDeadlock && attempt < maxAttempts) {
          const delayMs = 100 * attempt + Math.floor(Math.random() * 100);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          continue;
        }

        if (isDeadlock) {
          throw new ConflictException(
            'The reservation could not be updated due to a concurrent operation. Please try again.',
          );
        }

        HttpErrorsExceptions.handleHttpException(
          error,
          'Error updating reservation',
        );
      }
    }
  }

  private async getUser(
    id: string,
    isActive: boolean = true,
    usersRepo: Repository<User> = this.usersRepo,
  ): Promise<User> {
    const user = await usersRepo.findOne({
      where: { id },
      relations: { role: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (isActive && !user.isActive) {
      throw new BadRequestException('Reservation requires an active user');
    }

    return user;
  }

  private async getResourceLock(
    id: string,
    isActive: boolean = true,
    resourcesRepo: Repository<Resource> = this.resourcesRepo,
  ): Promise<Resource> {
    const resource = await resourcesRepo.findOne({
      where: { id },
      lock: { mode: 'pessimistic_write' }, // Pessimistic Lock
    });

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    if (isActive && !resource.isActive) {
      throw new BadRequestException('Reservation requires an active resource');
    }

    return resource;
  }

  private async hasReservationOverlap(
    resourceId: string,
    startAt: Date,
    endAt: Date,
    reservationsRepo: Repository<Reservation> = this.reservationsRepo,
    reservationId?: string,
  ): Promise<boolean> {
    // Buscamos reservas confirmadas del mismo recurso que se traslapen
    const qb = reservationsRepo
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

  private validateStatusTransition(
    currentStatus: ReservationStatus,
    nextStatus: ReservationStatus,
    role: UserRoles,
  ): void {
    if (currentStatus === nextStatus) return;

    const allowedStatuses = statusTransitions[role][currentStatus];

    if (!allowedStatuses.includes(nextStatus)) {
      if (role === UserRoles.CLIENT) {
        throw new ForbiddenException(
          `You don't have permission to change a reservation from ${currentStatus} to ${nextStatus}`,
        );
      }

      throw new BadRequestException(
        `You can't change a reservation from ${currentStatus} to ${nextStatus}`,
      );
    }
  }
}
