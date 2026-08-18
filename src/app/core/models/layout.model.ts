import { type Type } from '@angular/core';

export interface BillLayoutDefinition {
  id: string;
  name: string;
  component: Type<unknown>;
}
