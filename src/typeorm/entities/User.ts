import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Course } from './Course';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({type: 'bigint'})
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

}
