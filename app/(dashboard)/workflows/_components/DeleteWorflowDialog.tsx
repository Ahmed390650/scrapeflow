"use client";
import { deleteWorkflow } from "@/actions/workflow/deleteWorkflow";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  workflowName: string;
  worflowId: string;
}
const DeleteWorflowDialog = ({
  open,
  setOpen,
  workflowName,
  worflowId,
}: Props) => {
  const [confirmText, setConfirmText] = useState("");
  const { mutate, isPending } = useMutation({
    mutationFn: deleteWorkflow,
    onError: () => {
      toast.error("Failed to delete workflow", { id: "delete-workflow" });
    },
    onSuccess: () => {
      toast.success("Workflow deleted successfully", { id: "delete-workflow" });
      setConfirmText("");
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            if you delete this workflow, it will be permanently deleted.
          </AlertDialogDescription>
          <div className="flex flex-col py-2 gap-2">
            <p className="text-sm text-muted-foreground">
              if you are sure,entre &ldquo;<b>{workflowName}</b>&ldquo; to
              confirm
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmText("")}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={confirmText !== workflowName || isPending}
            onClick={() => {
              toast.loading("Deleting workflow...", { id: "delete-workflow" });
              mutate(worflowId);
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteWorflowDialog;
