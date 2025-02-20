"use server";

import prisma from "@/database/prisma";
import { WorkflowStatus } from "@/types/appNode";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const UnPublishWorkflow = async (workflowId: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("unauthenticated");
  }
  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId,
    },
  });
  if (!workflow) {
    throw new Error("no workflow found");
  }
  if (workflow.status !== WorkflowStatus.PUBLISHED) {
    throw new Error("workflow can't unpuplished ");
  }
  await prisma.workflow.update({
    where: {
      id: workflowId,
      userId,
    },
    data: {
      status: WorkflowStatus.DRAFT,
      executionPlan: null,
      creditsCost: 0,
    },
  });

  revalidatePath(`/workflow/editor/${workflowId}`);
};
