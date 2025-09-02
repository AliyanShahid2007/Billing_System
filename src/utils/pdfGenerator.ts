import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Bill } from '../types/billing';
import { format } from 'date-fns';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: any;
  }
}

export class PDFGenerator {
  static generateInvoice(bill: Bill): void {
    const doc = new jsPDF();
    
    // Company Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(30, 64, 175); // Blue color
    doc.text('KYN-Billing', 105, 25, { align: 'center' });
    
    // Company details
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Complete Book Store Solution', 105, 35, { align: 'center' });
    doc.text('Phone: +92-XXX-XXXXXXX | Email: info@KYN-Billing.com', 105, 42, { align: 'center' });
    
    // Invoice header
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 50, 190, 50);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('INVOICE', 20, 65);
    
    // Invoice details
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Invoice #: ${bill.id.slice(-8).toUpperCase()}`, 20, 75);
    doc.text(`Date: ${format(new Date(bill.createdAt), 'dd/MM/yyyy')}`, 20, 85);
    doc.text(`Customer: ${bill.customerName}`, 20, 95);
    
    // Items table
    const tableData = bill.items.map(item => [
      item.name,
      item.quantity.toString(),
      `Rs. ${item.price.toFixed(2)}`,
      `Rs. ${item.subtotal.toFixed(2)}`
    ]);
    
    doc.autoTable({
      startY: 110,
      head: [['Item Description', 'Qty', 'Unit Price', 'Amount']],
      body: tableData,
      theme: 'grid',
      headStyles: { 
        fillColor: [30, 64, 175], 
        textColor: 255, 
        fontStyle: 'bold',
        halign: 'center' 
      },
      bodyStyles: { 
        fontSize: 10,
        cellPadding: 5
      },
      columnStyles: {
        0: { halign: 'left', cellWidth: 80 },
        1: { halign: 'center', cellWidth: 25 },
        2: { halign: 'right', cellWidth: 35 },
        3: { halign: 'right', cellWidth: 35 }
      },
      alternateRowStyles: { fillColor: [248, 249, 250] }
    });

    // Summary section
    const finalY = doc.lastAutoTable.finalY + 15;
    
    doc.autoTable({
      startY: finalY,
      body: [
        ['Subtotal:', `Rs. ${bill.total.toFixed(2)}`],
        ['Discount:', `Rs. ${bill.discountAmount.toFixed(2)}`],
        ['', ''],
        ['Net Total:', `Rs. ${bill.netTotal.toFixed(2)}`]
      ],
      theme: 'plain',
      styles: { 
        fontSize: 11,
        cellPadding: 3
      },
      columnStyles: {
        0: { halign: 'right', fontStyle: 'bold', cellWidth: 40 },
        1: { halign: 'right', fontStyle: 'bold', cellWidth: 40 }
      },
      tableWidth: 80,
      margin: { left: 110 }
    });

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, pageHeight - 30, 190, pageHeight - 30);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for choosing KYN Billing!', 105, pageHeight - 20, { align: 'center' });
    doc.text('Visit us again for all your book needs', 105, pageHeight - 15, { align: 'center' });
    
    // Save the PDF
    doc.save(`invoice_${bill.id.slice(-8)}.pdf`);
  }
}
