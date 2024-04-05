import { Module } from '@nestjs/common';
import { StatsController } from './infra/controllers/Stats.controller';
import { GetStatsService } from './services/getStats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '@modules/appointments/typeorm/entities/Appointment.entity';
import { Schedule } from '@modules/schedules/typeorm/entities/schedule.entity';

const typeOrmModule = TypeOrmModule.forFeature([Appointment, Schedule]);

@Module({
  controllers: [StatsController],
  providers: [GetStatsService],
  imports: [typeOrmModule],
  exports: [],
})
export class StatsModule {}
