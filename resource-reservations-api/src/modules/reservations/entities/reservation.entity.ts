import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from 'typeorm';
import { ReservationStatus } from '../enums/index.js';
import { User } from '../../users/entities/user.entity.js';
import { Resource } from '../../resources/entities/resource.entity.js';

@Entity({ name: 'reservations' })
export class Reservation {
  @PrimaryColumn({ type: 'uniqueidentifier', default: () => 'NEWID()' })
  id: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string | null;

  @Column({ name: 'start_at', type: 'datetime2' })
  startAt: Date;

  @Column({ name: 'end_at', type: 'datetime2' })
  endAt: Date;

  @Column({
    type: 'varchar',
    length: 20,
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  status: ReservationStatus;

  @ManyToOne(() => User, (user) => user.reservations, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @ManyToOne(() => Resource, (resource) => resource.reservations, {
    nullable: false,
  })
  @JoinColumn({ name: 'resource_id' })
  resource: Relation<Resource>;

  @Column({ name: 'created_at', type: 'datetime2', default: () => 'GETDATE()' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'datetime2', nullable: true })
  updatedAt: Date | null;
}
