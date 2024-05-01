import { Module } from '@nestjs/common';
import { RepliesController } from './controller/replies/replies.controller';
import { RepliesService } from './service/replies/replies.service';
import { Reply } from 'src/typeorm/entities/Reply';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/typeorm/entities/Course';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Reply])],
  controllers: [RepliesController],
  providers: [RepliesService],
})
export class RepliesModule {}
