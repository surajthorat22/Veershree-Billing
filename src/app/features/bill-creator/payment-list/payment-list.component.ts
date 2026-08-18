import { Component, input, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { type BillFormGroup, createPaymentGroup } from '../../../core/forms/bill-form';
import { RECEIVED_PAYMENT_METHODS, paymentMethodLabel } from '../../../core/models/payment-methods';
import { InrCurrencyPipe } from '../../../shared/pipes/inr-currency.pipe';
import { DisplayDatePipe } from '../../../shared/pipes/display-date.pipe';

@Component({
  selector: 'app-payment-list',
  imports: [ReactiveFormsModule, InrCurrencyPipe, DisplayDatePipe],
  templateUrl: './payment-list.component.html',
  styleUrl: './payment-list.component.scss',
})
export class PaymentList {
  readonly form = input.required<BillFormGroup>();
  readonly submitted = input(false);

  protected readonly methods = RECEIVED_PAYMENT_METHODS;
  protected readonly methodLabel = paymentMethodLabel;
  protected readonly expandedId = signal<string | null>(null);

  protected payments() {
    return this.form().controls.receivedPayments;
  }

  protected addPayment(): void {
    const group = createPaymentGroup();
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
