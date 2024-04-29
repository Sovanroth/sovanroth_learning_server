import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Course } from './Course';
import { User } from './User';

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
}
