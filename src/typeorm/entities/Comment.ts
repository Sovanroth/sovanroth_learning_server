import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from './Course';
import { User } from './User';
import { Reply } from './Reply';

@Entity({ name: 'comment' })
export class Comment {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'text' })
  commentData: string;

  @Column()
  createdAt: Date;

  @ManyToOne(() => Course, (course) => course.comments)
  course: Course;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @OneToMany(() => Reply, (reply) => reply.comment)
  replies: Reply;
}
