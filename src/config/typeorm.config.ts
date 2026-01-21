import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: configService.getOrThrow<string>('DATABASE_URL'),
  autoLoadEntities: true,
  synchronize: true,
  ssl: false,
  extra: {
    ssl: { rejectUnauthorized: false },
  },
});
