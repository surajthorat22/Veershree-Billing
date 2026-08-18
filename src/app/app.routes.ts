import { Routes } from '@angular/router';
import { BillCreator } from './features/bill-creator/bill-creator.component';
import { BillPreview } from './features/bill-preview/bill-preview.component';
import { CompanySettingsPage } from './features/company-settings/company-settings.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'create' },
  { path: 'create', component: BillCreator },
  { path: 'preview', component: BillPreview },
  { path: 'settings', component: CompanySettingsPage },
  { path: '**', redirectTo: 'create' },
];
