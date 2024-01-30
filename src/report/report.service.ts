import { Injectable, BadRequestException } from '@nestjs/common';
const PDFDocument = require("pdfkit");
import { Transform } from 'stream';
import * as fs from "fs"
import { TableContent } from "./tableContent";
import { isNotEmptyObject } from 'class-validator';
import { subscribe } from 'diagnostics_channel';
import { EmailSubscribeDto } from './dto/subscribe.dto'; 

interface Metadata {
    current_time: string,
    pdfDoc: any,
    range: any
}

interface TableMetadata {
    doc: typeof PDFDocument,
    columns: number
    tableHeaders: string[], // the header of the table has to be the same length has the number of columns
    tableRows: string[][] // the data that populates the rows, same number of dimensions in inner array as columns
}

interface InventoryMetadata {
    doc: typeof PDFDocument,
    columns: number,
    tableHeaders: string[]
    tableRows: any[]
}




@Injectable()
export class ReportService {
    
    fileMetadata(): Metadata {
        // Initialization of the pdf document, set the size, define the buffered pages and generate the range of buffer
        var current_time: string = new Date(Date.now()).toLocaleString();

        const pdfDoc = new PDFDocument({ size: "A4", font:"Times-Roman", bufferPages: true })
        
        const range = pdfDoc.bufferedPageRange()

        return {current_time, pdfDoc, range}
    }

   
    setUpDocument = (pdfDoc, description) => {
        // This is the header of the document that contains customer information
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
        pdfDoc.y = pdfDoc.y - 4;
        
        pdfDoc.fontSize(16).text(`${description}`, {
            align: "right"
        })

        pdfDoc.moveTo(40, 165).lineTo(550, 165).stroke()
    }

    addFooter = (pdfDoc) => {
        // this footer contains the 'Report generated by iSale' statement
        let oldBottomMargin = pdfDoc.page.margins.bottom;
            
        pdfDoc.page.margins.bottom = 0;
        
        
        pdfDoc.fontSize(12).font("Times-Roman").text("Report generated by iSale", pdfDoc.page.margins.left, pdfDoc.page.height - (oldBottomMargin / 1.88), {
            align:"center"
        })
        pdfDoc.page.margins.bottom = oldBottomMargin
        
    }


    tableTemplate({doc, tableHeaders, tableRows, columns}: TableMetadata) {
        // use this table to generate a column spaced row spanning table element
        // console.log('THE CURSOR IS: ', doc.y)
        // Define table headers
      

        // Set up the table layout
        let startX = doc.page.margins.left;
        let startY = doc.y + 20;
        let rowHeight = 30;
        let colWidth = doc.page.width / columns;
        

        // Draw the table headers
        tableHeaders.forEach((header, i) => {
            switch(i) {
                case 1:
                    colWidth = 50;
                    break;
                case 2:
                    colWidth = 160;
                    break;
                case 3:
                    colWidth = 135;
                    break;
                default:
                    colWidth = doc.page.width / columns;
                    break
            }
            doc.fontSize(12).font("Times-Bold").text(header, startX + i * colWidth, startY, {
                align: "left",
                width: 300,
            });
        });
        // console.log("AFTER HEADER: ", doc.y)

        // doc.moveTo(doc.page.margins.left, 385).lineTo(doc.page.width-doc.page.margins.right, 385).stroke()
      
        // Draw the table rows
        let index = 0;

        tableRows.forEach((row, rowIndex) => {

                let height: number[] = []
                row.forEach((cell, colIndex) => {
                    if(doc.y >= doc.page.height - (doc.page.margins.bottom + 10)) {
                        index = 0;
                        doc.x = doc.page.margins.left;
                        doc.y = doc.page.margins.top;
                        startY = doc.y;
                        
                        doc.addPage()
                        switch(colIndex) {
                            case 1:
                                colWidth = 50;
                                break;
                            case 2:
                                colWidth = 160;
                                break;
                            case 3:
                                colWidth = 135;
                                break;
                            default:
                                colWidth = doc.page.width / columns;
                                break
                        }
                       
                        
                        doc.fontSize(12).font("Times-Roman").text(cell, startX + (colIndex * colWidth), startY + (index + 1) * rowHeight, {
                            align:"left",
                            width: 250,
                            height: 40,
                            paragraphGap: 10,
                            ellipsis: true
                        }); 
                    } else {
                        switch(colIndex) {
                            case 1:
                                colWidth = 50;
                                break;
                            case 2:
                                colWidth = 160;
                                break;
                            case 3:
                                colWidth = 135;
                                break;
                            default:
                                colWidth = doc.page.width / columns;
                                break
                        }
                        let figure = doc.heightOfString(cell, startX + colIndex * colWidth, startY + (index + 1) * rowHeight, {
                            align:"left",
                            width: doc.page.width / columns,
                        })
                        height.push(Math.max(rowHeight, figure))
                        
                        doc.fontSize(12).font("Times-Roman").text(cell, startX + (colIndex * colWidth), startY + (index + 1) * rowHeight, {
                            align:"left",
                            width: 250,
                            height: 40,
                            paragraphGap: 10,
                            ellipsis: true
                        }); 
                    }
                                
                
                });
                let value = Math.max(...height)
                // console.log("HEIGHT: ", height)
                doc.y += value
                // console.log("ROWS: ", doc.y)
                index += 1;
            
            
            
        });

        
        // console.log(doc.y)
        // console.log("PAGE HEIGHT: ", doc.page.height)
        doc.moveTo(40, doc.y + 5).lineTo(550, doc.y + 5).stroke()
        
    }


