import { CreateAppointmentService } from '../../services/create.Appointment.service';
import { FindAllAppointmentService } from '../../services/findAll.Appointment.service';
import { FindOneAppointmentService } from '../../services/findOne.Appointment.service';
import { RemoveAppointmentService } from '../../services/remove.Appointment.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateAppointmentService } from '../../services/update.Appointment.service';
import { AppointmentController } from './Appointment.controller';

describe('AppointmentController', () => {
  let controller: AppointmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentController],
      providers: [
        CreateAppointmentService,
        FindAllAppointmentService,
        FindOneAppointmentService,
        UpdateAppointmentService,
        RemoveAppointmentService,
      ],
    }).compile();

    controller = module.get<AppointmentController>(AppointmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
