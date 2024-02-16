import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CourseService } from 'src/courses/service/course/course.service';
import { CreateCourseDto } from './dtos/CreateCourse.dto';
import { identity, refCount } from 'rxjs';
import { UpdateCourseDto } from './dtos/UpdateCourse.dto';
import { UpdateVideoDto } from './dtos/UpdateVideo.dto';
import { stringify } from 'querystring';
import { CreateVideoDto } from './dtos/CreateVideo.dto';
import { STATUS_CODES } from 'http';
import { resourceUsage } from 'process';
import { UpdateVideoParams } from 'src/utils/type';

@Controller('courses')
export class CoursesController {
  constructor(private courseService: CourseService) {}

  @Post('/create-course')
  async createCourse(@Body() createCourseDto: CreateCourseDto) {
    try {
      const createdCourse =
        await this.courseService.createCourse(createCourseDto);
      return {
        error: false,
        message: 'Course Created!',
        course: {
          courseTitle: createdCourse.courseTitle,
          courseDescription: createdCourse.courseDescription,
          category: createdCourse.category,
          courseImage: createdCourse.courseImage,
          coursePrice: createdCourse.coursePrice,
          courseResource: createdCourse.courseResource,
          active: createdCourse.active,
          createdDate: createdCourse.createdAt,
        },
      };
    } catch (error) {
      return { error: true, message: 'Something went Wrong' };
    }
  }

  @Get('/get-all-course')
  async getAllCourses() {
    try {
      const courses = await this.courseService.getCourse({
        relations: ['videos'],
      });

      return {
        error: false,
        message: 'Get Successfully',
        data: courses,
      };
    } catch (error) {
      return {
        error: true,
        message: 'Error fetching courses',
        data: null,
      };
    }
  }

  @Put('/update-course/:id')
  async updateCourse(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    try {
      const updateCourse = await this.courseService.updateCourse(
        id,
        updateCourseDto,
      );
      console.log('updated');
      return {
        message: 'Course update successfully',
        error: false,
        course: updateCourse,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        console.log('notfound');
        return {
          message: 'Course not found',
          error: true,
        };
      } else {
        console.error('Error updating course: ', error.message);
        return {
          message: 'Error updating course!',
          error: true,
        };
      }
    }
  }

  @Delete('/delete-course/:id')
  async deleteCourseById(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.courseService.deleteCourse(id);
      return {
        message: 'Course deleted successfully',
        error: false,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        // console.error('Course not found:', error.message);
        return {
          message: 'Course not found',
          error: true,
        };
      } else {
        // console.error('Error deleting course:', error.message);
        return {
          message: 'Error deleting course',
          error: true,
        };
      }
    }
  }

  @Post('/post-video/:id')
  async createVideo(
    @Param('id', ParseIntPipe) id: number,
    @Body() createVideoDto: CreateVideoDto,
  ) {
    try {
      await this.courseService.createVideo(id, createVideoDto);
      return {
        error: false,
        message: 'Video created successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        // Course ID not found
        return {
          error: true,
          message: 'Course not found',
        };
      } else {
        // Other errors
        return {
          error: true,
          message: 'Error creating video',
        };
      }
    }
  }

  @Delete('/delete-course-video/:id')
  async deleteVideoById(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.courseService.deleteCourseVideo(id);
      return {
        message: 'Video deleted successfully',
        error: false,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          message: 'Video not found',
          error: true,
        };
      } else {
        return {
          message: 'Error deleting course',
          error: true,
        };
      }
    }
  }

  @Get('/get-all-videos')
  async getAllVideos() {
    try {
      const videos = await this.courseService.getVideo();

      return {
        error: false,
        message: 'Get Successfully',
        data: videos,
      };
    } catch (error) {
      return {
        error: true,
        message: 'Error getting videos',
        data: null,
      };
    }
  }

  @Put('/update-video/:id')
  async updateVideo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVideoDto: UpdateVideoDto,
  ) {
    try {
      const updateVideo = await this.courseService.updateVideo(
        id,
        updateVideoDto,
      );

      return {
        message: 'video update successfully',
        error: false,
        course: updateVideo,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          message: 'Video not found',
          error: true,
        };
      } else {
        return {
          message: 'Error updating Video',
          error: true,
        };
      }
    }
  }
}
