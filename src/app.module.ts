import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/User';
// import { User } from './typeorm/entities/User';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { Course } from './typeorm/entities/Course';
import { Video } from './typeorm/entities/Video';
import { LoggerMiddleware } from './users/middlewares/validate-user.middleware';
import { CoursesController } from './courses/controller/courses/courses.controller';
import { UserCourse } from './typeorm/entities/UserCourse';
import { Profile } from './typeorm/entities/Profile';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UsersController } from './users/controller/users/users.controller';
import { CommentsService } from './comments/service/comments/comments.service';
import { CommentsController } from './comments/controller/comments/comments.controller';
import { CommentsModule } from './comments/comments.module';
import { Comment } from './typeorm/entities/Comment';
import { Reply } from './typeorm/entities/Reply';
import { RepliesModule } from './replies/replies.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '54.179.61.30',
      port: 3306,
      username: 'root',
      password: 'myDb@20240$',
      database: 'lms',

      // host: 'localhost',
      // port: 8889,
      // username: 'root',
      // password: 'root',
      entities: [User, Course, Video, UserCourse, Profile, Comment, Reply],
      // database: 'sovanroth_learning_server',
      synchronize: true,
    }),
    UsersModule,
    CoursesModule,
    CloudinaryModule,
    CommentsModule,
    RepliesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(CoursesController);
    consumer
      .apply(LoggerMiddleware)
      .exclude(
        { path: 'users/auth/signup', method: RequestMethod.ALL },
        { path: 'users/auth/login', method: RequestMethod.ALL },
        { path: 'users/auth/forgot-password', method: RequestMethod.ALL },
        { path: 'users/auth/reset-password', method: RequestMethod.ALL },
      )
      .forRoutes(UsersController);
  }
}

// TypeOrmModule.forRoot({
//   type: 'mysql',
//   host: 'localhost',
//   port: 3306,
//   username: 'root',
//   password: null,
//   database: 'sovanroth_learning_server',
//   entities: [User, Course, Video, UserCourse, Profile],
//   synchronize: true,
// }),
