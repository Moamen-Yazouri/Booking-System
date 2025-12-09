import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './modules/auth/auth.guard';
import { RoomModule } from './modules/room/room.module';
import { BookingModule } from './modules/booking/booking.module';
import { RolesGuard } from './modules/auth/roles.guard';
import { UnifierInterceptor } from './interceptor/response.interceptor';
import { DatabaseModule } from './modules/database/database.module';


@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    RoomModule,
    BookingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: UnifierInterceptor,
    },
  ],
})
export class AppModule {}
