import { Pipe, PipeTransform } from '@angular/core';
import { formatInr } from '../../core/utils/currency';

@Pipe({ name: 'inr' })
export class InrCurrencyPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    return formatInr(value);
  }
}
