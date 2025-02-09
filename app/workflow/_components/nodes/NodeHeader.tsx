"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { TaskType } from "@/types/task";
import { CoinsIcon, GripVerticalIcon } from "lucide-react";

const NodeHeader = ({ taskType }: { taskType: TaskType }) => {
  const { Icon, label, type, isEntryPoint } = TaskRegistry[taskType];
  return (
    <div className="flex items-center gap-2 p-2">
      <Icon size={16} />
      <div className="flex items-center justify-between w-full">
        <p className="text-xs font-bold uppercase text-muted-foreground">
          {label}
        </p>
        <div className="flex gap-1 items-center">
          {isEntryPoint && <Badge>Entry Point</Badge>}
          <Badge className="gap-2 flex items-center text-sm">
            <CoinsIcon size={16} />
            TODO
          </Badge>
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
