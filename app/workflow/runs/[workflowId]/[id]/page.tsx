import { GetWorkflowExecutionWithPhases } from "@/actions/workflow/GetWorkflowExecutionWithPhases";
import Topbar from "@/app/workflow/_components/topbar/Topbar";
import { waitFor } from "@/lib/helper/waitFor";
import { Loader2Icon } from "lucide-react";
import React, { Suspense } from "react";
import ExecutionViewer from "./_components/ExecutionViewer";

const page = async ({
  params,
}: {
  params: Promise<{ workflowId: string; id: string }>;
}) => {
  const { id, workflowId } = await params;
  return (
    <div className="h-screen overflow-hidden w-full flex flex-col">
      <Topbar
        title="Workflow run details"
        workflowId={workflowId}
        subTitle={`Run ID: ${id}`}
        hideButton
      />
      <section className="flex h-full overflow-auto">
        <Suspense
          fallback={
            <div className="flex items-center justify-center w-full ">
              <Loader2Icon className="w-10 h-10 animate-spin stroke-primary" />
            </div>
          }>
          <ExecutionViewerWrapper executionId={id} />
        </Suspense>
      </section>
    </div>
  );
};
const ExecutionViewerWrapper = async ({
  executionId,
}: {
  executionId: string;
}) => {
  const workflowExecution = await GetWorkflowExecutionWithPhases(executionId);
  if (!workflowExecution) {
    return <div>no Found</div>;
  }
  return <ExecutionViewer initialData={workflowExecution} />;
};
export default page;
