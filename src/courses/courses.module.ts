import { Module } from '@nestjs/common';
import { CourseService } from './service/course/course.service';
import { CoursesController } from './controller/courses/courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/typeorm/entities/Course';
import { Video } from 'src/typeorm/entities/Video';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Video])],
  providers: [CourseService, CloudinaryService],
  controllers: [CoursesController]
})
export class CoursesModule {}
