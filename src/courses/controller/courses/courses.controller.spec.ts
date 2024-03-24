import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './courses.controller';
import { CourseService } from '../../service/course/course.service';
import { CloudinaryService } from '../../../cloudinary/cloudinary.service';
import { Video } from '../../../typeorm/entities/Video';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Course } from '../../../typeorm/entities/Course';

describe('CoursesController', () => {
  let controller: CoursesController;
  let videoRepository: Repository<Video>;
  let courseRepository: Repository<Course>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [
        CourseService,
        CloudinaryService,
        {
          provide: getRepositoryToken(Video),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Course),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<CoursesController>(CoursesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
