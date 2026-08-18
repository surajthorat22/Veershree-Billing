import { type ReceivedPaymentMethod, type SchedulePaymentMethod } from './bill.model';

export const RECEIVED_PAYMENT_METHODS: ReceivedPaymentMethod[] = [
  'CASH',
  'CHEQUE',
  'UPI',
  'NEFT',
  'RTGS',
  'BANK_TRANSFER',
  'CARD',
  'OTHER',
];

export const SCHEDULE_PAYMENT_METHODS: SchedulePaymentMethod[] = [
  ...RECEIVED_PAYMENT_METHODS,
  'DOCUMENTATION_DAY',
  'NOT_DECIDED',
];

export const PAYMENT_METHOD_LABELS: Record<SchedulePaymentMethod, string> = {
  CASH: 'Cash',
  CHEQUE: 'Cheque',
  UPI: 'UPI',
  NEFT: 'NEFT',
  RTGS: 'RTGS',
  BANK_TRANSFER: 'Bank Transfer',
  CARD: 'Card',
  OTHER: 'Other',
  DOCUMENTATION_DAY: 'On Documentation Day',
  NOT_DECIDED: 'Other / Not Decided',
};

export function paymentMethodLabel(method?: SchedulePaymentMethod | string | null): string {
  if (!method) {
    return '—';
  }
  return PAYMENT_METHOD_LABELS[method as SchedulePaymentMethod] ?? method;
}
