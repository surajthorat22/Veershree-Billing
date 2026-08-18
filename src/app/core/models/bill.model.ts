export type PlotAreaUnit = 'Sq.Ft' | 'Sq.M' | 'Other';

export type ReceivedPaymentMethod =
  'CASH' | 'CHEQUE' | 'UPI' | 'NEFT' | 'RTGS' | 'BANK_TRANSFER' | 'CARD' | 'OTHER';

export type SchedulePaymentMethod = ReceivedPaymentMethod | 'DOCUMENTATION_DAY' | 'NOT_DECIDED';

export type PaymentMethod = SchedulePaymentMethod;

/** Reserved for a future split-payment feature. Unused in V1 UI. */
export interface PaymentSplit {
  method: ReceivedPaymentMethod;
  amount: number;
}

export interface PaymentEntry {
  id: string;
  date: string;
  amount: number;
  method: ReceivedPaymentMethod;
  paidTo: string;
  receivedBy?: string;
  reference?: string;
  bankName?: string;
  description?: string;
  splits?: PaymentSplit[];
}

export interface PaymentScheduleEntry {
  id: string;
  dueDate?: string;
  amount: number;
  method?: SchedulePaymentMethod;
  paidTo?: string;
  description?: string;
}

export interface CompanyDetails {
  name: string;
  tagline?: string;
  address?: string;
  contact?: string;
  email?: string;
  logo?: string;
  stamp?: string;
  signature?: string;
  authorizedPerson?: string;
  designation?: string;
}

export interface BillData {
  layoutId: string;
  estimateDate: string;
  bookingDate: string;
  plotName: string;
  gatNumber?: string;
  customerName: string;
  plotNumber: string;
  plotArea?: number | null;
  plotAreaUnit?: PlotAreaUnit;
  totalPlotAmount: number;
  receivedPayments: PaymentEntry[];
  balancePayments: PaymentScheduleEntry[];
  conditions: string[];
  company: CompanyDetails;
}
