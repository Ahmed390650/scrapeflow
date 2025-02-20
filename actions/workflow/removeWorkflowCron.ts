"use server";
import prisma from "@/database/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
export const RemoveWorkflowCron = async ({ id }: { id: string }) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not found");
  }
  try {
    await prisma.workflow.update({
      where: {
        id,
        userId,
      },
      data: {
        cron: null,
        NextRuntAt: null,
      },
    });
  } catch (error: any) {
    throw new Error(error);
  }
  revalidatePath("/workflows");
};
