import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { CourseModule } from './course/course.module';
import { StatsModule } from './stats/stats.module';
import { UserModule } from './user/user.module';
import { RankingModule } from './ranking/ranking.module';
import { UserCourseEnrollmentModule } from './enrollment/enrollment.module';
import { MailService } from './mail/mail.service';
import { MailController } from './mail/mail.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(),
    UserModule,
    AuthModule,
    CourseModule,
    ContentModule,
    StatsModule,
    RankingModule,
    UserCourseEnrollmentModule,
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class AppModule {}
