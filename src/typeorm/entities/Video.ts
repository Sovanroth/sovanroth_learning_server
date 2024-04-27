import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Course } from './Course';

@Entity({ name: 'videos' })
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  video_title: string;

  @Column()
  video_url: string;

  @Column()
  video_description: string;

  @Column()
  video_resource: string;

  @ManyToOne(() => Course, (course) => course.videos)
  course: Course;
}
