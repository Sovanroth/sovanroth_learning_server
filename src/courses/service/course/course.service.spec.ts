import { Test, TestingModule } from '@nestjs/testing';
import { CourseService } from './course.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Course } from '../../../typeorm/entities/Course';
import { Video } from '../../../typeorm/entities/Video';
import { Repository } from 'typeorm';

describe('CourseService', () => {
  let service: CourseService;
  let courseRepository: Repository<Course>;
  let videoRepository: Repository<Video>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        {
          provide: getRepositoryToken(Course),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Video),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CourseService>(CourseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
