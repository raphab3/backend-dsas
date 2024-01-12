import { Test, TestingModule } from '@nestjs/testing';
import { CreateAppointmentService } from './create.Appointment.service';

describe('CreateAppointmentService', () => {
  let service: CreateAppointmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateAppointmentService],
    }).compile();

    service = module.get<CreateAppointmentService>(CreateAppointmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
