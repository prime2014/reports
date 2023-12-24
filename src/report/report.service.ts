import { Injectable, BadRequestException } from '@nestjs/common';
const PDFDocument = require("pdfkit");
import { Transform } from 'stream';
import * as fs from "fs"

@Injectable()
export class ReportService {
    

    async generatePDF(): Promise<Transform> {
        var current_time: string = new Date(Date.now()).toLocaleString();

        const pdfDoc = new PDFDocument({ size: "A4", font:"Times-Roman", bufferPages: true })
        
        const range = pdfDoc.bufferedPageRange()

        // add the setup for the document
        const setUpDocument = () => {
            pdfDoc.fontSize(16).font("/home/prime/Desktop/reports/src/report/fonts/PlayfairDisplay-SemiBold.ttf").text("Fellowship Company", {
                align: "left"
            })
               
            pdfDoc.fontSize(12).text("Email:fellowship@business.com")
            pdfDoc.fontSize(12).text("TEL: 0700000000", {
                align: "left"
            })
            pdfDoc.fontSize(12).text("Sctr Mombasa", {
                align: "left"
            })
            pdfDoc.fontSize(12).text("PIN: P000000000D", {
                align: "left"
            })
    
            pdfDoc.moveUp(5)
            pdfDoc.fontSize(12).text("End Of Day Report", {
                align: "right"
            })
    
            pdfDoc.moveTo(40, 165).lineTo(550, 165).stroke()
        }

            // add the sales content
        const addSalesContent = () => {
            pdfDoc.moveDown(6)
            pdfDoc.fontSize(12).font("Times-Bold").text("SALES", {
                width: 300,
                columns: 1,
                align: "left"
            })
            pdfDoc.fontSize(12).font("Times-Roman").text(`As at ${current_time}`)
            pdfDoc.moveDown(1)
            pdfDoc.fontSize(12).text("Total Sales")
            pdfDoc.moveUp(1)
            pdfDoc.fontSize(12).font("Times-Bold").text("KES 0.00", {
                align: "right"
            })
    
            pdfDoc.moveDown(1)
            pdfDoc.fontSize(12).font("Times-Roman").text("Total VAT")
            pdfDoc.moveUp(1)
            pdfDoc.fontSize(12).font("Times-Bold").text("KES 0.00", {
                align: "right"
            })
    
    
            pdfDoc.moveDown(2)
            pdfDoc.fontSize(12).font("Times-Roman").text("MONTH-TO-DATE", {
                width: 300,
                columns: 1,
                align: "left"
            })
                
    
            pdfDoc.moveDown(1)
            pdfDoc.fontSize(12).text("Total Sales")
            pdfDoc.moveUp(1)
            pdfDoc.fontSize(12).font("Times-Bold").text("KES 0.00", {
                align: "right"
            })
    
            pdfDoc.moveDown(1)
            pdfDoc.fontSize(12).font("Times-Roman").text("Total VAT")
            pdfDoc.moveUp(1)
            pdfDoc.fontSize(12).font("Times-Bold").text("KES 0.00", {
                align: "right"
            })
    
            pdfDoc.moveDown(1)
            pdfDoc.fontSize(12).font("Times-Roman").text("Turnover Tax (3%)")
            pdfDoc.moveUp(1)
            pdfDoc.fontSize(12).font("Times-Bold").text("KES 0.00", {
                align: "right"
            });
            pdfDoc.moveTo(40, 410).lineTo(550, 410).stroke()
        }


        // add credit note part of the document
        const addCreditNoteContent = () => {
            pdfDoc.moveDown(3)
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
            pdfDoc.fontSize(12).font("Times-Bold").text("KES 0.00", {
                align: "right"
            })

            pdfDoc.moveDown(2)
            pdfDoc.fontSize(12).font("Times-Roman").text("MONTH-TO-DATE")
            
            pdfDoc.moveDown(1)
            pdfDoc.fontSize(12).text("Total Amount")
            pdfDoc.moveUp(1)
            pdfDoc.fontSize(12).font("Times-Bold").text("KES 0.00", {
                align: "right"
            })

            pdfDoc.moveDown(2)
            pdfDoc.fontSize(12).font("Times-Roman").text("End Of Report")
        }


        // add footer
        const addFooter = (i) => {
            pdfDoc.switchToPage(i)
            let oldBottomMargin = pdfDoc.page.margins.bottom;
                
            pdfDoc.page.margins.bottom = 0;
            pdfDoc.moveTo(0, (pdfDoc.page.height - (oldBottomMargin / 3)) - 10).lineTo(pdfDoc.page.width, (pdfDoc.page.height - (oldBottomMargin / 3)) - 10).stroke()
            pdfDoc.text("Report generated by Isale", pdfDoc.page.margins.left, pdfDoc.page.height - (oldBottomMargin / 3))
            pdfDoc.page.margins.bottom = oldBottomMargin
        }

        for (let i = 0; i < range.count; i++) {
                
            setUpDocument()
            addSalesContent()
            addCreditNoteContent()
            addFooter(i)                
        }

        return await new Promise<Transform>((resolve, reject)=> {
            // Create a Transform stream to handle the output of the PDF document
            const transformStream = new Transform({
                transform(chunk, encoding, callback) {
                    this.push(chunk);
                    callback();
                }
            });
        
            // Resolve the transform stream once the PDF is generated
            pdfDoc.on('end', () => {
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
        })

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
