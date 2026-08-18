import { Component, input, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { type BillFormGroup, createScheduleGroup } from '../../../core/forms/bill-form';
import { SCHEDULE_PAYMENT_METHODS, paymentMethodLabel } from '../../../core/models/payment-methods';
import { InrCurrencyPipe } from '../../../shared/pipes/inr-currency.pipe';
import { DisplayDatePipe } from '../../../shared/pipes/display-date.pipe';

@Component({
  selector: 'app-payment-schedule',
  imports: [ReactiveFormsModule, InrCurrencyPipe, DisplayDatePipe],
  templateUrl: './payment-schedule.component.html',
  styleUrl: './payment-schedule.component.scss',
})
export class PaymentSchedule {
  readonly form = input.required<BillFormGroup>();
  readonly submitted = input(false);

  protected readonly methods = SCHEDULE_PAYMENT_METHODS;
  protected readonly methodLabel = paymentMethodLabel;
  protected readonly expandedId = signal<string | null>(null);

  protected payments() {
    return this.form().controls.balancePayments;
  }

  protected addPayment(): void {
    const group = createScheduleGroup();
    this.payments().push(group);
    this.expandedId.set(group.controls.id.value);
  }

  protected remove(index: number): void {
    this.payments().removeAt(index);
  }

  protected expand(id: string): void {
    this.expandedId.set(id);
  }

  protected collapse(): void {
    this.expandedId.set(null);
  }

  protected invalidRow(index: number): boolean {
    return this.submitted() && this.payments().at(index).invalid;
  }
}
