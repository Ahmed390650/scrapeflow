export enum TaskType {
  LAUNCH_BROWSER = "LAUNCH_BROWSER",
}
export enum TaskParamType {
  STRING = "STRING",
}
export interface taskParam {
  name: string;
  required: boolean;
  type: TaskParamType;
  helperText?: string;
  hideHandle?: boolean;
  value?: string;
  [key: string]: any;
}
