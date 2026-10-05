import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { ResourcesModule } from './resources/resources.module.js';
import { ReservationsModule } from './reservations/reservations.module.js';

@Module({
  imports: [AuthModule, UsersModule, ResourcesModule, ReservationsModule],
})
export class ModulesModule {}
