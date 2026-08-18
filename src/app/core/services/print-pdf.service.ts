import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PrintPdf {
  print(): void {
    window.print();
  }

  async downloadPdf(element: HTMLElement, filename: string): Promise<void> {
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ]);

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const imageWidth = pageWidth;
    const imageHeight = (canvas.height * imageWidth) / canvas.width;
    const imageData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    let remaining = imageHeight;
    let position = 0;

    pdf.addImage(imageData, 'JPEG', 0, position, imageWidth, imageHeight);
    remaining -= pageHeight;

    while (remaining > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imageData, 'JPEG', 0, position, imageWidth, imageHeight);
      remaining -= pageHeight;
    }

    pdf.save(filename);
  }
}
