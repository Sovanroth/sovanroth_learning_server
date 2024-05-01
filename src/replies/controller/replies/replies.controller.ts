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
import { RepliesService } from 'src/replies/service/replies/replies.service';
import { CreateReplyDto } from './dtos/CreateReply.dto';
import { UpdateReplyDto } from './dtos/UpdateReply.dto';

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

  @Put('/update-reply/:id')
  async updateComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReplyDto: UpdateReplyDto,
  ) {
    try {
      const updateReply = await this.replyService.updateReply(
        id,
        updateReplyDto,
      );

      return {
        message: 'reply update successdully!',
        error: false,
        reply: updateReply,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          message: 'Reply not found!',
          error: true,
        };
      } else {
        return {
          message: 'Error updating reply',
          error: true,
        };
      }
    }
  }

  @Get('/get-all-replies')
  async getAllReplies() {
    const replies = await this.replyService.getAllReplies();
    return {
      error: false,
      data: replies,
    };
  }

  @Delete('/delete-reply/:id')
  async deleteReplyById(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.replyService.deleteReply(id);
      return {
        message: 'Reply deleted successfully',
        error: false,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          message: 'Reply not found!',
          error: true,
        };
      } else {
        return {
          message: 'Error deleting reply',
          error: true,
        };
      }
    }
  }
}
