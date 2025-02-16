import { LucideProps } from "lucide-react";
import { taskParam, TaskType } from "./task";
import { AppNode } from "./workflow";

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
export type WorkflowTask = {
  label: string;
  type: TaskType;
  Icon: React.FC<LucideProps>;
  isEntryPoint?: boolean;
  credits: number;
  inputs: taskParam[];
  outputs: taskParam[];
};
export type WorkflowExecutionPlan = WorkflowExecutionPlanPhase[];
export type WorkflowExecutionPlanPhase = {
  phase: number;
  nodes: AppNode[];
};
export type AppNodeMissingInputs = {
  nodeId: string;
  inputs: string[];
};
