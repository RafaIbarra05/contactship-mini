import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeadsModule } from './leads/leads.module';
import { AuthModule } from './auth/auth.module';
import { SyncModule } from './sync/sync.module';
import { AiModule } from './ai/ai.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [LeadsModule, AuthModule, SyncModule, AiModule, QueueModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
