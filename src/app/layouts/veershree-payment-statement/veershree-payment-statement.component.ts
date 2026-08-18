import { Component, computed, input } from '@angular/core';
import { type BillData, type PaymentScheduleEntry } from '../../core/models/bill.model';
import { paymentMethodLabel } from '../../core/models/payment-methods';
import { getTotalBalance, getTotalReceived } from '../../core/utils/calculations';
import { formatInr } from '../../core/utils/currency';
import { formatDisplayDate } from '../../core/utils/date-format';

@Component({
  selector: 'app-veershree-payment-statement',
  templateUrl: './veershree-payment-statement.component.html',
  styleUrl: './veershree-payment-statement.component.scss',
})
export class VeershreePaymentStatement {
  readonly bill = input.required<BillData>();

  protected readonly company = computed(() => this.bill().company);
  protected readonly totalReceived = computed(() => getTotalReceived(this.bill().receivedPayments));
  protected readonly totalBalance = computed(() =>
    getTotalBalance(this.bill().totalPlotAmount, this.bill().receivedPayments),
  );
  protected readonly plotAreaLabel = computed(() => {
    const area = this.bill().plotArea;
    if (area === null || area === undefined || area === 0) {
      return '—';
    }
    return `${area} ${this.bill().plotAreaUnit ?? ''}`.trim();
  });
  protected readonly contactLine = computed(() => {
    const company = this.company();
    return [company.address, company.contact, company.email].filter(Boolean).join('  ·  ');
  });

  protected formatMoney(value: number | null | undefined): string {
    return formatInr(value);
  }

  protected formatDate(value?: string | null): string {
    return formatDisplayDate(value);
  }

  protected methodLabel(method?: string | null): string {
    return paymentMethodLabel(method);
  }

  protected dueDateLabel(entry: PaymentScheduleEntry): string {
    if (entry.method === 'DOCUMENTATION_DAY') {
      return 'Documentation Day';
    }
    return this.formatDate(entry.dueDate);
  }
}
