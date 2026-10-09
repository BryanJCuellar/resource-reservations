import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  type Relation,
} from 'typeorm';
import { User } from '../../modules/users/entities/user.entity.js';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryColumn({ type: 'uniqueidentifier', default: () => 'NEWID()' })
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Column({ name: 'is_active', type: 'bit', default: true })
  isActive: boolean;

  @Column({ name: 'created_at', type: 'datetime2', default: () => 'GETDATE()' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'datetime2', nullable: true })
  updatedAt: Date | null;

  @Column({ name: 'deleted_at', type: 'datetime2', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => User, (user) => user.role)
  users: Relation<User>;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeFields() {
    this.name = this.name.trim().toUpperCase();
  }
}
