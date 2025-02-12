import { Button } from "@/components/ui/button";
import useExecutionPlan from "@/hooks/useExecutionPlan";
import { PlayIcon } from "lucide-react";
import React from "react";

const ExecutionBtn = ({ workflowId }: { workflowId: string }) => {
  const exec = useExecutionPlan();
  return (
    <Button
      variant="outline"
      className="flex  items-center gap-2"
      onClick={() => {
        const plan = exec();
        console.log("--- plan --");
        console.table(plan);
      }}>
      <PlayIcon size={16} className="stroke-orange-400" />
      Execute
    </Button>
  );
};

export default ExecutionBtn;
