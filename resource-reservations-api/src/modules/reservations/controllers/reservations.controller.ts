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

@Auth()
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  create(@Body() dto: CreateReservationDto) {
    return this.reservationsService.create(dto);
  }

  @Get()
  findAll(@Query() dto: SearchReservationsByDto) {
    return this.reservationsService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.reservationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: EditReservationDto,
  ) {
    return this.reservationsService.update(id, dto);
  }
}
