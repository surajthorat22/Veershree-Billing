import { type PaymentEntry, type PaymentScheduleEntry } from '../models/bill.model';

export function getTotalReceived(payments: PaymentEntry[] | null | undefined): number {
  return (payments ?? []).reduce((total, payment) => total + toAmount(payment.amount), 0);
}

export function getTotalBalance(
  totalPlotAmount: number | null | undefined,
  receivedPayments: PaymentEntry[] | null | undefined,
): number {
  return toAmount(totalPlotAmount) - getTotalReceived(receivedPayments);
}

export function getTotalScheduledPayments(
  balancePayments: PaymentScheduleEntry[] | null | undefined,
): number {
  return (balancePayments ?? []).reduce((total, payment) => total + toAmount(payment.amount), 0);
}

function toAmount(value: number | null | undefined): number {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) ? amount : 0;
}
