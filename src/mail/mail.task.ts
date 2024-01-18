import { Controller, Res, Get, Injectable } from '@nestjs/common';
import { MailService } from './mail.service';
import { Response } from 'express';
import { Cron, CronExpression } from '@nestjs/schedule';
const path = require("path")

@Injectable()
export class MailTask {
    constructor(private readonly mailService: MailService){}

    @Cron("0 0 18 * * 1-5", {
        timeZone: "Africa/Nairobi"
    })
    async sendClientEmail(@Res() res: Response) {
        let emails = ["omondiprime@gmail.com", "primesoftwarewizard@gmail.com", "omondipro@gmail.com"]
        try {
            let response = await this.mailService.sendEndOfDayReport(emails)

            return response;
        } catch(error) {
            return error;
        }
    }

}


