import { getWorkflowsForUser } from "@/actions/workflow/getWorkflowsForUser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, InboxIcon } from "lucide-react";
import React, { Suspense } from "react";
import CreateWorkflowDialog from "./_components/CreateWorkflowDialog";
import WorflowCard from "./_components/WorflowCard";

const Page = () => {
  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">WorkFlows</h1>
          <p className="text-muted-foreground">Mange your WorkFlows</p>
        </div>
        <CreateWorkflowDialog triggerText="Create Workflow" />
      </div>
      <div className="h-full py-6">
        <Suspense fallback={<UserWorkflowsSkelton />}>
          <UserWorkflows />
        </Suspense>
      </div>
    </div>
  );
};
const UserWorkflowsSkelton = () => {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-32 w-full" />
      ))}
    </div>
  );
};
const UserWorkflows = async () => {
  const workflows = await getWorkflowsForUser();
  if (!workflows) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="w-4 h-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Something went wrong, please try again
        </AlertDescription>
      </Alert>
    );
  }
  if (workflows.length === 0) {
    return (
      <div className="flex flex-col gap-4 h-full items-center justify-center">
        <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
          <InboxIcon size={40} className="stroke-primary" />
        </div>
        <div className=" flex flex-col gap-1 text-center">
          <p className="font-bold">No workflow created yet</p>
          <p className="text-sm text-muted-foreground">
            Click the button below to create your first workflow
          </p>
        </div>
        <CreateWorkflowDialog triggerText="Create Your first workflow" />
      </div>
    );
  }
  return (
    <div className="grid grid-col-1 gap-4">
      {workflows.map((worflow) => (
        <WorflowCard key={worflow.id} workflow={worflow} />
      ))}
    </div>
  );
};
export default Page;
