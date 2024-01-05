// mail.service.ts
import { Injectable } from '@nestjs/common';
import * as fs from "fs";
import { ReportService } from '../../src/report/report.service';
import { ConfigService } from '@nestjs/config';
import * as sgMail from "@sendgrid/mail";
import { Readable } from 'stream';
import * as amqp from "amqplib/callback_api"

@Injectable()
export class MailService {
    
    constructor(private readonly reportService: ReportService, private readonly configService: ConfigService) {
        sgMail.setApiKey(this.configService.get<string>("sendgrid.apiKey"))
    }

    async sendEndOfDayReport(recipient: string): Promise<string> {
        const templateData = {subject: "Welcome", message: "Thank you for using our application!"}
        const templatePath = "./src/templates/endOfDay.html";
        const htmlTemplate = fs.readFileSync(templatePath, "utf-8");
        const mergedContent = this.mergeTemplateWithData(htmlTemplate, templateData)
        try {
            
            const attachmentContent = await this.streamToBase64(await this.reportService.generatePDF());
            const queueUrl = this.configService.get<string>("RABBITMQ_QUEUE_URL")

            const msg = {
                to: recipient,
                from: "sage.prime@mail.com",
                subject: "End Of Day Report",
                html: mergedContent,
                attachmentContent
            }

            amqp.connect(queueUrl, (error0, connection)=> {
                if (error0) throw(error0);

                connection.createChannel((error1, channel)=> {
                    if (error1) throw(error1);

                    const queue = "email_queue";

                    channel.assertQueue(queue, {
                        durable: true
                    })

                    channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)), {
                        persistent: true
                    })
                })

                setTimeout(()=>{
                    connection.close()
                }, 5000)
            })
            return "Emails are queued to be delivered"
        } catch(error) {
            console.error("Error sending email: ", error)
            return error;
        }
        
    }

    private async streamToBase64(stream: Readable): Promise<string> {
        return new Promise((resolve, reject) => {
          const chunks: Buffer[] = [];
          stream.on('data', (chunk) => chunks.push(chunk));
          stream.on('end', () => resolve(Buffer.concat(chunks).toString('base64')));
          stream.on('error', reject);
        });
      }

    private mergeTemplateWithData(template: string, data: Record<string, string>): string {
        // Replace variables in the template with actual data
        Object.keys(data).forEach(key => {
          const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
          template = template.replace(regex, data[key]);
        });
    
        return template;
      }
}


