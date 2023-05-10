export interface InputParams {
  key?: string;
  type: string;
  name: string;
  label: string;
  icon: string;
  validations: {
    sync: any[];
    async: any[];
  };
}
