"use client";
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CopyIcon, Layers2Icon, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  duplicateWorkflowSchema,
  duplicateWorkflowSchemaType,
} from "@/lib/validation/workflow";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DuplicateWorkflow } from "@/actions/workflow/duplicateWorkflow";
import { cn } from "@/lib/utils";
import TooltipWrapper from "@/components/TooltipWrapper";

const DuplicateWorkflowDialog = ({ workflowId }: { workflowId?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const form = useForm<duplicateWorkflowSchemaType>({
    resolver: zodResolver(duplicateWorkflowSchema),
    defaultValues: {
      name: "",
      description: "",
      workflowId,
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: DuplicateWorkflow,
    onSuccess: () => {
      toast.success("Workflow duplicate successfully", {
        id: "duplicate-workflow",
      });
      setIsOpen(false);
      form.reset();
    },
    onError: (error) => {
      console.log(error);
      toast.error("Failed to duplicate workflow", { id: "duplicate-workflow" });
    },
  });
  const onSubmit = useCallback(
    (values: duplicateWorkflowSchemaType) => {
      toast.loading("duplicating workflow.....", { id: "duplicate-workflow" });
      mutate(values);
    },
    [mutate]
  );
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size={"icon"}
          className={cn(
            "ml-2 transition-opacity duration-200 hidden group-hover/card:flex items-center justify-center"
          )}>
          <TooltipWrapper content={`Copy for ID ${workflowId}`}>
            <div>
              <CopyIcon className="w-4 h-4 text-muted-foreground cursor-pointer" />
            </div>
          </TooltipWrapper>
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader Icon={Layers2Icon} title="Duplicate Workflow" />
        <div className="p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-full">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Name
                      <p className="text-xs text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a description and uniqure name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Description
                      <p className="text-xs text-muted-foreground">
                        (optional)
                      </p>
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a breif description of what your worflow does.This
                      is optional but can help you remember the worflow&apos;s
                      purpose
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : "Proceed"}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DuplicateWorkflowDialog;
