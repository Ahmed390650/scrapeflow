"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { TaskType } from "@/types/task";
import { AppNode } from "@/types/workflow";
import { useReactFlow } from "@xyflow/react";
import { CoinsIcon, CopyIcon, GripVerticalIcon, TrashIcon } from "lucide-react";

const NodeHeader = ({
  taskType,
  nodeId,
}: {
  taskType: TaskType;
  nodeId: string;
}) => {
  const { Icon, label, type, isEntryPoint, credits } = TaskRegistry[taskType];
  const { deleteElements, getNode, addNodes } = useReactFlow();
  return (
    <div className="flex items-center gap-2 p-2 bg-background">
      <Icon size={16} />
      <div className="flex items-center justify-between w-full">
        <p className="text-xs font-bold uppercase text-muted-foreground">
          {label}
        </p>
        <div className="flex gap-1 items-center">
          {isEntryPoint && <Badge>Entry Point</Badge>}
          <Badge className="gap-2 flex items-center text-sm">
            <CoinsIcon size={16} />
            {credits}
          </Badge>
          {!isEntryPoint && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  deleteElements({ nodes: [{ id: nodeId }] });
                }}>
                <TrashIcon size={12} className="stroke-red-600" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const node = getNode(nodeId) as AppNode;
                  const newX = node.position.x;
                  const newY = node.position.y + node.measured?.height! + 20;
                  const newNode = createFlowNode(taskType, {
                    x: newX,
                    y: newY,
                  });
                  addNodes(newNode);
                }}>
                <CopyIcon size={12} />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="drag-handle cursor-grab">
            <GripVerticalIcon size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NodeHeader;
