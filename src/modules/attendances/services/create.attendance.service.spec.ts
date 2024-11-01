import { Test, TestingModule } from '@nestjs/testing';
import { CreateAttendanceService } from './create.attendance.service';

describe('CreateAttendanceService', () => {
  let service: CreateAttendanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateAttendanceService],
    }).compile();

    service = module.get<CreateAttendanceService>(CreateAttendanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
