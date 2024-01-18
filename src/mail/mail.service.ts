// mail.service.ts
import { Injectable } from '@nestjs/common';
import * as fs from "fs";
import { ReportService } from '../../src/report/report.service';
import { ConfigService } from '@nestjs/config';
import * as sgMail from "@sendgrid/mail";
import { Readable } from 'stream';
import * as amqp from "amqplib/callback_api";
import * as base85 from "base85";


@Injectable()
export class MailService {
    
    constructor(private readonly reportService: ReportService, private readonly configService: ConfigService) {
        // sgMail.setApiKey(this.configService.get<string>("sendgrid.apiKey"))
    }


    // Function to convert a Readable stream to a Buffer
    async streamToBuffer(stream: Readable): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const chunks: Buffer[] = [];
            stream.on('data', (chunk) => chunks.push(chunk));
            stream.on('end', () => resolve(Buffer.concat(chunks)));
            stream.on('error', reject);
        });
    }

    async sendEndOfDayReport(recipients: string[]): Promise<string> {
        const templateData = {subject: "Welcome", message: "Thank you for using our application!"}
        const templatePath = "./src/templates/endOfDay.html";
        const htmlTemplate = fs.readFileSync(templatePath, "utf-8");
        const mergedContent = this.mergeTemplateWithData(htmlTemplate, templateData)
        
        const queueUrl = this.configService.get<string>("RABBITMQ_QUEUE_URL")

        try {

            let pdfTransformPromises = recipients.map(async recipient=>{
                const pdfTransform = await this.reportService.generatePDF()
                
                const attachmentContent = await this.streamToBase64(pdfTransform)
    
                return {
                    to: recipient,
                    from: "info@stanbestgroup.com",
                    subject: "End of Day Report",
                    message: mergedContent,
                    attachmentContent,
                    requestSource: "IsaleApp" 
                }
            })

            let messages = await Promise.all(pdfTransformPromises)

            const connection = await this.connectToQueue(queueUrl)

            await Promise.all(
                messages.map(async msg=>{
                    console.log(msg)
                    await this.sendMessageToQueue(connection, msg)
                })
            )

            await this.closeConnection(connection)
            
            return "Emails are queued to be delivered"
            
        } catch(error) {
            console.error("Error sending email: ", error)
            return error;
        }
        
    }


    private async connectToQueue(queueUrl: string): Promise<any> {
        return new Promise((resolve, reject) => {
            amqp.connect(queueUrl, (error, connection) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(connection);
                }
            });
        });
    }

    private async createChannel(connection: any): Promise<any> {
        return new Promise((resolve, reject) => {
            connection.createChannel((error, channel) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(channel);
                }
            });
        });
    }

    private async sendMessageToQueue(connection: any, msg: any): Promise<void> {
        const channel = await this.createChannel(connection);
        const queue = "email_queue";
    
        channel.assertQueue(queue, {
            durable: true,
        });
    
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)), {
            persistent: true,
        });
    
        await this.closeChannel(channel);
    }


    private async closeChannel(channel: any): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                channel.close();
                resolve();
            }, 5000);
        });
    }


    private async streamToBase64(stream: Readable): Promise<string> {
        return new Promise((resolve, reject) => {
          const chunks: Buffer[] = [];
          stream.on('data', (chunk) => chunks.push(chunk));
          stream.on('end', () => resolve(Buffer.concat(chunks).toString('base64')));
          stream.on('error', reject);
        });
    }


    private async closeConnection(connection: any): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                connection.close();
                resolve();
            }, 5000);
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


