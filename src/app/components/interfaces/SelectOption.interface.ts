export interface SelectOption {
  display: string;
  value: string | number | boolean;
}

export interface AsyncSelectOption {
  url: string;
  path?: string;
  sortOrder?: string;
}
