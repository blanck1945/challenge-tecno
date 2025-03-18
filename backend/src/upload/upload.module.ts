import { forwardRef, Module } from '@nestjs/common';

import { CourseModule } from '../course/course.module';
import { UploadService } from './upload.service';

@Module({
  imports: [forwardRef(() => CourseModule)],
  controllers: [],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
