import { SelectOption } from './SelectOption.interface';

export interface SelectParams {
  key?: string;
  name: string;
  type: string;
  label: string;
  options: SelectOption[];
}