    customTableTemplate({doc, tableHeaders, tableRows, columns}: InventoryMetadata) {
        // use this table to generate a column spaced row spanning table element
        console.log('THE CURSOR IS: ', doc.y)
        // Define table headers
      

        // Set up the table layout
        let startX = doc.page.margins.left;
        let startY = doc.y + 20;
        let rowHeight = 20;
        let colWidth = doc.page.width / columns;
        
        console.log("THIS PAGE HEIGHT IS THIS MUCH: ", doc.page.height)
        // Draw the table headers
        tableHeaders.forEach((header, i) => {
            
            switch(i) {
                case 1:
                    colWidth = 50;
                    break;
                case 2:
                    colWidth = 160;
                    break;
                case 3:
                    colWidth = 135;
                    break;
                default:
                    colWidth = doc.page.width / columns;
                    break
            }
            doc.fontSize(12).font("Times-Bold").text(header, startX + i * colWidth, startY, {
                align: "left",
                width: 300,
            });
        });
        
        doc.moveDown(1)
        tableRows.forEach((row, rowIndex)=>{
            
            doc.fontSize(12).font("Times-Bold").text(row.categoryName, doc.page.margins.left, doc.y, {
                align: "left",
                width: 300,
            });
            doc.moveUp(1)
            doc.fontSize(12).font("Times-Bold").text(row.amount, 290 - doc.page.margins.right, doc.y, {
                align: "right",
                width: 300,
            });
            doc.moveDown(1)
            
            let index = 0
            let height: number[] = []
            startY = doc.y - 20;

            row.items.forEach((ele, idx)=>{
            
                ele.forEach((item, i)=>{
                    if(doc.y >= doc.page.height - (doc.page.margins.bottom)) {
                        index = 0;
                        doc.addPage()
                        doc.x = doc.page.margins.left;
                        doc.y = doc.page.margins.top;
                        startY = doc.y;   

                        
                        switch(i) {
                            case 1:
                                colWidth = 50;
                                break;
                            case 2:
                                colWidth = 160;
                                break;
                            case 3:
                                colWidth = 135;
                                break;
                            default:
                                colWidth = doc.page.width / columns;
                                break
                        }
                        
        
                        // let figure = doc.heightOfString(item, startX + i * colWidth, startY + (index + 1) * rowHeight, {
                        //     align:"left",
                        //     width: doc.page.width / columns,
                        // })
                        // height.push(Math.max(rowHeight, figure))
        
                        doc.fontSize(12).font("Times-Roman").text(item, startX + (i* colWidth), startY + (index + 1) * rowHeight, {
                            align:"left",
                            width: 250,
                            ellipsis: true
                        })
                        return
                    } else {
                        switch(i) {
                            case 1:
                                colWidth = 50;
                                break;
                            case 2:
                                colWidth = 160;
                                break;
                            case 3:
                                colWidth = 135;
                                break;
                            default:
                                colWidth = doc.page.width / columns;
                                break
                        }
                        
        
                        let figure = doc.heightOfString(item, startX + i * colWidth, startY + (index + 1) * rowHeight, {
                            align:"left",
                            width: doc.page.width / columns,
                        })
                        height.push(Math.max(rowHeight, figure))
        
                        doc.fontSize(12).font("Times-Roman").text(item, startX + (i* colWidth), startY + (index + 1) * rowHeight, {
                            align:"left",
                            width: 250,
                            ellipsis: true
                        });
                        
                    }
                    
                })
    
                let value = Math.max(...height)
                console.log("HEIGHT: ", height)
                doc.y += value
                        
                console.log("ROWS: ", doc.y)
                index += 1;
                
            })
            
            
        })
        console.log("AFTER HEADER: ", doc.y)

      
            
        

        
        // console.log(doc.y)
        console.log("PAGE HEIGHT: ", doc.page.height)
        doc.font("Times-Bold")
        doc.moveTo(40, doc.y + 5).lineTo(550, doc.y + 5).stroke()
    }

