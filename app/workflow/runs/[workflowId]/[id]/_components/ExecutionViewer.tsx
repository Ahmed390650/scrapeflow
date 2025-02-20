"use client";
import { GetWorkflowExecutionWithPhases } from "@/actions/workflow/GetWorkflowExecutionWithPhases";
import GetWorkflowPhasesDetails from "@/actions/workflow/GetWorkflowPhasesDetails";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { DatesToDurationString } from "@/lib/helper/date";
import { GetPhasesTotalCost } from "@/lib/helper/phases";
import { cn } from "@/lib/utils";
import { logLevel } from "@/types/logs";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
} from "@/types/workflow";
import { ExecutionLog } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  CalendarIcon,
  CircleDashedIcon,
  CoinsIcon,
  Loader2Icon,
  LucideIcon,
  WorkflowIcon,
} from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import PhaseStatusBagde from "./PhaseStatusBagde";
import ReactCountUpWrapper from "@/components/ReactCountWrapper";
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
    queryKey: ["phaseDetails", selectedPhase, query.data?.status],
    enabled: selectedPhase !== null,
    queryFn: () => GetWorkflowPhasesDetails(selectedPhase!),
  });
  const isRunning = query.data?.status === WorkflowExecutionStatus.RUNNING;

  useEffect(() => {
    //while running we auto-select the current running phase in the sidebar
    const phases = query.data?.phases || [];
    if (isRunning) {
      const selectedPhase = phases.toSorted((a, b) =>
        a.startAt! < b.startAt! ? 1 : -1
      )[0];
      setSelectedPhase(selectedPhase.id);
      return;
    }
    const selectedPhase = phases.toSorted((a, b) =>
      a.completedAt! < b.completedAt! ? 1 : -1
    )[0];
    setSelectedPhase(selectedPhase.id);
  }, [query.data?.phases, isRunning]);
  const duration = DatesToDurationString(
    query.data?.completedAt,
    query.data?.startAt
  );
  const creditConsumed = GetPhasesTotalCost(query.data?.phases || []);
  return (
    <div className="flex w-full h-full">
      <aside className="w-[440px] min-w-[440px] max-w-[440px] border-r-2 border-separate flex flex-col flex-grow overflow-hidden">
        <div className="py-4 px-2">
          <ExecutionLabel
            Icon={CircleDashedIcon}
            label="status"
            value={
              <div className="font-semibold capitalize flex gap-2 items-center ">
                <PhaseStatusBagde
                  status={query.data?.status as ExecutionPhaseStatus}
                />
                <span>{query.data?.status}</span>
              </div>
            }
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
            value={<ReactCountUpWrapper value={creditConsumed} />}
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
              <PhaseStatusBagde status={phase.status as ExecutionPhaseStatus} />
            </Button>
          ))}
        </div>
      </aside>

      <div className="flex w-full h-full">
        {isRunning && (
          <div className="flex items-center justify-center h-full w-full flex-col gap-1">
            <p className="font-bold">Run is in progress, please wait ...</p>
          </div>
        )}
        {!isRunning && !selectedPhase && (
          <div className="flex items-center justify-center h-full w-full flex-col gap-1">
            <div className="flex flex-col gap-1 text-center">
              <p className="font-bold">No phase Selected</p>
              <p className="text-muted-foreground text-sm ">
                Select a phase to view details
              </p>
            </div>
          </div>
        )}
        {!isRunning && selectedPhase && phaseDetails.data && (
          <div className="flex flex-col gap-4 overflow-auto container py-4">
            <div className="flex gap-2 items-center">
              <Badge variant={"outline"} className="space-x-4">
                <div className="flex items-center gap-1">
                  <CoinsIcon size={18} className="stroke-muted-foreground" />
                  <span>Credits</span>
                </div>
                <span>{phaseDetails.data.creditsConsumed}</span>
              </Badge>
              <Badge variant={"outline"} className="space-x-4">
                <div className="flex items-center gap-1">
                  <CoinsIcon size={18} className="stroke-muted-foreground" />
                  <span>Duration</span>
                </div>
                <span>
                  {DatesToDurationString(
                    phaseDetails.data.completedAt,
                    phaseDetails.data.startAt
                  ) || "-"}
                </span>
              </Badge>
            </div>
            <ParamterViewer
              title="Inputs"
              subTitle="Inputs used for this phase"
              paramsJson={phaseDetails.data.inputs}
            />
            <ParamterViewer
              title="Outputs"
              subTitle="outputs generated by this phase"
              paramsJson={phaseDetails.data.outputs}
            />
            <LogViewer logs={phaseDetails.data.logs} />
          </div>
        )}
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
const ParamterViewer = ({
  title,
  subTitle,
  paramsJson,
}: {
  title: string;
  subTitle: string;
  paramsJson: string | null;
}) => {
  const params = paramsJson ? JSON.parse(paramsJson) : undefined;
  return (
    <Card>
      <CardHeader className="rounded-lg rounded-b-none border-b py-4 bg-gray-50 dark:bg-background">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          {subTitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="py-4">
        <div className="flex flex-col gap-2">
          {(!params || Object.keys(params).length === 0) && (
            <p className="text-sm">No Parameters generated by this phase</p>
          )}
          {params &&
            Object.entries(params).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between items-center space-y-1">
                <p className="flex-1 basis-1/3 text-muted-foreground text-sm">
                  {key}
                </p>
                <Input
                  readOnly
                  value={value as string}
                  className="flex basis-2/3"
                />
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};
const LogViewer = ({ logs }: { logs: ExecutionLog[] | undefined }) => {
  if (!logs || logs.length === 0) return null;
  return (
    <Card>
      <CardHeader className="rounded-lg rounded-b-none border-b py-4 bg-gray-50 dark:bg-background">
        <CardTitle className="text-base">Logs</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Logs generated by this phase
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell
                  width={190}
                  className="text-sm text-muted-foreground p-[2px] pl-4">
                  {log.timestamp.toISOString()}
                </TableCell>
                <TableCell
                  width={80}
                  className={cn(
                    "text-sm uppercase font-bold p-[3px] pl-4",
                    (log.logLevel as logLevel) === "error" &&
                      "text-destructive",
                    (log.logLevel as logLevel) === "info" && "text-primary"
                  )}>
                  {log.logLevel}
                </TableCell>
                <TableCell className="text-sm flex-1 p-[3px]">
                  {log.message}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
