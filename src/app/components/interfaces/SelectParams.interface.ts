import { SelectOption, AsyncSelectOption } from './SelectOption.interface';

export interface SelectParams {
  key?: string;
  name: string;
  type: string;
  label: string;
  options: SelectOption[] | AsyncSelectOption;
}
