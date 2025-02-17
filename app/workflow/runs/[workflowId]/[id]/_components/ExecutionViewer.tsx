"use client";
import { GetWorkflowExecutionWithPhases } from "@/actions/workflow/GetWorkflowExecutionWithPhases";
import GetWorkflowPhasesDetails from "@/actions/workflow/GetWorkflowPhasesDetails";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DatesToDurationString } from "@/lib/helper/date";
import { GetPhasesTotalCost } from "@/lib/helper/phases";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  CalendarIcon,
  CircleDashedIcon,
  Loader2Icon,
  LucideIcon,
  WorkflowIcon,
} from "lucide-react";
import { ReactNode, useState } from "react";
type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhases>>;
const ExecutionViewer = ({ initialData }: { initialData: ExecutionData }) => {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const query = useQuery({
    queryKey: ["execution", initialData?.id],
    initialData,
    queryFn: () => GetWorkflowExecutionWithPhases(initialData?.id!),
    refetchInterval: (q) =>
      q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false,
  });
  const phaseDetails = useQuery({
    queryKey: ["phaseDetails", selectedPhase],
    enabled: selectedPhase !== null,
    queryFn: () => GetWorkflowPhasesDetails(selectedPhase!),
  });
  const duration = DatesToDurationString(
    query.data?.completedAt,
    query.data?.startAt
  );

  const isRunning = query.data?.status === WorkflowExecutionStatus.RUNNING;
  const creditConsumed = GetPhasesTotalCost(query.data?.phases || []);
  return (
    <div className="flex w-full h-full">
      <aside className="w-[440px] min-w-[440px] max-w-[440px] border-r-2 border-separate flex flex-col flex-grow overflow-hidden">
        <div className="py-4 px-2">
          <ExecutionLabel
            Icon={CircleDashedIcon}
            label="status"
            value={query.data?.status}
          />
          <ExecutionLabel
            Icon={CalendarIcon}
            label="Started at"
            value={
              <span className="lowercase">
                {query.data?.startAt
                  ? formatDistanceToNow(new Date(query.data.startAt), {
                      addSuffix: true,
                    })
                  : "N/A"}
              </span>
            }
          />
          <ExecutionLabel
            Icon={CircleDashedIcon}
            label="Duration"
            value={
              duration ? (
                duration
              ) : (
                <Loader2Icon className="animate-spin" size={20} />
              )
            }
          />
          <ExecutionLabel
            Icon={CircleDashedIcon}
            label="Credits consumed"
            value={creditConsumed}
          />
        </div>
        <Separator />
        <div className="flex justify-center items-center py-2 px-4">
          <div className="text-muted-foreground flex items-center gap-2">
            <WorkflowIcon size={20} className="stroke-muted-foreground/80" />
            <span className="font-semibold">Phases</span>
          </div>
        </div>
        <Separator />
        <div className="overflow-auto h-full px-2 py-4">
          {query.data?.phases.map((phase, index) => (
            <Button
              variant={selectedPhase === phase.id ? "secondary" : "ghost"}
              className="w-full justify-between"
              onClick={() => {
                if (isRunning) return;
                setSelectedPhase(phase.id);
              }}
              key={phase.id}>
              <div className="flex items-center gap-2">
                <Badge variant={"outline"}>{index + 1}</Badge>
                <p className="font-semibold">{phase.name}</p>
              </div>
              <span className="text-muted-foreground">{phase.status}</span>
            </Button>
          ))}
        </div>
      </aside>
      <div className="flex w-full h-full">
        <pre>{JSON.stringify(phaseDetails.data, null, 4)}</pre>
      </div>
    </div>
  );
};

export default ExecutionViewer;
const ExecutionLabel = ({
  Icon,
  label,
  value,
}: {
  Icon: LucideIcon;
  label: ReactNode;
  value: ReactNode;
}) => {
  return (
    <div className="flex justify-between items-center py-2 px-4 text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon size={20} className="stroke-muted-foreground/80" />
        <span>{label}</span>
      </div>
      <div className="font-semibold capitalize flex  items-end gap-2">
        {value}
      </div>
    </div>
  );
};
