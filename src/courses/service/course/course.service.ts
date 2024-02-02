import { Injectable } from '@nestjs/common';
import { Course } from '../../../typeorm/entities/Course';
import { CreateCorseParams, UpdateCorseParams } from 'src/utils/type';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course) private courseRepository: Repository<Course>,
  ) {}

  createCourse(courseDetail: CreateCorseParams): Promise<Course> {
    const newCourse = this.courseRepository.create({
      ...courseDetail,
      createdAt: new Date(),
    });
    return this.courseRepository.save(newCourse);
  }

  getCourse() {
    return this.courseRepository.find();
  }

  async updateCourse(id: number, updateCourseDetail: UpdateCorseParams) {
    await this.courseRepository.update({ id }, { ...updateCourseDetail });
  }

  deleteCourse(id: number) {
    return this.courseRepository.delete({ id });
  }
}
