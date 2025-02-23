"use server";
import prisma from "@/database/prisma";
import { PeriodToDateRange } from "@/lib/helper/date";
import { Period } from "@/types/analytics";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
const { COMPLETED, FAILED } = WorkflowExecutionStatus;
export const GetStatsCardValues = async (period: Period) => {
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
      status: {
        in: [COMPLETED, FAILED],
      },
    },
    select: {
      creditsConsumed: true,
      phases: {
        where: {
          creditsConsumed: {
            not: null,
          },
        },
        select: {
          creditsConsumed: true,
        },
      },
    },
  });
  const stats = {
    workflowExecutions: executions.length,
    creditsConsumed: 0,
    phaseExecution: 0,
  };
  stats.creditsConsumed = executions.reduce(
    (sum, cur) => sum + cur.creditsConsumed!,
    0
  );
  stats.phaseExecution = executions.reduce(
    (sum, cur) => sum + cur.phases.length!,
    0
  );
  return stats;
};
