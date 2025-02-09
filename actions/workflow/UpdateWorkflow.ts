"use server";
import prisma from "@/database/prisma";
import { WorkflowStatus } from "@/types/appNode";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const updateWorkFlow = async ({
  id,
  definition,
}: {
  id: string;
  definition: string;
}) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("unathenicated");
  }
  const workflow = await prisma.workflow.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!workflow) {
    throw new Error("workflow not found");
  }
  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error("workflow is not a draft");
  }
  await prisma.workflow.update({
    where: {
      id,
      userId,
    },
    data: {
      definition,
    },
  });
  revalidatePath("/workflow");
};
