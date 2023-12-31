import { Controller, Get, Res, Sse, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { ReportService } from './report.service';
import { createReadStream } from 'fs';

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
            'Content-Disposition': 'inline; filename="inventory.pdf"',
        })

        try {
            const pdfStream = await this.pdfService.getPurchases()
            pdfStream.pipe(res);
        } catch(error) {
            throw error;
        }
    }

    
}
