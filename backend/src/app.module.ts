import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { CourseModule } from './course/course.module';
import { StatsModule } from './stats/stats.module';
import { UserModule } from './user/user.module';
import { UserCourseEnrollmentModule } from './enrollment/enrollment.module';
import { MailService } from './mail/mail.service';
import { MailController } from './mail/mail.controller';
import { FavoritesService } from './favorites/favorites.service';
import { FavoritesModule } from './favorites/favorites.module';
import { ScriptsModule } from './scripts/scripts.module';
import { ReviewModule } from './review/review.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(),
    UserModule,
    AuthModule,
    CourseModule,
    ContentModule,
    StatsModule,
    ReviewModule,
    UserCourseEnrollmentModule,
    FavoritesModule,
    ScriptsModule,
  ],
  controllers: [MailController],
  providers: [MailService, FavoritesService],
})
export class AppModule {}
