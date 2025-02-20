"use client";
import TooltipWrapper from "@/components/TooltipWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { WorkflowStatus } from "@/types/appNode";
import { Workflow } from "@prisma/client";
import {
  ChevronRightIcon,
  ClockIcon,
  CoinsIcon,
  CornerDownRight,
  FileTextIcon,
  MoreVerticalIcon,
  MoveRightIcon,
  PlayIcon,
  ShuffleIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import DeleteWorflowDialog from "./DeleteWorflowDialog";
import RunBtn from "./RunBtn";
import SchedulerDiaglog from "./SchedulerDiaglog";
import { Badge } from "@/components/ui/badge";
import ExecutionStatusIndicator, {
  ExecutionStatusLable,
} from "@/app/workflow/runs/[workflowId]/_components/ExecutionStatusIndicator";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { format, formatDistanceToNow } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import DuplicateWorkflowDialog from "./DuplicateWorkflowDialog";
const statusColors = {
  [WorkflowStatus.DRAFT]: "bg-yellow-400 text-yellow-600",
  [WorkflowStatus.PUBLISHED]: "bg-primary",
};
const WorflowCard = ({ workflow }: { workflow: Workflow }) => {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;
  return (
    <Card className="border border-separate shadow-sm rounded-lg overflow-hidden hover:shadow-md dark:shadow-primary/30 group/card">
      <CardContent className="p-4 flex items-center justify-between  h-[100px]">
        <div className="flex items-center justify-end space-x-3">
          <div
            className={cn(
              "w-10 h-10 rounded-full items-center flex justify-center",
              statusColors[workflow.status as WorkflowStatus]
            )}>
            {isDraft ? (
              <FileTextIcon className="h-5 w-5" />
            ) : (
              <PlayIcon className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-base overflow-hidden  font-bold text-muted-foreground flex items-center">
              <TooltipWrapper content={workflow.description}>
                <Button variant={"link"}>
                  <Link href={`/workflow/editor/${workflow.id}`}>
                    {workflow.name}
                  </Link>
                </Button>
              </TooltipWrapper>
              {isDraft && (
                <span className=" ml-2 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  Draft
                </span>
              )}
              <DuplicateWorkflowDialog workflowId={workflow.id} />
            </h3>
            <ScheduleSection
              cron={workflow.cron}
              workflowId={workflow.id}
              isDraft={isDraft}
              creditConsumed={workflow.creditsCost}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isDraft && <RunBtn workflowId={workflow.id} />}
          <Link
            href={`/workflow/editor/${workflow.id}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "flex items-center gap-2"
            )}>
            <ShuffleIcon size={16} />
            Edit
          </Link>
          <WorkflowActions
            workflowName={workflow.name}
            worflowId={workflow.id}
          />
        </div>
      </CardContent>
      <LastRunDetails workflow={workflow} />
    </Card>
  );
};
const WorkflowActions = ({
  workflowName,
  worflowId,
}: {
  worflowId: string;
  workflowName: string;
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <>
      <DeleteWorflowDialog
        open={openDialog}
        setOpen={setOpenDialog}
        workflowName={workflowName}
        worflowId={worflowId}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <TooltipWrapper content={"More Actions"}>
              <div className="flex items-center justify-center w-full h-full ">
                <MoreVerticalIcon size={18} />
              </div>
            </TooltipWrapper>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive flex items-center gap-2"
            onSelect={() => {
              setOpenDialog((prev) => !prev);
            }}>
            <TrashIcon size={16} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
const ScheduleSection = ({
  isDraft,
  creditConsumed,
  workflowId,
  cron,
}: {
  isDraft: boolean;
  creditConsumed: number;
  workflowId: string;
  cron: string | null;
}) => {
  if (isDraft) return null;
  return (
    <div className="flex gap-2 items-center">
      <CornerDownRight className="w-4 h-4 text-muted-foreground" />
      <SchedulerDiaglog
        workflowId={workflowId}
        cron={cron}
        key={`${cron}-${workflowId}`}
      />
      <MoveRightIcon className="h-4 w-4 text-muted-foreground" />
      <TooltipWrapper content="Credit consumption for full run">
        <div className="flex items-center ">
          <Badge
            variant={"outline"}
            className="space-x-2 text-muted-foreground rounded-sm ">
            <CoinsIcon className="w-4 h-4" />
            <span className="text-sm">{creditConsumed}</span>
          </Badge>
        </div>
      </TooltipWrapper>
    </div>
  );
};
const LastRunDetails = ({ workflow }: { workflow: Workflow }) => {
  const { status, lastRunAt, lastRunStatus, NextRuntAt } = workflow;
  if (status === WorkflowStatus.DRAFT) return null;
  const formatedStartedAt =
    lastRunAt &&
    formatDistanceToNow(lastRunAt, {
      addSuffix: true,
    });
  const nextSchedule = NextRuntAt && format(NextRuntAt, "yyyy-MM-dd HH:mm");
  const nextScheduleUTC =
    NextRuntAt && formatInTimeZone(NextRuntAt, "UTC", "HH:mm");
  return (
    <div className="flex items-center justify-between bg-primary/5 px-4 py-1 text-muted-foreground">
      <div>
        {lastRunAt && (
          <Link
            href={`/workflow/runs/${workflow.id}/${workflow.lastRunId}`}
            className="group flex items-center gap-2 text-sm">
            <span>Last run:</span>
            <ExecutionStatusIndicator
              status={lastRunStatus as WorkflowExecutionStatus}
            />
            <ExecutionStatusLable
              status={lastRunStatus as WorkflowExecutionStatus}
            />
            <span>{formatedStartedAt}</span>
            <ChevronRightIcon
              size={14}
              className="group-hover:translate-x-0 transition -translate-x-[2px]"
            />
          </Link>
        )}
        {!lastRunAt && <p>No runs yet</p>}
      </div>
      {NextRuntAt && (
        <div className="flex items-center gap-2 text-sm">
          <ClockIcon size={12} />
          <span>Next run at:</span>
          <span>{nextSchedule}</span>
          <span>({nextScheduleUTC})</span>
        </div>
      )}
    </div>
  );
};
export default WorflowCard;
