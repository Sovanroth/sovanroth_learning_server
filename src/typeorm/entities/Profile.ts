import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import {
  Column,
  Entity,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Entity({ name: 'profile' })
export class Profile {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'text' })
  profileImage: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
