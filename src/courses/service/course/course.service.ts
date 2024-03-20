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

  async getCourseById(id: number): Promise<Course | undefined> {
    const course = await this.courseRepository.findOne({ where: { id } });

    if (course) {
      const videos = await this.videoRepository.find({
        where: { course: { id: course.id } },
      });
      course.videos = videos;
    }

    return course;
  }

  async getCourseByActiveStatus(options?: any): Promise<Course[]> {
    const active = 1;
    const courses = await this.courseRepository.find({ where: { active } });

    for (const course of courses) {
      const videos = await this.videoRepository.find({
        where: { course: { id: course.id } },
      });
      course.videos = videos;
    }

    return courses;
  }

  async searchCourse(options?: any): Promise<Course[]> {
    const active = 1;
    const courses = await this.courseRepository.find(options);
    return courses;
  }

  async findByCategory(categoryId: number): Promise<Course[]> {
    const courses = await this.courseRepository.find({
      where: { category: categoryId, active: 1 },
      relations: ['videos'],
    });

    return courses;
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
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['videos'],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    await Promise.all(
      course.videos.map(async (video) => {
        await this.courseRepository.manager.remove(video);
      }),
    );

    const result = await this.courseRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Course not found');
    }
    return result;
  }

  async createVideo(courseId: number, createVideoDetail: CreateVideoParams) {
    const newVideo = this.videoRepository.create({
      ...createVideoDetail,
      course: { id: courseId },
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
