import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Role } from '../enums/role.enum';
import { UserCourseEnrollment } from '../enrollment/enrollment.entity';
import { Favorite } from '../favorites/favorites.entity';
import { Review } from '../review/review.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];

  @OneToMany(() => Review, (review) => review.user)
  rankings: Review[];

  @OneToMany(() => UserCourseEnrollment, (enrollment) => enrollment.user)
  enrollments: UserCourseEnrollment[];
}
