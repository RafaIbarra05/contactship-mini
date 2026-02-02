import { Module } from '@nestjs/common';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';

@Module({
  providers: [ApiKeyGuard],
  exports: [ApiKeyGuard],
})
export class AuthModule {}
