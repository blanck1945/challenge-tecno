import { Course } from 'src/course/course.entity';
import { User } from 'src/user/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('favorites')
export class Favorite extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  courseId: string;

  @ManyToOne(() => User, (user) => user.favorites)
  user: User;

  @ManyToOne(() => Course, (course) => course.favorites)
  course: Course;
}
