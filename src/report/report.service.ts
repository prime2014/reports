import { Injectable, BadRequestException } from '@nestjs/common';
const PDFDocument = require("pdfkit");
import { Transform } from 'stream';
import * as fs from "fs"

@Injectable()
export class ReportService {

    async generatePDF(): Promise<Transform> {
        var current_time: string = new Date(Date.now()).toLocaleString();

        return await new Promise<Transform>((resolve, reject) => {
            const pdfDoc = new PDFDocument({ size: "A4", font:"Times-Roman" })
        

            pdfDoc.fontSize(16).text("Fellowship Company", {
                align: "center"
            })
            
            pdfDoc.fontSize(11).text("Email:fellowship@business.com", {
                align: "center"
            })

            pdfDoc.moveTo(40, 110).lineTo(550, 110).stroke()
            pdfDoc.moveTo(40, 112).lineTo(550, 112).stroke()

            pdfDoc.moveDown(3)
            pdfDoc.fontSize(12).font("Times-Bold").text("SALES", {
                width: 300,
                columns: 1,
                align: "left"
            })
            pdfDoc.fontSize(12).font("Times-Roman").text(`As at ${current_time}`)
            pdfDoc.moveDown(1)
            pdfDoc.fontSize(12).text("Total Sales")
            pdfDoc.moveUp(1)
            pdfDoc.fontSize(12).text("KES 0.00", {
                align: "right"
            })

            pdfDoc.moveDown(1)
            pdfDoc.fontSize(12).text("Total VAT")
            pdfDoc.moveUp(1)
            pdfDoc.fontSize(12).text("KES 0.00", {
                align: "right"
            })

            // pdfDoc.moveTo(40, 250).lineTo(550, 250).dash(7, { space: 5 }).stroke()

            pdfDoc.moveDown(3)
            pdfDoc.fontSize(12).text("MONTH to DATE", {
                width: 300,
                columns: 1,
                align: "left"
            })
            

            pdfDoc.moveDown(1)
            pdfDoc.fontSize(12).text("Total Sales")
            pdfDoc.moveUp(1)
            pdfDoc.fontSize(12).text("KES 0.00", {
                align: "right"
            })

            pdfDoc.moveDown(1)
            pdfDoc.fontSize(12).text("Total VAT")
            pdfDoc.moveUp(1)
            pdfDoc.fontSize(12).text("KES 0.00", {
                align: "right"
            })

            pdfDoc.moveDown(1)
            pdfDoc.fontSize(12).text("Turnover Tax")
            pdfDoc.moveUp(1)
            pdfDoc.fontSize(12).text("KES 0.00", {
                align: "right"
            });

            pdfDoc.moveTo(40, 380).lineTo(550, 380).dash(7, { space: 5 }).stroke()

            pdfDoc.moveDown(4)
            pdfDoc.font("Times-Bold").fontSize(12).text("CREDIT NOTE", {
                width: 300,
                columns: 1,
                align: "left"
            })

            pdfDoc.moveDown(1)
            pdfDoc.font("Times-Roman").fontSize(12).text(`As at ${current_time}`)
            

            pdfDoc.moveDown(1)
            pdfDoc.fontSize(12).text("Total Amount")
            pdfDoc.moveUp(1)
            pdfDoc.fontSize(12).text("KES 0.00", {
                align: "right"
            })

            pdfDoc.moveDown(3)
            pdfDoc.fontSize(12).text("MONTH TO DATE")
            
            pdfDoc.moveDown(1)
            pdfDoc.fontSize(12).text("Total Amount")
            pdfDoc.moveUp(1)
            pdfDoc.fontSize(12).text("KES 0.00", {
                align: "right"
            })

            // Create a Transform stream to handle the output of the PDF document
            const transformStream = new Transform({
                transform(chunk, encoding, callback) {
                    this.push(chunk);
                    callback();
                }
            });
        
            // Resolve the transform stream once the PDF is generated
            pdfDoc.on('end', async () => {
                resolve(transformStream);
            });

            pdfDoc.on('error', (error) => {
                reject(new BadRequestException('PDF generation error: ' + error.message));
            });

            // Pipe the PDF data directly to the transformStream stream
            pdfDoc.pipe(transformStream, { end: true });
            this.savePDFFile(pdfDoc);

        
            // Start streaming
            pdfDoc.end();
        });

    }


    async savePDFFile(doc): Promise<void> {
        return await new Promise<void>((resolve, reject)=> {

            const stream = fs.createWriteStream("stanbest_11_02_2023__12_04_2023.pdf")
            doc.pipe(stream)

            stream.on("finish", async ()=>{
                resolve()
            })
            
        })
    }
}
