import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
console.log(
  'DB URL:',
  (process.env.DATABASE_URL || '').replace(/:(\/\/.*?:)(.*?)(@)/, '$1***$3'),
);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
