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
import { User } from 'src/user/user.entity';
import { Review } from 'src/review/review.entity';
import { UserCourseEnrollment } from 'src/enrollment/enrollment.entity';
import { CourseLanguages } from 'src/enums/courseLanguages.enum';
import { Favorite } from 'src/favorites/favorites.entity';

@Entity()
export class Course extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
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

  @OneToMany(() => Favorite, (favorite) => favorite.course)
  favorites: Favorite[];

  @ManyToMany(() => User, (user) => user.favorites)
  users: User[];

  @OneToMany(() => UserCourseEnrollment, (enrollment) => enrollment.course)
  enrollments: UserCourseEnrollment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
