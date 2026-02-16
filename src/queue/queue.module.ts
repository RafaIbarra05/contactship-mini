import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { LeadsModule } from 'src/leads/leads.module';
import { SummarizeLeadProcessor } from './processors.ts/summarize.processor';

@Module({
  imports: [
    BullModule.forRoot({ connection: { host: 'localhost', port: 6379 } }),
    BullModule.registerQueue({ name: 'leads' }),
    LeadsModule,
  ],
  providers: [SummarizeLeadProcessor],
  exports: [BullModule],
})
export class QueueModule {}
