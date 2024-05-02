import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/typeorm/entities/Comment';
import { CommentsService } from './service/comments/comments.service';
import { CommentsController } from './controller/comments/comments.controller';
import { Reply } from 'src/typeorm/entities/Reply';
import { RepliesService } from 'src/replies/service/replies/replies.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Reply])],
  providers: [CommentsService, RepliesService],
  controllers: [CommentsController],
})
export class CommentsModule {}
