import { Component, input } from '@angular/core';
import { InrCurrencyPipe } from '../../../shared/pipes/inr-currency.pipe';

@Component({
  selector: 'app-financial-summary',
  imports: [InrCurrencyPipe],
  templateUrl: './financial-summary.component.html',
  styleUrl: './financial-summary.component.scss',
})
export class FinancialSummary {
  readonly totalPlotAmount = input(0);
  readonly totalReceived = input(0);
  readonly totalBalance = input(0);
  readonly totalScheduled = input(0);
}
