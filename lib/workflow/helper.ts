import { AppNode } from "@/types/workflow";
import { TaskRegistry } from "./task/registry";

export const CalculateWorkflowCost = (nodes: AppNode[]) => {
  return nodes.reduce((acc, prev) => {
    return acc + TaskRegistry[prev.data.type].credits;
  }, 0);
};
