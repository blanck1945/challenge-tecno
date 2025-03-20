import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Content } from '../content/content.entity';
import { User } from '../user/user.entity';
import { Review } from '../review/review.entity';
import { UserCourseEnrollment } from '../enrollment/enrollment.entity';
import { CourseLanguages } from '../enums/courseLanguages.enum';
import { Favorite } from '../favorites/favorites.entity';

@Entity()
export class Course extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ collation: 'und-x-icu' })
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: CourseLanguages,
    default: CourseLanguages.English,
  })
  language: CourseLanguages;

  @Column({ default: 0 })
  averageRating: number;

  @OneToMany(() => Content, (content) => content.course)
  contents: Content[];

  @OneToMany(() => Review, (review) => review.course)
  rankings: Review[];

  @OneToMany(() => Favorite, (favorite) => favorite.course, {
    cascade: true,
  })
  favorites: Favorite[];

  @ManyToMany(() => User, (user) => user.favorites)
  users: User[];

  @OneToMany(() => UserCourseEnrollment, (enrollment) => enrollment.course, {
    cascade: true,
  })
  enrollments: UserCourseEnrollment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
