import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reply } from 'src/typeorm/entities/Reply';
import { CreateReplyParams } from 'src/utils/type';
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
}
