import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UserService } from '../../service/user/user.service';
import { CloudinaryService } from '../../../cloudinary/cloudinary.service';
import { User } from '../../../typeorm/entities/User';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Profile } from '../../../typeorm/entities/Profile';
import { CourseService } from '../../../courses/service/course/course.service';
import { Video } from '../../../typeorm/entities/Video';
import { Course } from '../../../typeorm/entities/Course';

describe('UsersController', () => {
  let controller: UsersController;
  let userRepository: Repository<User>;
  let profileRepository: Repository<Profile>;
  let videoRepository: Repository<Video>;
  let courseRepository: Repository<Course>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
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

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
