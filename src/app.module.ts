import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportModule } from './report/report.module';
// import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MailModule } from './mail/mail.module';
import { MailService } from './mail/mail.service';
import { MailController } from './mail/mail.controller';
import { ReportController } from './report/report.controller';
import { ReportService } from './report/report.service';



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
  
    ReportModule,
    MailModule, 
    // PrismaModule
  ],
  controllers: [AppController, MailController, ReportController],
  providers: [AppService, MailService, ReportService],
})
export class AppModule {}
