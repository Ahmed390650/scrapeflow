import { cn } from "@/lib/utils";
import { WorkflowExecutionStatus } from "@/types/workflow";
const indicatorColr: Record<WorkflowExecutionStatus, string> = {
  PENDING: "bg-slate-400",
  RUNNING: "bg-yellow-600 animate-pulse",
  FAILED: "bg-red-400",
  COMPLETED: "bg-emerald-600",
};
const ExecutionStatusIndicator = ({
  status,
}: {
  status: WorkflowExecutionStatus;
}) => {
  return (
    <div className={cn("w-2 h-2 rounded-full  ", indicatorColr[status])} />
  );
};

export default ExecutionStatusIndicator;
