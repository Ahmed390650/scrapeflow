"use client";
import { UpdateWorkflowCron } from "@/actions/workflow/updateWorkflowCron";
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import {
  CalendarIcon,
  ClockIcon,
  Loader2Icon,
  TriangleAlertIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import cronstrue from "cronstrue";
import CronExpressionParser from "cron-parser";
import { RemoveWorkflowCron } from "@/actions/workflow/removeWorkflowCron";
import { Separator } from "@/components/ui/separator";
import { waitFor } from "@/lib/helper/waitFor";
const SchedulerDiaglog = (props: {
  workflowId: string;
  cron: string | null;
}) => {
  const [cron, setCron] = useState(props.cron || "");
  const [validCron, setValidCron] = useState(false);
  const [readableCron, setReadableCron] = useState("");
  const mutation = useMutation({
    mutationFn: UpdateWorkflowCron,
    onSuccess: () => {
      toast.success("Scheduler updates successfully", { id: "cron" });
    },
    onError: (error) => {
      toast.error(error.message, { id: "cron" });
    },
  });
  const removeCron = useMutation({
    mutationFn: RemoveWorkflowCron,
    onSuccess: () => {
      toast.success("Scheduler updates successfully", { id: "cron" });
    },
    onError: (error) => {
      toast.error(error.message, { id: "cron" });
    },
  });
  useEffect(() => {
    try {
      CronExpressionParser.parse(cron);
      const humanCronStr = cronstrue.toString(cron);
      setValidCron(true);
      setReadableCron(humanCronStr);
    } catch (error) {
      setValidCron(false);
    }
  }, [cron]);
  const workflowHasValidCron = props.cron && props.cron.length > 0;
  const readableSavedCron =
    workflowHasValidCron && cronstrue.toString(props.cron!);
  const handleSave = useCallback(() => {
    toast.loading("Saving ...", {
      id: "cron",
    });
    mutation.mutate({
      cron,
      id: props.workflowId,
    });
  }, [cron, props.workflowId, mutation]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          size="sm"
          className={cn(
            "text-sm p-0 h-auto text-orange-500",
            workflowHasValidCron && "text-primary"
          )}>
          <div className="flex items-center gap-1">
            {workflowHasValidCron ? (
              <div className="flex gap-2 items-center">
                <ClockIcon />
                {readableSavedCron}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <TriangleAlertIcon className="h-3 w-3" />
                set schedule
              </div>
            )}
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader
          title="Schedule workflow execution"
          Icon={CalendarIcon}
        />
        <div className="p-6 space-y-4">
          <p className="text-muted-foreground text-sm">
            Speacify a cron expression to schedule periodic workflow
            execution.All times are in UTC
          </p>
          <Input
            placeholder="E.G ******"
            value={cron}
            onChange={(e) => {
              setCron(e.target.value);
            }}
          />
          <div
            className={cn(
              "bg-accent p-4  rounded-md text-destructive border-destructive border text-sm",
              validCron && "text-primary border-primary"
            )}>
            {validCron ? readableCron : "Not a valid cron experssion"}
          </div>
          {workflowHasValidCron && (
            <DialogClose asChild>
              <div>
                <Button
                  disabled={mutation.isPending || removeCron.isPending}
                  className="w-full text-destructive border-destructive hover:text-destructive"
                  variant={"outline"}
                  onClick={(e) => {
                    toast.loading("Saving ...", {
                      id: "cron",
                    });
                    removeCron.mutate({ id: props.workflowId });
                  }}>
                  Remove current schedule
                </Button>
                <Separator className="my-4" />
              </div>
            </DialogClose>
          )}
        </div>
        <DialogFooter className="px-6 gap-2">
          <DialogClose asChild>
            <Button className="w-full" variant={"secondary"}>
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              disabled={mutation.isPending || !validCron}
              className="w-full"
              onClick={handleSave}>
              {mutation.isPending ? (
                <Loader2Icon size={14} className="animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SchedulerDiaglog;
