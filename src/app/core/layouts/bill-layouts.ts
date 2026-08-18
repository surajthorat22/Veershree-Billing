import { type BillLayoutDefinition } from '../models/layout.model';
import { VEERSHREE_PAYMENT_STATEMENT_ID } from './layout-ids';
import { VeershreePaymentStatement } from '../../layouts/veershree-payment-statement/veershree-payment-statement.component';

export const BILL_LAYOUTS: BillLayoutDefinition[] = [
  {
    id: VEERSHREE_PAYMENT_STATEMENT_ID,
    name: 'Veershree Payment Statement',
    component: VeershreePaymentStatement,
  },
];

export function getBillLayout(layoutId: string): BillLayoutDefinition {
  return BILL_LAYOUTS.find((layout) => layout.id === layoutId) ?? BILL_LAYOUTS[0];
}
