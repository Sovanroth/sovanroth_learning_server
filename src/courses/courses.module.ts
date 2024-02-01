import { Module } from '@nestjs/common';
import { CourseService } from './service/course/course.service';
import { CoursesController } from './controller/courses/courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/typeorm/entities/Course';

@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  providers: [CourseService],
  controllers: [CoursesController]
})
export class CoursesModule {}
