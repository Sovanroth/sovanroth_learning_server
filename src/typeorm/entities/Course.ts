import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Video } from './Video';
import { User } from './User';
import { Comment } from './Comment';

@Entity({ name: 'course' })
export class Course {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  courseTitle: string;

  @Column({ type: 'text' })
  courseDescription: string;

  @Column()
  category: number;

  @Column({ type: 'text' })
  courseImage: string;

  @Column()
  coursePrice: string;

  @Column({ type: 'text' })
  courseResource: string;

  @Column()
  active: number;

  @Column()
  createdAt: Date;

  @OneToMany(() => Video, (video) => video.course)
  videos: Video[];

  @ManyToMany(() => User, (user) => user.courses)
  users: User[];

  @OneToMany(() => Comment, (comment) => comment.course, { cascade: true })
  comments: Comment[];
}
