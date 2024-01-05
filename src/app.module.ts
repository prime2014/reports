import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportModule } from './report/report.module';
// import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { MailService } from './mail/mail.service';
import { MailController } from './mail/mail.controller';
import { ReportController } from './report/report.controller';
import { ReportService } from './report/report.service';
import sendgridConfig from './sendgrid.config';
import { ScheduleModule } from "@nestjs/schedule";


@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      load: [sendgridConfig]
    }),
    ScheduleModule.forRoot(),
    ReportModule,
    MailModule, 
    // PrismaModule
  ],
  controllers: [AppController, MailController, ReportController],
  providers: [AppService, MailService, ReportService],
})
export class AppModule {}
