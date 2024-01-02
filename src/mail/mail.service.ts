import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as nodemailer from "nodemailer";
import * as handlebars from "handlebars";
import * as fs from "fs";
import { ReportService } from 'src/report/report.service';
import { pipe } from 'rxjs';

@Injectable()
export class MailService {
    private transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: 'laytext.co@gmail.com',
            pass: 'sbgt dvtv phir nayd',
        },
        debug: true
    })
    constructor(private readonly reportService: ReportService) {}

    async sendEndOfDayReport(): Promise<string|any> {
        const templateData = {subject: "Welcome", message: "Thank you for using our application!"}
        const templatePath = "./src/templates/endOfDay.hbs";
        const template = fs.readFileSync(templatePath, "utf-8");
        const compiledTemplate = handlebars.compile(template)
        const html = compiledTemplate(templateData)
        try {
            let response = await this.transporter.sendMail({
                from: "laytext.co@gmail.com",
                to: ["omondiprime@gmail.com", "omondipro@gmail.com", "primesoftwarewizard@gmail.com"],
                subject: "End Of Day Report",
                html: html,
                attachments: [
                    {
                        filename: "End_of_day_report.pdf",
                        content: await this.reportService.generatePDF(),
                        contentType: "application/pdf",
                        encoding: "base64",
                        contentDisposition: 'attachment',
                        cid: 'pdfAttachment',
                    }
                ]
            }).catch(error=>{
                throw error;
            })
            console.log(response)
            console.log("Email sent successfully");
            if (response) return "Email sent successfully!"
        } catch(error) {
            console.error("Error sending email: ", error)
            return error;
        }
        
    }
}
