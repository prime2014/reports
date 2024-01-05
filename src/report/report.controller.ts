import { Body, Controller, Get, HttpException, HttpStatus, Post, Res, Sse, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { ReportService } from './report.service';
import { createReadStream } from 'fs';
import { EmailSubscribeDto } from './dto/subscribe.dto';
import { isNotEmptyObject } from 'class-validator';
import { Resolver } from 'dns';

@Controller('report')
export class ReportController {

    constructor(private readonly pdfService: ReportService){}

    @Get()
    async getPdf(@Res() res: Response) {
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline; filename="example.pdf"',
        });

        try {
            const pdfStream = await this.pdfService.generatePDF()
            
            pdfStream.pipe(res)
        } catch(error){
            throw error;
        }
        
    }


    @Get("/api/v1/inventory")
    async getInventory(@Res() res: Response) {
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline; filename="inventory.pdf"',
        });
        try {
            const pdfStream = await this.pdfService.getInventory()
            pdfStream.pipe(res);
        } catch(error) {
            throw error;
        }
    }

    @Get("/api/v1/purchases")
    async getPurchasesReport(@Res() res: Response) {
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline; filename="purchases_report.pdf"',
        })

        try {
            const pdfStream = await this.pdfService.getPurchases()
            pdfStream.pipe(res);
        } catch(error) {
            throw error;
        }
    }

    @Post("/api/v1/subscribe")
    async subscribeCustomer(@Body() subscribe: EmailSubscribeDto, @Res() res: Response) {
        try {
            const result = await this.pdfService.subscribeClient(subscribe);

            res.status(201).json({ message: "Subscription successful", email: result });
           
        } catch(error){
            console.error("Error:", error.message);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    
}
