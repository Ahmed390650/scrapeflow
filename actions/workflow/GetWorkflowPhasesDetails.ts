"use server";

import prisma from "@/database/prisma";
import { auth } from "@clerk/nextjs/server";

const GetWorkflowPhasesDetails = async (phaseId: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not found");
  }
  return await prisma.executionPhase.findUnique({
    where: {
      id: phaseId,
      execution: {
        userId,
      },
    },
    include: {
      logs: {
        orderBy: {
          timestamp: "asc",
        },
      },
    },
  });
};

export default GetWorkflowPhasesDetails;
