import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Content } from '../content/content.entity';
import { User } from 'src/user/user.entity';
import { Ranking } from 'src/ranking/ranking.entity';
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
  @Column()
  dateCreated: Date;

  @Column({ nullable: true })
  dateUpdated: Date | null;

  @OneToMany(() => Content, (content) => content.course)
  contents: Content[];

  @OneToMany(() => Ranking, (ranking) => ranking.course)
  rankings: Ranking[];

  @OneToMany(() => Favorite, (favorite) => favorite.course)
  favorites: Favorite[];

  @ManyToMany(() => User, (user) => user.favorites)
  users: User[];

  @OneToMany(() => UserCourseEnrollment, (enrollment) => enrollment.course)
  enrollments: UserCourseEnrollment[];
}
