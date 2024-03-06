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

  @ManyToMany(() => Course, { cascade: true })
  @JoinTable()
  courses: Course[];

  @OneToOne(() => Profile, { cascade: true })
  @JoinColumn()
  profile: Profile;
}
