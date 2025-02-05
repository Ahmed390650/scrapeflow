"use server";

import prisma from "@/database/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const deleteWorkflow = async (workflowId: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not found");
  }
  await prisma.workflow.deleteMany({
    where: {
      id: workflowId,
      userId,
    },
  });
  revalidatePath("/workflows");
};
