import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {

    constructor(private readonly pdfService: ReportService){}

    @Get()
    async getPdf(@Res() res: Response): Promise<void> {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline;filename=example.pdf");

        try {
            const pdfStream = await this.pdfService.generatePDF()
            pdfStream.pipe(res)
        } catch(error){
            throw error;
        }
        
    }
}
