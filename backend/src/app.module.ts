import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { VenuesModule } from './venues/venues.module';
import { BookingsModule } from './bookings/bookings.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsModule } from './payments/payments.module';
import { ScheduleModule } from '@nestjs/schedule';
import {ConfigModule} from "@nestjs/config"
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: Number(process.env.PG_DB_PORT!),
      username: process.env.PG_DB_UNAME!,
      password: process.env.PG_DB_PASS!,
      database: process.env.PG_DB_NAME!,
      autoLoadEntities: true,
      synchronize: true
    }),
    UsersModule,
    VenuesModule,
    BookingsModule,
    PaymentsModule,
    ReviewsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
