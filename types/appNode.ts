import { taskParam } from "./task";

export enum WorkflowStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}
export interface paramProps {
  params: taskParam;
  value: string;
  disabled?: boolean;
  updateNodeParamValue: (data: string) => void;
}
