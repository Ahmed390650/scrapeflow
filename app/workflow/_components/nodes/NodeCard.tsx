"use client";

import useFlowValidation from "@/lib/hooks/useFlowValidation";
import { cn } from "@/lib/utils";
import { useReactFlow } from "@xyflow/react";
import { ReactNode } from "react";

const NodeCard = ({
  children,
  nodeId,
  isSelected,
}: {
  children: ReactNode;
  nodeId: string;
  isSelected: boolean;
}) => {
  const { getNode, setCenter } = useReactFlow();
  const { invalidInputs } = useFlowValidation();
  const hasInvalidInputs = invalidInputs.some(
    (invalidInput) => invalidInput.nodeId === nodeId
  );
  return (
    <div
      onDoubleClick={() => {
        const node = getNode(nodeId);
        if (!node) return;
        const { position, measured } = node;
        if (!position || !measured) return;
        const { width, height } = measured;
        const x = position.x + width! / 2;
        const y = position.y + height! / 2;
        setCenter(x, y, {
          duration: 500,
          zoom: 1,
        });
      }}
      className={cn(
        "rounded-md cursor-pointer bg-secondary border-2 border-separate w-[420px] flex flex-col gap-1 text-xs",
        isSelected && "border-primary",
        hasInvalidInputs && "border-destructive border-2"
      )}>
      {children}
    </div>
  );
};

export default NodeCard;
