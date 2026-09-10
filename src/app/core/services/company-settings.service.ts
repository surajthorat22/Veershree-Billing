import { computed, Injectable, signal } from '@angular/core';
import { DEFAULT_COMPANY } from '../defaults/defaults';
import { type CompanyDetails } from '../models/bill.model';

@Injectable({ providedIn: 'root' })
export class CompanySettings {
  private readonly companyState = signal<CompanyDetails>({ ...DEFAULT_COMPANY });

  readonly company = this.companyState.asReadonly();
  readonly companyName = computed(() => this.companyState().name);
}
