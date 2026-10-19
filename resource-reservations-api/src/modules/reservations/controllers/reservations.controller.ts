import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ReservationsService } from '../services/reservations.service.js';
import {
  CreateReservationDto,
  EditReservationDto,
  SearchReservationsByDto,
} from '../dtos/index.js';
import { Auth } from '../../auth/decorators/auth.decorator.js';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../../auth/interfaces/index.js';
import { UserRoles } from '../../roles/enums/index.js';

@Auth(UserRoles.ADMIN, UserRoles.CLIENT, UserRoles.STAFF)
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  create(
    @Body() dto: CreateReservationDto,
    @CurrentUser() authUser: AuthenticatedUser,
  ) {
    return this.reservationsService.create(dto, authUser);
  }

  @Get()
  findAll(
    @Query() dto: SearchReservationsByDto,
    @CurrentUser() authUser: AuthenticatedUser,
  ) {
    return this.reservationsService.findAll(dto, authUser);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() authUser: AuthenticatedUser,
  ) {
    return this.reservationsService.findOne(id, authUser);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: EditReservationDto,
    @CurrentUser() authUser: AuthenticatedUser,
  ) {
    return this.reservationsService.update(id, dto, authUser);
  }
}
