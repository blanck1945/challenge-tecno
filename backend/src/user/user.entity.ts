import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Role } from '../enums/role.enum';
import { Course } from 'src/course/course.entity';
import { Ranking } from 'src/ranking/ranking.entity';
import { UserCourseEnrollment } from 'src/enrollment/enrollment.entity';
import { FavoritesService } from 'src/favorites/favorites.service';
import { Favorite } from 'src/favorites/favorites.entity';

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

  @OneToMany(() => Ranking, (ranking) => ranking.user)
  rankings: Ranking[];

  @OneToMany(() => UserCourseEnrollment, (enrollment) => enrollment.user)
  enrollments: UserCourseEnrollment[];
}
