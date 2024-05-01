import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from './Comment';
import { User } from './User';

@Entity({ name: 'reply' })
export class Reply {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'text' })
  replyData: string;

  @Column()
  createdAt: Date;

  @ManyToOne(() => Comment, (comment) => comment.replies)
  comment: Comment;

  @ManyToOne(() => User, (user) => user.replies)
  user: User;
}
