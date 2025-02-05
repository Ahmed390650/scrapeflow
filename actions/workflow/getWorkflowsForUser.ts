"use server";

import prisma from "@/database/prisma";
import { auth } from "@clerk/nextjs/server";

export const getWorkflowsForUser = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not found");
  }
  return await prisma.workflow.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};
