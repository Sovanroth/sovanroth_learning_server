import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/typeorm/entities/Comment';
import { CommentsService } from './service/comments/comments.service';
import { CommentsController } from './controller/comments/comments.controller';
import { Reply } from 'src/typeorm/entities/Reply';
import { RepliesService } from 'src/replies/service/replies/replies.service';
import { Course } from 'src/typeorm/entities/Course';
import { User } from 'src/typeorm/entities/User';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Reply, Course, User])],
  providers: [CommentsService, RepliesService],
  controllers: [CommentsController],
})
export class CommentsModule {}
