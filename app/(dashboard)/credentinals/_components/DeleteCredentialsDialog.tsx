"use client";
import { DeleteCredentials } from "@/actions/credentials/deleteCredentials";
import { deleteWorkflow } from "@/actions/workflow/deleteWorkflow";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
interface Props {
  name: string;
}
const DeleteCredentialsDialog = ({ name }: Props) => {
  const [confirmText, setConfirmText] = useState("");
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: DeleteCredentials,
    onError: () => {
      toast.error("Failed to delete Credentials", {
        id: "delete-Credentials",
      });
    },
    onSuccess: () => {
      toast.success("Credentials deleted successfully", {
        id: "delete-Credentials",
      });
      setConfirmText("");
      setOpen((prev) => !prev);
    },
  });

  return (
    <AlertDialog onOpenChange={setOpen} open={open}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <XIcon size={18} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            if you delete this deleteCredentials, it will be permanently
            deleted.
          </AlertDialogDescription>
          <div className="flex flex-col py-2 gap-2">
            <p className="text-sm text-muted-foreground">
              if you are sure,entre &ldquo;<b>{name}</b>&ldquo; to confirm
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
            disabled={confirmText !== name || isPending}
            onClick={() => {
              toast.loading("Deleting Credentials...", {
                id: "delete-Credentials",
              });
              mutate(name);
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCredentialsDialog;
