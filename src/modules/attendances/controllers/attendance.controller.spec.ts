import { CreateAttendanceService } from '../../services/create.attendance.service';
import { FindAllAttendanceService } from '../../services/findAll.attendance.service';
import { FindOneAttendanceService } from '../../services/findOne.attendance.service';
import { RemoveAttendanceService } from '../../services/remove.attendance.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateAttendanceService } from '../../services/update.attendance.service';
import { AttendanceController } from './attendance.controller';

describe('AttendanceController', () => {
  let controller: AttendanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceController],
      providers: [
        CreateAttendanceService,
        FindAllAttendanceService,
        FindOneAttendanceService,
        UpdateAttendanceService,
        RemoveAttendanceService,
      ],
    }).compile();

    controller = module.get<AttendanceController>(AttendanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
