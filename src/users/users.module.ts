import { Module } from '@nestjs/common';
import { UsersController } from './controller/users/users.controller';
import { UserService } from './service/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Course } from 'src/typeorm/entities/Course';
import { CourseService } from 'src/courses/service/course/course.service';
import { Video } from 'src/typeorm/entities/Video';

@Module({
  imports: [TypeOrmModule.forFeature([User, Course, Video])],
  controllers: [UsersController],
  providers: [UserService, CourseService]
})
export class UsersModule {}
