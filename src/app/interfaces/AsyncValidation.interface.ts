export interface AsyncValidation {
  type: 'custom';
  url: string;
  name: string;
  value: any;
  message?: string;
}
