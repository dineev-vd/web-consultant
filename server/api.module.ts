import { CalendarEvent } from '@common/models/CalendarEvent';
import { Comment } from '@common/models/Comment';
import { PendingEvent } from '@common/models/PendingEvent';
import { Report } from '@common/models/Report';
import { User } from '@common/models/User';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ReportsModule } from './reports/reports.module';
import { SchedulesModule } from './schedules/schedules.module';
import { UsersModule } from './users/users.module';

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
} = process.env;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: POSTGRES_HOST,
      port: +POSTGRES_PORT,
      username: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      database: POSTGRES_DB,
      entities: [CalendarEvent, Comment, PendingEvent, Report, User],
      synchronize: true,
    }),
    UsersModule,
    SchedulesModule,
    AuthModule,
    ReportsModule,
  ],
  controllers: [],
})
export class ApiModule {}
