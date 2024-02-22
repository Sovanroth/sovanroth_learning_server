import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Course } from './Course';
import { User } from './User';

@Entity({ name: 'user_course' })
export class UserCourse {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.courses)
  user: User;

  @ManyToOne(() => Course, (course) => course.users)
  course: Course;
}
