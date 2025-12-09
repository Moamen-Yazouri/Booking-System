import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter, 
  PrismaExceptionFilter, 
  UncaughtExceptionFilter, 
  ZodExceptionFilter 
} from './error/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
    
    app.useGlobalFilters(
    new UncaughtExceptionFilter(),
    new HttpExceptionFilter(),
    new PrismaExceptionFilter(),
    new ZodExceptionFilter(),
  );
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
