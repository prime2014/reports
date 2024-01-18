// mail.controller.ts
import { Controller, Res, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Response } from 'express';
const path = require("path")

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService){}

    @Get("/send")
    async sendClientEmail(@Res() res: Response) {
        const recipients = ["omondiprime@gmail.com", "primesoftwarewizard@gmail.com", "omondipro@gmail.com"];
        try {
            await this.mailService.sendEndOfDayReport(recipients)
                

            console.log('Bulk emails sent successfully');
            return res.status(200).send('Bulk Emails with Attachment added to the queue successfully');
        } catch(error) {
            console.error('Error sending emails:', error);
            return res.status(500).send('Failed to send emails');
        }
    }
}

