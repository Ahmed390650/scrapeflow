import { WorkflowExecution } from "./../node_modules/.prisma/client/index.d";
import { Node } from "@xyflow/react";
import { TaskType } from "./task";
export interface AppNodeData {
  type: TaskType;
  inputs: Record<string, string>;
  [key: string]: any;
}
export interface AppNode extends Node {
  data: AppNodeData;
}
export enum WorkflowExecutionStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}
export enum WorkflowExecutionTrigger {
  MANUAL = "MANUAL",
}
export enum ExecutionPhaseStatus {
  CREATED = "CREATED",
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}
