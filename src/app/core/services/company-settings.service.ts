import { computed, inject, Injectable, signal } from '@angular/core';
import { DEFAULT_COMPANY } from '../defaults/defaults';
import { type CompanyDetails } from '../models/bill.model';
import { Storage } from './storage.service';

const COMPANY_KEY = 'veershree.company';

@Injectable({ providedIn: 'root' })
export class CompanySettings {
  private readonly storage = inject(Storage);

  private readonly companyState = signal<CompanyDetails>(this.load());

  readonly company = this.companyState.asReadonly();
  readonly companyName = computed(() => this.companyState().name || DEFAULT_COMPANY.name);

  update(patch: Partial<CompanyDetails>): void {
    const next = { ...this.companyState(), ...patch };
    this.companyState.set(next);
    this.storage.write(COMPANY_KEY, next);
  }

  replace(company: CompanyDetails): void {
    this.companyState.set(company);
    this.storage.write(COMPANY_KEY, company);
  }

  private load(): CompanyDetails {
    const stored = this.storage.read<CompanyDetails>(COMPANY_KEY);
    return { ...DEFAULT_COMPANY, ...(stored ?? {}) };
  }
}
