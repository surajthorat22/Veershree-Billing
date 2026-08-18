import { DestroyRef, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { createEmptyBill } from '../../core/defaults/defaults';
import { createSampleBill } from '../../core/defaults/sample-bill';
import {
  type BillFormControls,
  type BillFormGroup,
  createConditionControl,
  createPaymentGroup,
  createScheduleGroup,
} from '../../core/forms/bill-form';
import { BILL_LAYOUT_OPTIONS } from '../../core/layouts/layout-catalog';
import { type BillData, type PlotAreaUnit } from '../../core/models/bill.model';
import { BillStore } from '../../core/services/bill.service';
import { CompanySettings } from '../../core/services/company-settings.service';
import {
  getTotalBalance,
  getTotalReceived,
  getTotalScheduledPayments,
} from '../../core/utils/calculations';
import { BillInformation } from './bill-information/bill-information.component';
import { ConditionsEditor } from './conditions-editor/conditions-editor.component';
import { FinancialSummary } from './financial-summary/financial-summary.component';
import { PaymentList } from './payment-list/payment-list.component';
import { PaymentSchedule } from './payment-schedule/payment-schedule.component';

@Component({
  selector: 'app-bill-creator',
  imports: [
    ReactiveFormsModule,
    BillInformation,
    FinancialSummary,
    PaymentList,
    PaymentSchedule,
    ConditionsEditor,
  ],
  templateUrl: './bill-creator.component.html',
  styleUrl: './bill-creator.component.scss',
})
export class BillCreator {
  private readonly billStore = inject(BillStore);
  private readonly companySettings = inject(CompanySettings);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly layouts = BILL_LAYOUT_OPTIONS;
  protected readonly submitted = signal(false);
  protected readonly form: BillFormGroup = this.createForm(this.billStore.bill());

  private readonly formValue = signal(this.form.getRawValue());

  protected readonly totalReceived = computed(() =>
    getTotalReceived(this.toBillData(this.formValue()).receivedPayments),
  );
  protected readonly totalBalance = computed(() => {
    const bill = this.toBillData(this.formValue());
    return getTotalBalance(bill.totalPlotAmount, bill.receivedPayments);
  });
  protected readonly totalScheduled = computed(() =>
    getTotalScheduledPayments(this.toBillData(this.formValue()).balancePayments),
  );
  protected readonly totalPlotAmount = computed(
    () => Number(this.formValue().totalPlotAmount ?? 0) || 0,
  );

  constructor() {
    this.form.valueChanges
      .pipe(debounceTime(120), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const value = this.form.getRawValue();
        this.formValue.set(value);
        this.billStore.setBill(this.toBillData(value));
      });
  }

  protected preview(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.billStore.setBill(this.toBillData(this.form.getRawValue()));
    void this.router.navigateByUrl('/preview');
  }

  protected loadSample(): void {
    const sample = createSampleBill(this.companySettings.company());
    this.replaceForm(sample);
    this.submitted.set(false);
  }

  protected clearDraft(): void {
    this.billStore.reset();
    this.replaceForm(
      createEmptyBill(this.companySettings.company(), this.billStore.lastUsedConditions()),
    );
    this.submitted.set(false);
  }

  private createForm(bill: BillData): BillFormGroup {
    return new FormGroup<BillFormControls>({
      layoutId: new FormControl(bill.layoutId, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      estimateDate: new FormControl(bill.estimateDate, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      bookingDate: new FormControl(bill.bookingDate, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      plotName: new FormControl(bill.plotName, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      gatNumber: new FormControl(bill.gatNumber ?? '', { nonNullable: true }),
      customerName: new FormControl(bill.customerName, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      plotNumber: new FormControl(bill.plotNumber, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      plotArea: new FormControl<number | null>(bill.plotArea ?? null),
      plotAreaUnit: new FormControl<PlotAreaUnit>(bill.plotAreaUnit ?? 'Sq.Ft', {
        nonNullable: true,
      }),
      totalPlotAmount: new FormControl<number | null>(bill.totalPlotAmount ?? 0, {
        validators: [Validators.required, Validators.min(0)],
      }),
      receivedPayments: new FormArray(
        bill.receivedPayments.map((payment) => createPaymentGroup(payment)),
      ),
      balancePayments: new FormArray(
        bill.balancePayments.map((entry) => createScheduleGroup(entry)),
      ),
      conditions: new FormArray(
        (bill.conditions.length ? bill.conditions : this.billStore.lastUsedConditions()).map(
          (text) => createConditionControl(text),
        ),
      ),
    });
  }

  private replaceForm(bill: BillData): void {
    this.form.patchValue({
      layoutId: bill.layoutId,
      estimateDate: bill.estimateDate,
      bookingDate: bill.bookingDate,
      plotName: bill.plotName,
      gatNumber: bill.gatNumber ?? '',
      customerName: bill.customerName,
      plotNumber: bill.plotNumber,
      plotArea: bill.plotArea ?? null,
      plotAreaUnit: bill.plotAreaUnit ?? 'Sq.Ft',
      totalPlotAmount: bill.totalPlotAmount,
    });
    this.replaceArray(
      this.form.controls.receivedPayments,
      bill.receivedPayments.map(createPaymentGroup),
    );
    this.replaceArray(
      this.form.controls.balancePayments,
      bill.balancePayments.map(createScheduleGroup),
    );
    this.replaceArray(
      this.form.controls.conditions,
      (bill.conditions.length ? bill.conditions : []).map((text) => createConditionControl(text)),
    );
    this.formValue.set(this.form.getRawValue());
    this.billStore.setBill(this.toBillData(this.form.getRawValue()));
  }

  private replaceArray(array: FormArray, controls: AbstractControl[]): void {
    array.clear();
    for (const control of controls) {
      array.push(control);
    }
  }

  private toBillData(value: ReturnType<BillFormGroup['getRawValue']>): BillData {
    return {
      layoutId: value.layoutId,
      estimateDate: value.estimateDate,
      bookingDate: value.bookingDate,
      plotName: value.plotName.trim(),
      gatNumber: value.gatNumber.trim(),
      customerName: value.customerName.trim(),
      plotNumber: value.plotNumber.trim(),
      plotArea: value.plotArea,
      plotAreaUnit: value.plotAreaUnit,
      totalPlotAmount: Number(value.totalPlotAmount ?? 0) || 0,
      receivedPayments: value.receivedPayments.map((payment) => ({
        ...payment,
        paidTo: payment.paidTo.trim(),
        receivedBy: payment.receivedBy.trim(),
        reference: payment.reference.trim(),
        bankName: payment.bankName.trim(),
        description: payment.description.trim(),
        amount: Number(payment.amount ?? 0) || 0,
      })),
      balancePayments: value.balancePayments.map((entry) => ({
        ...entry,
        paidTo: entry.paidTo.trim(),
        description: entry.description.trim(),
        amount: Number(entry.amount ?? 0) || 0,
      })),
      conditions: value.conditions.map((text) => text.trim()).filter((text) => text.length > 0),
      company: this.companySettings.company(),
    };
  }
}
