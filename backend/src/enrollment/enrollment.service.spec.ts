import { Test, TestingModule } from '@nestjs/testing';
import { UserCourseEnrollmentService } from './enrollment.service';

describe('EnrollmentService', () => {
  let service: UserCourseEnrollmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserCourseEnrollmentService],
    }).compile();

    service = module.get<UserCourseEnrollmentService>(
      UserCourseEnrollmentService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
