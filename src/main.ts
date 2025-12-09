import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter, 
  PrismaExceptionFilter, 
  UncaughtExceptionFilter, 
  ZodExceptionFilter 
} from './error/exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
      const config = new DocumentBuilder()
    .setTitle('Booking System API')
    .setDescription('Rooms & bookings backend (owners, guests, admin)')
    .setVersion('1.0')
    .addBearerAuth() // because you’re using JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // docs at /api
    app.useGlobalFilters(
    new UncaughtExceptionFilter(),
    new HttpExceptionFilter(),
    new PrismaExceptionFilter(),
    new ZodExceptionFilter(),
  );
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
