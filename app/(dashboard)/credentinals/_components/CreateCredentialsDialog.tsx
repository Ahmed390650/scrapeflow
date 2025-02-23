"use client";
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Layers2Icon, Loader2 } from "lucide-react";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  createCredentialsSchema,
  createCredentialsSchemaType,
} from "@/lib/validation/credentials";
import { CreateCredentials } from "@/actions/credentials/createCredentials";

const CreateCredentialsDialog = ({ triggerText }: { triggerText?: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();
  const form = useForm<createCredentialsSchemaType>({
    resolver: zodResolver(createCredentialsSchema),
    defaultValues: {},
  });
  const { mutate, isPending } = useMutation({
    mutationFn: CreateCredentials,
    onSuccess: () => {
      toast.success("Credentials created successfully", {
        id: "create-Credentials",
      });
      setIsOpen(false);
      form.reset();
    },
    onError: (error) => {
      console.log(error);
      toast.error("Failed to create Credentials", { id: "create-Credentials" });
    },
  });
  const onSubmit = useCallback(
    (values: createCredentialsSchemaType) => {
      toast.loading("Creating Credentials.....", { id: "create-Credentials" });
      mutate(values);
    },
    [mutate]
  );
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>{triggerText ?? "Create Credentials"}</Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          Icon={Layers2Icon}
          title="Create Credentials"
          subTitle="start building your Credentials"
        />
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
                      Enter a unique an descriptive name for the credential
                      <br />
                      This name will be user to identify the credential
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Value
                      <p className="text-xs text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the value associated with this credential
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

export default CreateCredentialsDialog;
