"use server";

import prisma from "@/database/prisma";
import { auth } from "@clerk/nextjs/server";

export const GetWorkflowExecutions = async (workflowId: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not found");
  }
  return prisma.workflowExecution.findMany({
    where: {
      workflowId: workflowId,
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
