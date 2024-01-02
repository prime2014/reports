import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { ReportService } from 'src/report/report.service';

@Module({
  controllers: [MailController],
  providers: [MailService, ReportService]
})
export class MailModule {}
