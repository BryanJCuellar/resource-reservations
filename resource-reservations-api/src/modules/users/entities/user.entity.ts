import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  type Relation,
} from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity.js';
import { Role } from '../../../roles/entities/role.entity.js';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn({ type: 'uniqueidentifier', default: () => 'NEWID()' })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 254, unique: true })
  email: string;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 255,
    select: false,
  })
  passwordHash: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ name: 'is_active', type: 'bit', default: true })
  isActive: boolean;

  @Column({ name: 'created_at', type: 'datetime2', default: () => 'GETDATE()' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'datetime2', nullable: true })
  updatedAt: Date | null;

  @Column({ name: 'deleted_at', type: 'datetime2', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Role, (role) => role.users, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role: Relation<Role>;

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Relation<Reservation>;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeFields() {
    this.name = this.name.trim().toUpperCase();
    this.email = this.email.trim().toLowerCase();
  }
}
