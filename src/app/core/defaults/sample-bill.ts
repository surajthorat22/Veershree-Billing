import { type BillData, type CompanyDetails } from '../models/bill.model';
import { VEERSHREE_PAYMENT_STATEMENT_ID } from '../layouts/layout-ids';
import { DEFAULT_CONDITIONS, DEFAULT_PAID_TO } from './defaults';
import { createId } from '../utils/id';

/** Development/example data from the reference ledger. Not used as production defaults. */
export function createSampleBill(company: CompanyDetails): BillData {
  return {
    layoutId: VEERSHREE_PAYMENT_STATEMENT_ID,
    estimateDate: '2026-08-20',
    bookingDate: '2026-08-04',
    plotName: 'VEERSHREE VISTA RESIDENCY',
    gatNumber: '18/6',
    customerName: 'MRS SANGEETA ANKUSH DHAKANE',
    plotNumber: '13,12',
    plotArea: 1350,
    plotAreaUnit: 'Sq.Ft',
    totalPlotAmount: 3150000,
    receivedPayments: [
      {
        id: createId(),
        date: '2026-08-04',
        amount: 150000,
        method: 'CHEQUE',
        paidTo: DEFAULT_PAID_TO,
        description: 'Booking',
      },
    ],
    balancePayments: [
      {
        id: createId(),
        dueDate: '2026-08-14',
        amount: 750000,
        method: 'CHEQUE',
        paidTo: DEFAULT_PAID_TO,
      },
      {
        id: createId(),
        dueDate: '2026-08-14',
        amount: 800000,
        method: 'CASH',
        paidTo: DEFAULT_PAID_TO,
      },
      {
        id: createId(),
        amount: 1450000,
        method: 'DOCUMENTATION_DAY',
        paidTo: DEFAULT_PAID_TO,
        description: 'On documentation day',
      },
    ],
    conditions: [...DEFAULT_CONDITIONS],
    company,
  };
}
