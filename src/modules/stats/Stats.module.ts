import { Module } from '@nestjs/common';
import { StatsController } from './infra/controllers/Stats.controller';
import { GetStatsService } from './services/getStats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '@modules/appointments/typeorm/entities/Appointment.entity';
import { Schedule } from '@modules/schedules/typeorm/entities/schedule.entity';
import { Professional } from '@modules/professionals/typeorm/entities/professional.entity';
import { Patient } from '@modules/patients/typeorm/entities/patient.entity';
import { PersonSig } from '@modules/persosnSig/typeorm/entities/personSig.entity';
import { GatewaysModule } from '@shared/gateways/gateways.module';
import { EventsModule } from '@shared/events/Events.module';

const typeOrmModule = TypeOrmModule.forFeature([
  Appointment,
  Schedule,
  Professional,
  Patient,
  PersonSig,
]);

@Module({
  controllers: [StatsController],
  providers: [GetStatsService],
  imports: [typeOrmModule, GatewaysModule, EventsModule],
  exports: [],
})
export class StatsModule {}
