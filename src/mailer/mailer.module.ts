import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerController } from './mailer.controller';
import { AvailableNowService } from 'src/available/available-now.service';
import { AvailableNowModule } from 'src/available/available-now.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvailabeNow } from 'src/entities/availableNow.entity';

@Module({
  imports: [AvailableNowModule],
  providers: [MailerService],
  controllers: [MailerController],
  exports: [MailerService]
})
export class MailerModule {}
