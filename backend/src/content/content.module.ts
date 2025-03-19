import { forwardRef, Module } from '@nestjs/common';

import { CourseModule } from '../course/course.module';
import { ContentService } from './content.service';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [forwardRef(() => CourseModule), forwardRef(() => UploadModule)],
  controllers: [],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
