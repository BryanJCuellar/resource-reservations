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
import { ResourceCategory } from '../../resource-categories/entities/resource-category.entity.js';

@Entity({ name: 'resources' })
export class Resource {
  @PrimaryColumn({ type: 'uniqueidentifier', default: () => 'NEWID()' })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string | null;

  @Column({ name: 'is_active', type: 'bit', default: true })
  isActive: boolean;

  @Column({ name: 'created_at', type: 'datetime2', default: () => 'GETDATE()' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'datetime2', nullable: true })
  updatedAt: Date | null;

  @Column({ name: 'deleted_at', type: 'datetime2', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => ResourceCategory, (rc) => rc.resources, { nullable: false })
  @JoinColumn({ name: 'resource_category_id' })
  resourceCategory: Relation<ResourceCategory>;

  @OneToMany(() => Reservation, (reservation) => reservation.resource)
  reservations: Relation<Reservation[]>;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeFields() {
    this.name = this.name.trim().toUpperCase();
    this.code = this.code.trim().toUpperCase();
  }
}
