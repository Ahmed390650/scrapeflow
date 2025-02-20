"use client";
import { cn } from "@/lib/utils";
import { taskParam } from "@/types/task";
import { Handle, Position } from "@xyflow/react";
import React, { ReactNode } from "react";
import { ColorForHandler } from "./common";

const NodeOutputs = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col divide-y gap-1">{children}</div>;
};
export const NodeOutput = ({ output }: { output: taskParam }) => {
  return (
    <div className="flex justify-end relative p-3 bg-secondary">
      <p className="text-xs text-muted-foreground">{output.name}</p>
      {!output.hideHandle && (
        <Handle
          type="source"
          id={output.name}
          position={Position.Right}
          className={cn(
            "!bg-muted !border-2 !border-background !-right-2 !w-4 !h-4",
            ColorForHandler[output.type]
          )}
        />
      )}
    </div>
  );
};
export default NodeOutputs;
