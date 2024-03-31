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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'server.decapsoul.one',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'lms',

      // host: 'localhost',
      // port: 3306,
      // username: 'root',
      // password: null,
      // database: 'sovanroth_learning_server',
      entities: [User, Course, Video, UserCourse, Profile],
      synchronize: true,
    }),
    UsersModule,
    CoursesModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(CoursesController, '/users/auth/get-user-by-id/:id');
    // "/users/buy-course"
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
