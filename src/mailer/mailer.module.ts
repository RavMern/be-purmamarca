import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerController } from './mailer.controller';
import { AvailableNowModule } from 'src/available/available-now.module';

@Module({
  imports: [AvailableNowModule],
  providers: [MailerService],
  controllers: [MailerController],
  exports: [MailerService],
})
export class MailerModule {}
