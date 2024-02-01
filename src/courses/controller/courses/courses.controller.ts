import { Body, Controller, Post } from '@nestjs/common';
import { CourseService } from 'src/courses/service/course/course.service';
import { CreateCourseDto } from './dtos/CreateCourse.dto';

@Controller('courses')
export class CoursesController {
  constructor(private courseService: CourseService) {}

  // @Post('/create-course')
  // async createCourse(@Body() createCourseDto: CreateCourseDto) {
  //   try {
  //     const createdCourse =
  //       await this.courseService.createCourse(createCourseDto);
  //     return {
  //       error: false,
  //       message: 'Account Created!',
  //       user: {
  //         courseTitle: createdCourse.courseTitle,
  //         courseDescription: createdCourse.courseDescription,
  //         category: createdCourse.category,
  //         courseImage: createdCourse.courseImage,
  //         coursePrice: createdCourse.coursePrice,
  //         courseResource: createdCourse.courseResource,
  //         active: createdCourse.active,
  //         createdDate: createdCourse.createdAt,
  //       },
  //     };
  //   } catch (error) {
  //     return { error: true, message: 'Something went Wrong' };
  //   }
  // }
}
