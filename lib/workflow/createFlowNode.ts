import { TaskType } from "@/types/task";
import { AppNode } from "@/types/workflow";

export const createFlowNode = (
  nodeType: TaskType,
  position?: { x: number; y: number }
): AppNode => {
  return {
    id: crypto.randomUUID(),
    type: "FlowScrapeNode",
    data: {
      type: nodeType,
      inputs: {},
    },
    dragHandle: ".drag-handle",
    position: position || { x: 0, y: 0 },
  };
};
