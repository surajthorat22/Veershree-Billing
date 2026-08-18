import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { type BillFormGroup, createConditionControl } from '../../../core/forms/bill-form';

@Component({
  selector: 'app-conditions-editor',
  imports: [ReactiveFormsModule],
  templateUrl: './conditions-editor.component.html',
  styleUrl: './conditions-editor.component.scss',
})
export class ConditionsEditor {
  readonly form = input.required<BillFormGroup>();

  protected conditions() {
    return this.form().controls.conditions;
  }

  protected add(): void {
    this.conditions().push(createConditionControl(''));
  }

  protected remove(index: number): void {
    this.conditions().removeAt(index);
  }
}
