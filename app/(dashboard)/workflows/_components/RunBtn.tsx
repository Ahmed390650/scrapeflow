"use client";
import RunWorkflow from "@/actions/workflow/runWorkFlow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon, PlayIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const RunBtn = ({ workflowId }: { workflowId: string }) => {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: (data) => {
      toast.success("Execution workflow is success", {
        id: workflowId,
      });
      router.push(`/workflow/runs/${workflowId}/${data.id}`);
    },
    onError: (error) => {
      toast.error(error.message, {
        id: workflowId,
      });
    },
  });
  return (
    <Button
      variant="outline"
      disabled={isPending}
      onClick={() => {
        toast.loading("Execution loading ...", {
          id: workflowId,
        });
        mutate({ workflowId });
      }}>
      {isPending ? (
        <Loader2Icon size={16} className="animate-spin" />
      ) : (
        <PlayIcon size={16} />
      )}
      Run
    </Button>
  );
};

export default RunBtn;
