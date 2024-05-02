import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateCourseDto } from 'src/courses/controller/courses/dtos/UpdateCourse.dto';
import { Comment } from 'src/typeorm/entities/Comment';
import { Course } from 'src/typeorm/entities/Course';
import { Reply } from 'src/typeorm/entities/Reply';
import { CreateCommentParams, UpdateCommmentParams } from 'src/utils/type';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(Reply) private replyRepository: Repository<Reply>,
    @InjectRepository(Course) private courseRepository: Repository<Course>,
  ) {}

  async createComment(
    userId: number,
    courseId: number,
    createCommentDetail: CreateCommentParams,
  ) {
    const newComment = this.commentRepository.create({
      ...createCommentDetail,
      course: { id: courseId },
      user: { id: userId },
      createdAt: new Date(),
    });

    return this.commentRepository.save(newComment);
  }

  async getAllComments(): Promise<Comment[]> {
    return this.commentRepository.find({ relations: ['user', 'replies'] });
  }

  async updateComment(id: number, updateCommentDetail: UpdateCommmentParams) {
    const result = this.commentRepository.update(
      { id },
      { ...updateCommentDetail },
    );

    if ((await result).affected === 0) {
      throw new NotFoundException('Comment not found!');
    }
  }

  async deleteComment(id: number) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['replies'],
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    await this.replyRepository.delete({ comment });

    const result = await this.commentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Comment not found');
    }

    return result;
  }

  async getCommentsByCourseId(courseId: number): Promise<Comment[]> {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: [
        'comments',
        'comments.user',
        'comments.user.profile',
        'comments.replies',
        'comments.replies.user',
        'comments.replies.user.profile',
      ],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course.comments;
  }
}
