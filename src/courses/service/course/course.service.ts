import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Course } from '../../../typeorm/entities/Course';
import {
  CreateCorseParams,
  CreateVideoParams,
  UpdateCorseParams,
  UpdateVideoParams,
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
    const result = this.courseRepository.update(
      { id },
      { ...updateCourseDetail },
    );

    if ((await result).affected === 0) {
      throw new NotFoundException('Course not found!');
    }
  }

  async deleteCourse(id: number) {
    const result = await this.courseRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException('Course not found');
    }
    return result;
  }

  async createVideo(courseId: number, createVideoDetail: CreateVideoParams) {
    const newVideo = this.videoRepository.create({
      ...createVideoDetail,
      course: { id: courseId }, // Associate the video with the course
    });
    return this.videoRepository.save(newVideo);
  }

  async deleteCourseVideo(id: number) {
    const result = await this.videoRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException('Video not found');
    }
    return result;
  }

  async getVideo(options?: any): Promise<Video[]> {
    return await this.videoRepository.find(options);
  }

  async updateVideo(id: number, updateVideoDetail: UpdateVideoParams) {
    const result = this.videoRepository.update(
      { id },
      { ...updateVideoDetail },
    );

    if ((await result).affected === 0) {
      throw new NotFoundException('Video not found');
    }
    return result;
  }
}
