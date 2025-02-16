"use server";

import prisma from "@/database/prisma";
import { auth } from "@clerk/nextjs/server";

export const GetWorkflowExecutionWithPhases = async (id: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not found");

  return await prisma.workflowExecution.findUnique({
    where: {
      id,
      userId,
    },
    include: {
      phases: {
        orderBy: {
          number: "asc",
        },
      },
    },
  });
};
