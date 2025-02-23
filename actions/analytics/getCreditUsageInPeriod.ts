"use server";

import prisma from "@/database/prisma";
import { PeriodToDateRange } from "@/lib/helper/date";
import { Period } from "@/types/analytics";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
} from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { eachDayOfInterval, format } from "date-fns";
type status = Record<
  string,
  {
    success: number;
    failed: number;
  }
>;
const { COMPLETED, FAILED } = ExecutionPhaseStatus;
export const GetCreditUsageInPeriod = async (period: Period) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not found");
  }
  const dateRange = PeriodToDateRange(period);
  const executionPhase = await prisma.executionPhase.findMany({
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
  executionPhase.forEach((phase) => {
    const date = format(phase.startAt!, formateDate);
    if (phase.status === COMPLETED) {
      status[date].success += phase.creditsConsumed!;
    }
    if (phase.status === FAILED) {
      status[date].failed += phase.creditsConsumed!;
    }
  });
  const result = Object.entries(status).map(([date, info]) => ({
    date,
    ...info,
  }));
  return result;
};
