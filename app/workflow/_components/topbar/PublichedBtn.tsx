"use client";
import { PublishWorkflow } from "@/actions/workflow/PublishWorkflow";
import RunWorkflow from "@/actions/workflow/runWorkFlow";
import { Button } from "@/components/ui/button";
import useExecutionPlan from "@/lib/hooks/useExecutionPlan";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { Loader2, PlayIcon, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const PublichedBtn = ({ workflowId }: { workflowId: string }) => {
  const exec = useExecutionPlan();
  const { toObject } = useReactFlow();
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: PublishWorkflow,
    onError: (error) => {
      toast.error("Something went wrong", {
        id: workflowId,
      });
    },
    onSuccess: (data) => {
      toast.success("Workflow published", { id: workflowId });
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
        toast.loading("Publishing workflow ...", { id: workflowId });
        mutate({ workflowId, flowDefinition: JSON.stringify(toObject()) });
      }}>
      {isPending ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Upload size={16} className="stroke-green-400" />
      )}
      Publish
    </Button>
  );
};

export default PublichedBtn;
