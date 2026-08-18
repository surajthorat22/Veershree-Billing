import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { type BillFormGroup } from '../../../core/forms/bill-form';
import { InrCurrencyPipe } from '../../../shared/pipes/inr-currency.pipe';

@Component({
  selector: 'app-bill-information',
  imports: [ReactiveFormsModule, InrCurrencyPipe],
  templateUrl: './bill-information.component.html',
  styleUrl: './bill-information.component.scss',
})
export class BillInformation {
  readonly form = input.required<BillFormGroup>();
  readonly submitted = input(false);

  protected showError(controlName: keyof BillFormGroup['controls']): boolean {
    const control = this.form().controls[controlName];
    return this.submitted() && control.invalid;
  }
}
