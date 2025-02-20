"use client";
import { UnPublishWorkflow } from "@/actions/workflow/UnPublishWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { DownloadIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

const UnPublichedBtn = ({ workflowId }: { workflowId: string }) => {
  const { mutate, isPending } = useMutation({
    mutationFn: UnPublishWorkflow,
    onError: (error) => {
      toast.error("Something went wrong", {
        id: workflowId,
      });
    },
    onSuccess: (data) => {
      toast.success("Workflow UnPublished", { id: workflowId });
    },
  });
  return (
    <Button
      disabled={isPending}
      variant="outline"
      className="flex  items-center gap-2"
      onClick={() => {
        toast.loading("UnPublishing workflow ...", { id: workflowId });
        mutate(workflowId);
      }}>
      {isPending ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <DownloadIcon size={16} className="stroke-green-400" />
      )}
      UnPublish
    </Button>
  );
};

export default UnPublichedBtn;
