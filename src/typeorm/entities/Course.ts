import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Video } from './Video';
import { User } from './User';

@Entity({ name: 'course' })
export class Course {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  courseTitle: string;

  @Column()
  courseDescription: string;

  @Column()
  category: string;

  @Column()
  courseImage: string;

  @Column()
  coursePrice: string;

  @Column()
  courseResource: string;

  @Column()
  active: number;

  @Column()
  createdAt: Date;

  @OneToMany(() => Video, (video) => video.course)
  videos: Video[];

  @ManyToOne(() => User, (user) => user.courses)
  user: User;
}
