import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  type ValidationErrors,
  type ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  type PaymentEntry,
  type PaymentScheduleEntry,
  type PlotAreaUnit,
  type ReceivedPaymentMethod,
  type SchedulePaymentMethod,
} from '../models/bill.model';
import { DEFAULT_PAID_TO } from '../defaults/defaults';
import { createId } from '../utils/id';

export interface PaymentFormControls {
  id: FormControl<string>;
  date: FormControl<string>;
  amount: FormControl<number | null>;
  method: FormControl<ReceivedPaymentMethod>;
  paidTo: FormControl<string>;
  receivedBy: FormControl<string>;
  reference: FormControl<string>;
  bankName: FormControl<string>;
  description: FormControl<string>;
}

export interface ScheduleFormControls {
  id: FormControl<string>;
  dueDate: FormControl<string>;
  amount: FormControl<number | null>;
  method: FormControl<SchedulePaymentMethod>;
  paidTo: FormControl<string>;
  description: FormControl<string>;
}

export interface BillFormControls {
  layoutId: FormControl<string>;
  estimateDate: FormControl<string>;
  bookingDate: FormControl<string>;
  plotName: FormControl<string>;
  gatNumber: FormControl<string>;
  customerName: FormControl<string>;
  plotNumber: FormControl<string>;
  plotArea: FormControl<number | null>;
  plotAreaUnit: FormControl<PlotAreaUnit>;
  totalPlotAmount: FormControl<number | null>;
  receivedPayments: FormArray<FormGroup<PaymentFormControls>>;
  balancePayments: FormArray<FormGroup<ScheduleFormControls>>;
  conditions: FormArray<FormControl<string>>;
}

export type BillFormGroup = FormGroup<BillFormControls>;
export type PaymentFormGroup = FormGroup<PaymentFormControls>;
export type ScheduleFormGroup = FormGroup<ScheduleFormControls>;

export function createPaymentGroup(payment?: Partial<PaymentEntry>): PaymentFormGroup {
  return new FormGroup<PaymentFormControls>({
    id: new FormControl(payment?.id ?? createId(), { nonNullable: true }),
    date: new FormControl(payment?.date ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    amount: new FormControl<number | null>(payment?.amount ?? null, {
      validators: [Validators.required, Validators.min(0.01)],
    }),
    method: new FormControl<ReceivedPaymentMethod>(payment?.method ?? 'CASH', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    paidTo: new FormControl(payment?.paidTo ?? DEFAULT_PAID_TO, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    receivedBy: new FormControl(payment?.receivedBy ?? '', { nonNullable: true }),
    reference: new FormControl(payment?.reference ?? '', { nonNullable: true }),
    bankName: new FormControl(payment?.bankName ?? '', { nonNullable: true }),
    description: new FormControl(payment?.description ?? '', { nonNullable: true }),
  });
}

export function createScheduleGroup(entry?: Partial<PaymentScheduleEntry>): ScheduleFormGroup {
  return new FormGroup<ScheduleFormControls>(
    {
      id: new FormControl(entry?.id ?? createId(), { nonNullable: true }),
      dueDate: new FormControl(entry?.dueDate ?? '', { nonNullable: true }),
      amount: new FormControl<number | null>(entry?.amount ?? null, {
        validators: [Validators.required, Validators.min(0.01)],
      }),
      method: new FormControl<SchedulePaymentMethod>(entry?.method ?? 'CHEQUE', {
        nonNullable: true,
      }),
      paidTo: new FormControl(entry?.paidTo ?? DEFAULT_PAID_TO, { nonNullable: true }),
      description: new FormControl(entry?.description ?? '', { nonNullable: true }),
    },
    { validators: [scheduleDueDateValidator] },
  );
}

export function createConditionControl(text = ''): FormControl<string> {
  return new FormControl(text, { nonNullable: true, validators: [Validators.required] });
}

const scheduleDueDateValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const method = control.get('method')?.value;
  const dueDate = control.get('dueDate')?.value;
  const dateOptional = method === 'DOCUMENTATION_DAY' || method === 'NOT_DECIDED';
  if (!dateOptional && !dueDate) {
    return { dueDateRequired: true };
  }
  return null;
};
