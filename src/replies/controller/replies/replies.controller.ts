import {
  Body,
  Controller,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { RepliesService } from 'src/replies/service/replies/replies.service';
import { CreateReplyDto } from './dtos/CreateReply.dto';

@Controller('replies')
export class RepliesController {
  constructor(private replyService: RepliesService) {}

  @Post('/create-reply/:userId/:id')
  async createCommnet(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() createReplyDto: CreateReplyDto,
  ) {
    try {
      await this.replyService.createReply(userId, id, createReplyDto);
      return {
        error: false,
        message: 'Reply created successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          error: true,
          message: 'Comment not found!',
        };
      } else {
        return {
          error: true,
          message: 'Error creating reply',
        };
      }
    }
  }
}
