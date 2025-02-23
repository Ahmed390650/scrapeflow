"use server";
import prisma from "@/database/prisma";
import { Period } from "@/types/analytics";
import { auth } from "@clerk/nextjs/server";

export const GetPeriods = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not found");
  }
  const years = await prisma.workflowExecution.aggregate({
    where: {
      userId,
    },
    _min: {
      startAt: true,
    },
  });

  const currentYear = new Date().getFullYear();
  const minYear = years._min.startAt
    ? years._min.startAt.getFullYear()
    : currentYear;
  const period: Period[] = [];
  for (let year = minYear; year <= currentYear; year++) {
    for (let month = 0; month <= 11; month++) {
      period.push({
        year,
        month,
      });
    }
  }
  return period;
};
