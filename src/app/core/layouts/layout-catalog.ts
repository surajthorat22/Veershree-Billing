import { VEERSHREE_PAYMENT_STATEMENT_ID } from './layout-ids';

export interface BillLayoutOption {
  id: string;
  name: string;
}

export const BILL_LAYOUT_OPTIONS: BillLayoutOption[] = [
  {
    id: VEERSHREE_PAYMENT_STATEMENT_ID,
    name: 'Veershree Payment Statement',
  },
];
