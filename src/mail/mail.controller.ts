import { Controller, Res, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Response } from 'express';
const path = require("path")

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService){}

    @Get("/send")
    async sendClientEmail(@Res() res: Response) {
        try {
            let response = await this.mailService.sendEndOfDayReport()

            return response;
        } catch(error) {
            return error;
        }
    }
}
