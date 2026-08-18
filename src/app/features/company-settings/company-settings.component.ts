import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { type CompanyDetails } from '../../core/models/bill.model';
import { CompanySettings } from '../../core/services/company-settings.service';
import { ImageUpload } from '../../shared/components/image-upload/image-upload.component';

@Component({
  selector: 'app-company-settings',
  imports: [FormsModule, RouterLink, ImageUpload],
  templateUrl: './company-settings.component.html',
  styleUrl: './company-settings.component.scss',
})
export class CompanySettingsPage {
  private readonly settings = inject(CompanySettings);

  protected readonly company = this.settings.company;

  protected update<K extends keyof CompanyDetails>(key: K, value: CompanyDetails[K]): void {
    this.settings.update({ [key]: value });
  }
}
