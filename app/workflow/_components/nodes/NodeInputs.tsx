import { cn } from "@/lib/utils";
import { taskParam } from "@/types/task";
import { Handle, Position } from "@xyflow/react";
import React, { ReactNode } from "react";
import NodeParamField from "./NodeParamField";

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
  return (
    <div className="bg-secondary w-full flex justify-start relative p-3">
      <NodeParamField input={input} nodeId={nodeId} />
      <Handle
        type="target"
        position={Position.Left}
        id={input.name}
        className={cn(
          "!bg-muted-foreground !border-2 !border-background !-left-2 !w-4 !h-4"
        )}
      />
    </div>
  );
};
export default NodeInputs;
