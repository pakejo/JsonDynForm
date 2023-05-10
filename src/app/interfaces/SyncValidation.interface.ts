import { BasicValidations } from '../data/basicValidations';
export interface SyncValidation {
  type: keyof typeof BasicValidations | 'custom';
  name: string;
  value: any;
  message: string;
}
