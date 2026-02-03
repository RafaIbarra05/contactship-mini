import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LeadsModule } from 'src/leads/leads.module';
import { SyncService } from './sync.service';
@Module({
  imports: [ScheduleModule.forRoot(), LeadsModule],
  providers: [SyncService],
})
export class SyncModule {}
