import { GetWorkflowExecutions } from "@/actions/workflow/GetWorkflowExecutions";
import { InboxIcon, Loader2Icon } from "lucide-react";
import { Suspense } from "react";
import { waitFor } from "@/lib/helper/waitFor";
import ExecutionTable from "./_components/ExecutionTable";
import Topbar from "../../_components/topbar/Topbar";

const Page = async ({
  params,
}: {
  params: Promise<{ workflowId: string }>;
}) => {
  const { workflowId } = await params;
  return (
    <div className="w-full h-full overflow-auto">
      <Topbar
        title="All runs"
        subTitle="List of all your workflow runs"
        hideButton
        workflowId={workflowId}
      />
      <Suspense
        fallback={
          <div className="flex items-center justify-center w-full h-full">
            <Loader2Icon size={30} className="animate-spin stroke-primary" />
          </div>
        }>
        <ExecutionWorkflow workflowId={workflowId} />
      </Suspense>
    </div>
  );
};

const ExecutionWorkflow = async ({ workflowId }: { workflowId: string }) => {
  const executions = await GetWorkflowExecutions(workflowId);
  await waitFor(3000);
  if (!executions) return <div>no Data</div>;
  if (executions.length === 0) {
    return (
      <div className="container w-full py-6">
        <div>
          <div>
            <InboxIcon size={40} className="stroke-primary" />
          </div>
          <div>
            <p>No runs have been triggered yet for this workflow</p>
            <p>You can trigger a new run in editor page</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="container py-6 w-full">
      <ExecutionTable workflowId={workflowId} initialData={executions} />
    </div>
  );
};
export default Page;
