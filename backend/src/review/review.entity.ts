import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Course } from '../course/course.entity';
import { User } from 'src/user/user.entity';

@Entity('reviews')
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rating: number;

  @Column({ default: '' })
  message: string;

  @ManyToOne(() => User, (user) => user.rankings)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Course, (course) => course.rankings)
  @JoinColumn({ name: 'courseId' })
  course: Course;
}
