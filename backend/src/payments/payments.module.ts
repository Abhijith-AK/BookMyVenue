import { forwardRef, Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { BookingsModule } from 'src/bookings/bookings.module';

@Module({
  imports: [
    forwardRef(() => BookingsModule),
    TypeOrmModule.forFeature([Payment]), 
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService]
})
export class PaymentsModule {}
