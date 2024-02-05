import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Course } from '../../../typeorm/entities/Course';
import {
  CreateCorseParams,
  CreateVideoParams,
  UpdateCorseParams,
} from 'src/utils/type';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from 'src/typeorm/entities/Video';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course) private courseRepository: Repository<Course>,
    @InjectRepository(Video) private videoRepository: Repository<Video>,
  ) {}

  createCourse(courseDetail: CreateCorseParams): Promise<Course> {
    const newCourse = this.courseRepository.create({
      ...courseDetail,
      createdAt: new Date(),
    });
    return this.courseRepository.save(newCourse);
  }

  async getCourse(options?: any): Promise<Course[]> {
    return await this.courseRepository.find(options);
  }

  async updateCourse(id: number, updateCourseDetail: UpdateCorseParams) {
    await this.courseRepository.update({ id }, { ...updateCourseDetail });
  }

  async deleteCourse(id: number) {
    return this.courseRepository.delete({ id });
  }

  async createVideo(id: number, createVideoDetail: CreateVideoParams) {
    // const course = await this.courseRepository.findOneBy({ id });
    // if (!course) {
    //   throw new HttpException('Course cannot be found', HttpStatus.BAD_REQUEST);
    // }

    const newVideo = this.videoRepository.create({ ...createVideoDetail });
    return this.videoRepository.save(newVideo);
  }
}
