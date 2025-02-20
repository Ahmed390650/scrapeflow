"use server";

import prisma from "@/database/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { CronExpressionParser } from "cron-parser";
export const UpdateWorkflowCron = async ({
  id,
  cron,
}: {
  id: string;
  cron: string;
}) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not found");
  }
  try {
    const interval = CronExpressionParser.parse(cron);
    await prisma.workflow.update({
      where: {
        id,
        userId,
      },
      data: {
        cron,
        NextRuntAt: interval.next().toDate(),
      },
    });
  } catch (error: any) {
    throw new Error(error);
  }
  revalidatePath("/workflows");
};
