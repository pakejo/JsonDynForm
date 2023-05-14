export interface AsyncValidation {
  type: 'custom' | 'external';
  url: string;
  name: string;
  value: any;
  message?: string;
}
