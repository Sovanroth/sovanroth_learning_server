import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CourseService {
  // constructor(
  //   @InjectRepository(Course) private courseRepository: Repository<Course>,
  // ) {}

  // createCourse(courseDetail: CreateCorseParams): Promise<Course> {
  //   const newCourse = this.courseRepository.create({
  //     ...courseDetail,
  //     createdAt: new Date(),
  //   });
  //   return this.courseRepository.save(newCourse);
  // }
}
