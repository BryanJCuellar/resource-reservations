import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  type Relation,
} from 'typeorm';
import { Resource } from '../../resources/entities/resource.entity.js';

@Entity({ name: 'resource_categories' })
export class ResourceCategory {
  @PrimaryColumn({ type: 'uniqueidentifier', default: () => 'NEWID()' })
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

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

  @OneToMany(() => Resource, (r) => r.resourceCategory)
  resources: Relation<Resource[]>;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeFields() {
    this.name = this.name.trim().toUpperCase();
  }
}
