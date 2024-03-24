import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../typeorm/entities/User';
import { Repository } from 'typeorm';
import { Profile } from '../../../typeorm/entities/Profile';
import { CourseService } from '../../../courses/service/course/course.service';
import { Video } from '../../../typeorm/entities/Video';
import { Course } from '../../../typeorm/entities/Course';
import { CloudinaryService } from '../../../cloudinary/cloudinary.service';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let profileRepository: Repository<Profile>;
  let videoRepository: Repository<Video>;
  let courseRepository: Repository<Course>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        CloudinaryService,
        CourseService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Profile),
          useClass: Repository,
        },
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

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
