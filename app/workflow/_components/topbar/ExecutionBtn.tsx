"use client";
import RunWorkflow from "@/actions/workflow/runWorkFlow";
import { Button } from "@/components/ui/button";
import useExecutionPlan from "@/lib/hooks/useExecutionPlan";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { Loader2, PlayIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const ExecutionBtn = ({ workflowId }: { workflowId: string }) => {
  const exec = useExecutionPlan();
  const { toObject } = useReactFlow();
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: RunWorkflow,
    onError: (error) => {
      toast.error("Failed to execute flow", { id: "run-workflow" });
    },
    onSuccess: (data) => {
      toast.success("Flow executed successfully", { id: "run-workflow" });
      router.push(`/workflow/runs/${workflowId}/${data.id}`);
    },
  });
  return (
    <Button
      disabled={isPending}
      variant="outline"
      className="flex  items-center gap-2"
      onClick={() => {
        const play = exec();
        if (!play) return;
        toast.loading("Executing flow ...", { id: "run-workflow" });
        mutate({ workflowId, flowDefinition: JSON.stringify(toObject()) });
      }}>
      {isPending ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <PlayIcon size={16} className="stroke-orange-400" />
      )}
      Execute
    </Button>
  );
};

export default ExecutionBtn;
