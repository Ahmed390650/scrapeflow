"use server";

import prisma from "@/database/prisma";
import { PeriodToDateRange } from "@/lib/helper/date";
import { Period } from "@/types/analytics";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { eachDayOfInterval, format } from "date-fns";
type status = Record<
  string,
  {
    success: number;
    failed: number;
  }
>;
export const GetWorkExecutionStatus = async (period: Period) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not found");
  }
  const dateRange = PeriodToDateRange(period);
  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId,
      startAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
    },
  });
  const formateDate = "yyyy-MM-dd";
  const status: status = eachDayOfInterval({
    start: dateRange.startDate,
    end: dateRange.endDate,
  })
    .map((date) => format(date, formateDate))
    .reduce((acc, date) => {
      acc[date] = {
        success: 0,
        failed: 0,
      };
      return acc;
    }, {} as status);
  executions.forEach((execution) => {
    const date = format(execution.startAt!, formateDate);
    if (execution.status === WorkflowExecutionStatus.COMPLETED) {
      status[date].success += 1;
    }
    if (execution.status === WorkflowExecutionStatus.FAILED) {
      status[date].failed += 1;
    }
  });
  const result = Object.entries(status).map(([date, info]) => ({
    date,
    ...info,
  }));
  return result;
};
