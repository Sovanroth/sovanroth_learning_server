import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from './Course';
import { Profile } from './Profile';
import { Comment } from './Comment';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  role: number;

  @Column({ unique: true })
  email: string;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  resetToken: string;

  @Column({ nullable: true })
  resetTokenExpiration: Date;

  @OneToOne(() => Profile, { cascade: true })
  @JoinColumn()
  profile: Profile;

  @ManyToMany(() => Course, { cascade: true })
  @JoinTable()
  courses: Course[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