    // The reports workflow
    async generatePDF(): Promise<Transform> {
        
        let {current_time, pdfDoc, range} = this.fileMetadata()
        // pdfDoc.addPage()
        pdfDoc.on("pageAdded", ()=>{
            this.addFooter(pdfDoc)
            pdfDoc.x = pdfDoc.page.margins.left;
            pdfDoc.y = pdfDoc.page.margins.top;
        })

        // add the sales content
        
        const addSalesContent = () => {
            pdfDoc.moveDown(4)
            pdfDoc.fontSize(15).font("Times-Bold").text("SALES", {
                width: 300,
                columns: 1,
                align: "left"
            })
            pdfDoc.moveUp(1)
            pdfDoc.y = pdfDoc.y + 4;
            pdfDoc.fontSize(12).font("Times-Bold").text("AMOUNT", {
                align:"right"
            })
            pdfDoc.moveDown(1)
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
            pdfDoc.moveTo(40, pdfDoc.y + 10).lineTo(550, pdfDoc.y + 10).stroke()
        }


        // add credit note part of the document
        const addCreditNoteContent = () => {
            pdfDoc.moveDown(3)
            pdfDoc.font("Times-Bold").fontSize(15).text("CREDIT NOTE", {
                width: 300,
                columns: 1,
                align: "left"
            })

            pdfDoc.moveUp(1)
            pdfDoc.y = pdfDoc.y + 4;
            pdfDoc.fontSize(12).font("Times-Bold").text("AMOUNT", {
                align:"right"
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

            
        }

        this.setUpDocument(pdfDoc, "Sales Report")
        addSalesContent()
        addCreditNoteContent()

        for (let i = range.start, end = range.start + range.count; range.start <= end, i < end; i++) {
            pdfDoc.switchToPage(i)
            this.addFooter(pdfDoc)
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
        
            // Start streaming
            pdfDoc.end();
        })

    }

    async getInventory() {
        let {current_time, pdfDoc, range } = this.fileMetadata()
        // pdfDoc.addPage()
        pdfDoc.on("pageAdded", ()=>{
            this.addFooter(pdfDoc)
            pdfDoc.x = pdfDoc.page.margins.left;
            pdfDoc.y = pdfDoc.page.margins.top;
        })
        
        const addInventoryContent = () => {
            pdfDoc.moveDown(4)
            pdfDoc.fontSize(14).font("Times-Bold").text("INVENTORY", {
                width: 300,
                columns: 1,
                align: "left"
            })
            pdfDoc.moveUp(1)
            pdfDoc.y = pdfDoc.y + 4;
            pdfDoc.fontSize(12).font("Times-Bold").text("AMOUNT", {
                align:"right"
            })
            pdfDoc.moveDown(1)
            pdfDoc.fontSize(12).font("Times-Roman").text(`As at ${current_time}`)
            pdfDoc.moveDown(1)
            pdfDoc.fontSize(12).text("Value of inventory sold")
            pdfDoc.moveUp(1)
            pdfDoc.fontSize(12).font("Times-Bold").text("KES 0.00", {
                align: "right"
            })
    
            pdfDoc.moveDown(1)
            pdfDoc.fontSize(12).font("Times-Roman").text("Value of stock adjustment outward")
            pdfDoc.moveUp(1)
            pdfDoc.fontSize(12).font("Times-Bold").text("(KES 0.00)", {
                align: "right"
            })

            pdfDoc.moveDown(1)
            pdfDoc.fontSize(12).font("Times-Roman").text("Value of stock adjustment inward")
            pdfDoc.moveUp(1)
            pdfDoc.fontSize(12).font("Times-Bold").text("KES 0.00", {
                align: "right"
            })
    
            pdfDoc.moveTo(40, pdfDoc.y + 10).lineTo(550, pdfDoc.y + 10).stroke()
            pdfDoc.y = 300;
        
        }

        // add credit note part of the document
        const addCreditNoteContent = () => {
            pdfDoc.moveDown(3)
            pdfDoc.font("Times-Bold").fontSize(14).text("DAILY INVENTORY MOVEMENT", {
                align: "left"
            })
            let doc = pdfDoc
            let { inventoryHeader, inventoryData, categoryHeader, categoriesData } = TableContent;
            
            // this.tableTemplate({ doc, tableHeaders:categoryHeader, tableRows:categoriesData, columns: 4})
            this.customTableTemplate({ doc, tableHeaders:inventoryHeader, tableRows:inventoryData, columns: 4})
            
        }


        const outOfStock = () => {
            pdfDoc.moveDown(2)
            pdfDoc.x = pdfDoc.page.margins.left
            pdfDoc.font("Times-Bold").fontSize(15).text("", {
                // width: 300,
                align: "left"
            })
            pdfDoc.font("Times-Bold").fontSize(15).text("OUT OF STOCK", {
                // width: 300,
                align: "left"
            })
            let { outOfStockHeader, outOfStockData } = TableContent;
            this.tableTemplate({ doc: pdfDoc, columns: 2, tableHeaders: outOfStockHeader, tableRows: outOfStockData })
        }

        
        
        // page content
        this.setUpDocument(pdfDoc, "Inventory Report");
        addInventoryContent()   
        addCreditNoteContent()
        outOfStock()

        // buffers the pages instead of flushing them and switches to each page to add a footer
        for (let i = range.start, end = range.start + range.count; range.start <= end, i < end; i++) {
            pdfDoc.switchToPage(i)
            this.addFooter(pdfDoc)
        }
        
        console.log("POSITION OF CURSOR: ", pdfDoc.y)
        console.log("HEIGHT OF DOC: ", pdfDoc.page.height)
        
        

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
        
            // Start streaming
            pdfDoc.end();
        })

    }


    async getPurchases(): Promise<Transform> {
        let {current_time, pdfDoc, range} = this.fileMetadata()
        // pdfDoc.addPage()
        pdfDoc.on("pageAdded", ()=>{
            this.addFooter(pdfDoc)
            pdfDoc.x = pdfDoc.page.margins.left;
            pdfDoc.y = pdfDoc.page.margins.top;
        })

        const addInventoryContent = () => {
            pdfDoc.moveDown(4)
            pdfDoc.y = pdfDoc.y + 2;
            pdfDoc.fontSize(15).font("Times-Bold").text("PURCHASES", {
                width: 300,
                columns: 1,
                align: "left"
            })
            pdfDoc.moveUp(1)
            pdfDoc.y = pdfDoc.y + 4;
            pdfDoc.fontSize(12).font("Times-Bold").text("AMOUNT", {
                align:"right"
            })
            pdfDoc.y = pdfDoc.y + 3;
            pdfDoc.fontSize(12).font("Times-Roman").text(`As at ${current_time}`)
            pdfDoc.moveDown(1)
            pdfDoc.fontSize(12).text("Total Purchases")
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
            pdfDoc.fontSize(12).text("Total Purchases")
            pdfDoc.moveUp(1)
            pdfDoc.fontSize(12).font("Times-Bold").text("KES 0.00", {
                align: "right"
            })

            pdfDoc.moveDown(2)
            pdfDoc.fontSize(12).font("Times-Roman").text("ANALYSIS", {
                width: 300,
                columns: 1,
                align: "left"
            })

            pdfDoc.moveDown(1)
            pdfDoc.fontSize(12).text("No. of new purchases (Today)")
            pdfDoc.moveUp(1)
            pdfDoc.fontSize(12).font("Times-Bold").text("2", {
                align: "right"
            })

            pdfDoc.moveDown(1)
            pdfDoc.fontSize(12).font("Times-Roman").text("No. of new purchases Month-To-Date")
            pdfDoc.moveUp(1)
            pdfDoc.fontSize(12).font("Times-Bold").text("10", {
                align: "right"
            })

            pdfDoc.moveDown(1)
            pdfDoc.fontSize(12).font("Times-Roman").text("Unclaimed Purchases Month-To-Date")
            pdfDoc.moveDown(1)
            pdfDoc.fontSize(12).font("Times-Roman").text("Unclaimed Purchases Total Amount")

            pdfDoc.moveUp(1)
            pdfDoc.fontSize(12).font("Times-Bold").text("KES 0.00", {
                align: "right"
            })
    
    
            pdfDoc.y = 410;
        
        }

        this.setUpDocument(pdfDoc, "Purchases Report")
        addInventoryContent()
        for (let i = range.start, end = range.start + range.count; range.start <= end, i < end; i++) {
            pdfDoc.switchToPage(i)
            this.addFooter(pdfDoc)
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
        
            // Start streaming
            pdfDoc.end();
        })

    }

    async subscribeClient(subscribe: EmailSubscribeDto) {
        try {
            return subscribe.email;
        } catch(error){
            console.log("MY ERROR MESSAGE IS: ", error.message)
            throw error;
        }
    }

    
}
