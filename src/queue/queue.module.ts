import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { LeadsModule } from 'src/leads/leads.module';

@Module({
  imports: [
    BullModule.forRoot({ connection: { host: 'localhost', port: 6379 } }),
    BullModule.registerQueue({ name: 'leads' }, LeadsModule),
  ],
  providers: [],
  exports: [],
})
export class QueueModule {}
