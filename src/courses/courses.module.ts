import { Module } from '@nestjs/common';
import { CourseService } from './service/course/course.service';
import { CoursesController } from './controller/courses/courses.controller';

@Module({
  providers: [CourseService],
  controllers: [CoursesController]
})
export class CoursesModule {}
