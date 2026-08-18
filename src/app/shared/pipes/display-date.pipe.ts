import { Pipe, PipeTransform } from '@angular/core';
import { formatDisplayDate } from '../../core/utils/date-format';

@Pipe({ name: 'displayDate' })
export class DisplayDatePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    return formatDisplayDate(value);
  }
}
