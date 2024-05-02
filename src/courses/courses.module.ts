import { Module } from '@nestjs/common';
import { CourseService } from './service/course/course.service';
import { CoursesController } from './controller/courses/courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/typeorm/entities/Course';
import { Video } from 'src/typeorm/entities/Video';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Comment } from 'src/typeorm/entities/Comment';
import { CommentsService } from 'src/comments/service/comments/comments.service';
import { UserService } from 'src/users/service/user/user.service';
import { User } from 'src/typeorm/entities/User';
import { Profile } from 'src/typeorm/entities/Profile';
import { Reply } from 'src/typeorm/entities/Reply';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, Video, Comment, User, Profile, Reply]),
  ],
  providers: [CourseService, CloudinaryService, CommentsService, UserService],
  controllers: [CoursesController],
})
export class CoursesModule {}
