import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reply } from 'src/typeorm/entities/Reply';
import { CreateReplyParams, UpadteReplyParams } from 'src/utils/type';
import { Repository } from 'typeorm';

@Injectable()
export class RepliesService {
  constructor(
    @InjectRepository(Reply) private replyRepository: Repository<Reply>,
  ) {}

  async createReply(
    userId: number,
    commentId: number,
    createReplyDetail: CreateReplyParams,
  ) {
    const newReply = this.replyRepository.create({
      ...createReplyDetail,
      comment: { id: commentId },
      user: { id: userId },
      createdAt: new Date(),
    });

    return this.replyRepository.save(newReply);
  }

  async updateReply(id: number, updateReplyDetail: UpadteReplyParams) {
    const result = this.replyRepository.update(
      { id },
      { ...updateReplyDetail },
    );

    if ((await result).affected === 0) {
      throw new NotFoundException('reply not found');
    }
    return result;
  }

  async getAllReplies(): Promise<Reply[]> {
    return this.replyRepository.find({ relations: ['user'] });
  }

  async deleteReply(id: number) {
    const result = await this.replyRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('Reply not found');
    }

    return result;
  }
}
