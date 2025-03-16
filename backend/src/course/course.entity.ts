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

@Entity()
export class Course extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  dateCreated: Date;

  @Column({ nullable: true })
  dateUpdated: Date | null;

  @OneToMany(() => Content, (content) => content.course)
  contents: Content[];

  @ManyToMany(() => User, (user) => user.favorites)
  users: User[];
}
