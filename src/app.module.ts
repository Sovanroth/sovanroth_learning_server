import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
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
import { UsersController } from './users/controller/users/users.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'sovanroth_learning_server',
      entities: [User, Course, Video],
      synchronize: true,
    }),
    UsersModule,
    CoursesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(CoursesController, UsersController);
  }
}
