"use client";
import { GetWorkflowExecutions } from "@/actions/workflow/GetWorkflowExecutions";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { DatesToDurationString } from "@/lib/helper/date";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import ExecutionStatusIndicator from "./ExecutionStatusIndicator";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { CoinsIcon } from "lucide-react";
import { useRouter } from "next/navigation";
type initialDataTypeProp = Awaited<ReturnType<typeof GetWorkflowExecutions>>;
const ExecutionTable = ({
  workflowId,
  initialData,
}: {
  workflowId: string;
  initialData: initialDataTypeProp;
}) => {
  const router = useRouter();
  const query = useQuery({
    queryFn: () => GetWorkflowExecutions(workflowId),
    queryKey: ["execution", workflowId],
    initialData,
    refetchInterval: 5000,
  });
  return (
    <div className=" overflow-auto rounded-lg shadow-md border">
      <Table className="h-full">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Consumed</TableHead>
            <TableHead className="text-right text-xs text-muted-foreground">
              Started At (desc)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="gap-2 h-full overflow-auto">
          {query.data.map(
            ({
              completedAt,
              startAt,
              createdAt,
              creditsConsumed,
              id,
              status,
              trigger,
            }) => {
              const duration = DatesToDurationString(completedAt, startAt);
              const formateStartAt =
                startAt &&
                formatDistanceToNow(startAt, {
                  addSuffix: true,
                });
              return (
                <TableRow
                  className="cursor-pointer"
                  key={id}
                  onClick={() => {
                    router.push(`/workflow/runs/${workflowId}/${id}`);
                  }}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold">{id}</span>
                      <div className="text-muted-foreground text-xs gap-2 flex items-center">
                        <span>Triggered via</span>
                        <Badge variant="outline">{trigger}</Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <ExecutionStatusIndicator
                          status={status as WorkflowExecutionStatus}
                        />
                        <span className="font-semibold capitalize">
                          {status}
                        </span>
                      </div>
                      <div className="text-muted-foreground text-xs mx-5">
                        {duration}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <CoinsIcon size={16} className="text-primary" />
                        <span className="font-semibold capitalize">
                          {creditsConsumed}
                        </span>
                      </div>
                      <div className="text-muted-foreground text-xs mx-5">
                        credits
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formateStartAt}
                  </TableCell>
                </TableRow>
              );
            }
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExecutionTable;
