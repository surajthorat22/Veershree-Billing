import { type BillData, type CompanyDetails } from '../models/bill.model';
import { VEERSHREE_PAYMENT_STATEMENT_ID } from '../layouts/layout-ids';

export const DEFAULT_PAID_TO = 'Veershree Realty';

export const DEFAULT_BRAND_LOGO = '/veershree-logo.png';
export const DEFAULT_AUTHORIZED_SIGNATURE = '/authorized-signature.png';

/** Fixed company branding used on every bill. Not editable in the UI. */
export const DEFAULT_COMPANY: CompanyDetails = {
  name: 'VEERSHREE REALTY',
  tagline: 'YOUR HOME. OUR PRIORITY.',
  address: 'Shop No. 25, Second Floor, Vishal Capital, Chakan, 410501',
  contact: '7875171414, 9689141212',
  email: 'veershreerealty@gmail.com',
  logo: DEFAULT_BRAND_LOGO,
  signature: undefined,
  authorizedPerson: '',
  designation: '',
};

export const DEFAULT_CONDITIONS: string[] = [
  'If the payment is not received within 10 days your booking will be cancelled.',
  'Stamp duty paid by the customer.',
  'Gov. valuation 7/12 and Adv fees paid by the customer.',
];

export function createEmptyBill(
  company: CompanyDetails = DEFAULT_COMPANY,
  conditions: string[] = [...DEFAULT_CONDITIONS],
): BillData {
  return {
    layoutId: VEERSHREE_PAYMENT_STATEMENT_ID,
    estimateDate: '',
    bookingDate: '',
    plotName: '',
    gatNumber: '',
    customerName: '',
    plotNumber: '',
    plotArea: null,
    plotAreaUnit: 'Sq.Ft',
    totalPlotAmount: 0,
    receivedPayments: [],
    balancePayments: [],
    conditions,
    company,
  };
}
