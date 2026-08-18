import { computed, inject, Injectable, signal } from '@angular/core';
import { createEmptyBill, DEFAULT_CONDITIONS } from '../defaults/defaults';
import { type BillData } from '../models/bill.model';
import {
  getTotalBalance,
  getTotalReceived,
  getTotalScheduledPayments,
} from '../utils/calculations';
import { CompanySettings } from './company-settings.service';
import { Storage } from './storage.service';

const DRAFT_KEY = 'veershree.bill.draft';
const CONDITIONS_KEY = 'veershree.conditions.last';

@Injectable({ providedIn: 'root' })
export class BillStore {
  private readonly storage = inject(Storage);
  private readonly companySettings = inject(CompanySettings);

  private readonly billState = signal<BillData>(this.loadDraft());

  readonly bill = this.billState.asReadonly();
  readonly totalReceived = computed(() => getTotalReceived(this.billState().receivedPayments));
  readonly totalBalance = computed(() =>
    getTotalBalance(this.billState().totalPlotAmount, this.billState().receivedPayments),
  );
  readonly totalScheduled = computed(() =>
    getTotalScheduledPayments(this.billState().balancePayments),
  );

  setBill(bill: BillData): void {
    const next: BillData = {
      ...bill,
      company: this.companySettings.company(),
    };
    this.billState.set(next);
    this.persist(next);
  }

  previewBill(): BillData {
    return {
      ...this.billState(),
      company: this.companySettings.company(),
    };
  }

  reset(): void {
    const next = createEmptyBill(this.companySettings.company(), this.lastUsedConditions());
    this.billState.set(next);
    this.storage.remove(DRAFT_KEY);
  }

  lastUsedConditions(): string[] {
    const stored = this.storage.read<string[]>(CONDITIONS_KEY);
    if (stored && stored.length > 0) {
      return stored;
    }
    return [...DEFAULT_CONDITIONS];
  }

  private loadDraft(): BillData {
    const stored = this.storage.read<BillData>(DRAFT_KEY);
    const company = this.companySettings.company();
    if (!stored) {
      return createEmptyBill(company, this.lastUsedConditions());
    }
    return {
      ...createEmptyBill(company, this.lastUsedConditions()),
      ...stored,
      company,
    };
  }

  private persist(bill: BillData): void {
    this.storage.write(DRAFT_KEY, bill);
    this.storage.write(CONDITIONS_KEY, bill.conditions);
  }
}
