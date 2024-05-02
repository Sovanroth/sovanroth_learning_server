import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CommentsService } from 'src/comments/service/comments/comments.service';
import { CreateComment } from './dtos/CreateComment.dto';
import { UpdateCommmentDto } from './dtos/UpdateComment.dto';
import { Comment } from 'src/typeorm/entities/Comment';

@Controller('comments')
export class CommentsController {
  constructor(private commentService: CommentsService) {}

  @Post('/create-comment/:userId/:id')
  async createComment(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() createCommentDto: CreateComment,
  ) {
    try {
      await this.commentService.createComment(userId, id, createCommentDto);
      return {
        error: false,
        message: 'Comment created successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          error: true,
          message: 'Course not found',
        };
      } else {
        return {
          error: true,
          message: 'Error creating comment',
        };
      }
    }
  }

  @Get('/get-all-comments')
  async getAllComments() {
    const comments = await this.commentService.getAllComments();
    return {
      error: false,
      data: comments,
    };
  }

  @Put('/upadte-comment/:id')
  async updateComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommmentDto,
  ) {
    try {
      const updateComment = await this.commentService.updateComment(
        id,
        updateCommentDto,
      );

      return {
        message: 'comment update succesfully',
        error: false,
        comment: updateComment,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          message: 'Comment not found!',
          error: true,
        };
      } else {
        return {
          message: 'Error updating comment!',
          error: true,
        };
      }
    }
  }

  @Delete('/delete-comment/:id')
  async deletCommmentById(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.commentService.deleteComment(id);
      return {
        message: 'Comment deleted successfully!',
        error: false,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        return {
          message: 'Comment not found!',
          error: true,
        };
      } else {
        return {
          message: 'Error Deleting comment!',
          error: true,
        };
      }
    }
  }

  @Get('/get-comment-by-course-id/:courseId')
  async getCommentsByCourseId(
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    try {
      const comments =
        await this.commentService.getCommentsByCourseId(courseId);
      return {
        error: false,
        message: 'Get successfully!',
        data: comments,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        return {
          error: true,
          message: 'Course Not Found!',
        };
      }
      return {
        error: true,
        message: 'Internal Server Error!',
      };
    }
  }
}
