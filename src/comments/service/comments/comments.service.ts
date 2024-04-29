import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateCourseDto } from 'src/courses/controller/courses/dtos/UpdateCourse.dto';
import { Comment } from 'src/typeorm/entities/Comment';
import { CreateCommentParams, UpdateCommmentParams } from 'src/utils/type';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
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
    return this.commentRepository.find({ relations: ['user'] });
  }

  async updateComment(id: number, updateCommentDetail: UpdateCommmentParams) {
    const result = this.commentRepository.update(
      { id },
      { ...updateCommentDetail },
    );

    if ((await result).affected === 0) {
      throw new NotFoundException('Course not found!');
    }
  }

  async deleteComment(id: number) {
    const result = await this.commentRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('COmment not found');
    }

    return result;
  }
}
