import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
