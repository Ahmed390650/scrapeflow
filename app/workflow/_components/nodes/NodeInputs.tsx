import { cn } from "@/lib/utils";
import { taskParam } from "@/types/task";
import { Handle, Position, useEdges } from "@xyflow/react";
import React, { ReactNode } from "react";
import NodeParamField from "./NodeParamField";
import { ColorForHandler } from "./common";
import useFlowValidation from "@/lib/hooks/useFlowValidation";

const NodeInputs = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col divide-y gap-2">{children}</div>;
};
export const NodeInput = ({
  input,
  nodeId,
}: {
  input: taskParam;
  nodeId: string;
}) => {
  const edges = useEdges();
  const { invalidInputs } = useFlowValidation();
  const hasError = invalidInputs
    .find((inputError) => inputError.nodeId === nodeId)
    ?.inputs.find((invalidInput) => invalidInput === input.name);
  //check if input is connect to some of edges
  const isConnected = edges.some(
    (edge) => edge.target === nodeId && edge.targetHandle === input.name
  );
  return (
    <div
      className={cn(
        `bg-secondary w-full flex justify-start relative p-3`,
        hasError && "bg-destructive/30"
      )}>
      <NodeParamField input={input} nodeId={nodeId} disabled={isConnected} />
      {!input.hideHandle && (
        <Handle
          type="target"
          position={Position.Left}
          id={input.name}
          isConnectable={!isConnected}
          className={cn(
            "!bg-muted-foreground !border-2 !border-background !-left-2 !w-4 !h-4",
            ColorForHandler[input.type]
          )}
        />
      )}
    </div>
  );
};
export default NodeInputs;
