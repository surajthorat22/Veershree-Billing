import { NgComponentOutlet } from '@angular/common';
import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { getBillLayout } from '../../core/layouts/bill-layouts';
import { BillStore } from '../../core/services/bill.service';
import { PrintPdf } from '../../core/services/print-pdf.service';

@Component({
  selector: 'app-bill-preview',
  imports: [NgComponentOutlet, RouterLink],
  templateUrl: './bill-preview.component.html',
  styleUrl: './bill-preview.component.scss',
})
export class BillPreview {
  private readonly billStore = inject(BillStore);
  private readonly printPdf = inject(PrintPdf);
  private readonly page = viewChild<ElementRef<HTMLElement>>('page');

  protected readonly downloading = signal(false);
  protected readonly error = signal('');
  protected readonly bill = computed(() => this.billStore.previewBill());
  protected readonly layout = computed(() => getBillLayout(this.bill().layoutId));
  protected readonly layoutInputs = computed(() => ({ bill: this.bill() }));

  protected print(): void {
    this.printPdf.print();
  }

  protected async download(): Promise<void> {
    const page = this.page()?.nativeElement;
    if (!page) {
      return;
    }
    this.downloading.set(true);
    this.error.set('');
    try {
      const customer = this.bill()
        .customerName.replace(/[^\w]+/g, '-')
        .replace(/^-|-$/g, '');
      const filename = `Veershree-Payment-Statement-${customer || 'Bill'}.pdf`;
      await this.printPdf.downloadPdf(page, filename);
    } catch {
      this.error.set('Unable to create the PDF. You can still use Print and save as PDF.');
    } finally {
      this.downloading.set(false);
    }
  }
}
