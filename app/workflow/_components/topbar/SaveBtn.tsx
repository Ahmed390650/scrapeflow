"use client";

import { updateWorkFlow } from "@/actions/workflow/UpdateWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { CheckIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

const SaveBtn = ({ workflowId }: { workflowId: string }) => {
  const { toObject } = useReactFlow();
  const { mutate, isPending } = useMutation({
    mutationFn: updateWorkFlow,
    onSuccess: () => {
      toast.success("Flow saved successfully", { id: "save-workflow" });
    },
    onError: () => {
      toast.error("Failed to save flow", { id: "save-workflow" });
    },
  });
  return (
    <Button
      disabled={isPending}
      variant={"outline"}
      onClick={() => {
        toast.loading("Saving flow ...", { id: "save-workflow" });
        mutate({
          definition: JSON.stringify(toObject()),
          id: workflowId,
        });
      }}
      className="flex items-center gap-2">
      {isPending ? (
        <Loader2 size={16} className="animate-spin " />
      ) : (
        <CheckIcon size={16} className="stroke-green-400" />
      )}
      Save
    </Button>
  );
};

export default SaveBtn;
