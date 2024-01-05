// mail.module.ts
import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { ReportService } from '../../src/report/report.service';
import { MailTask } from './mail.task';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [MailController],
  providers: [MailService, ReportService, MailTask]
})
export class MailModule {}

