import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Role } from '../modules/roles/entities/role.entity.js';
import { User } from '../modules/users/entities/user.entity.js';
import { ResourceCategory } from '../modules/resource-categories/entities/resource-category.entity.js';
import { Resource } from '../modules/resources/entities/resource.entity.js';
import { Reservation } from '../modules/reservations/entities/reservation.entity.js';

export const seedDataSource = new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Role, User, ResourceCategory, Resource, Reservation],
  synchronize: false,
  logging: true,
  options: {
    trustServerCertificate: true,
  },
});
