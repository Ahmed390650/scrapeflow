"use server";
import prisma from "@/database/prisma";
import {
  createWorkflowSchema,
  createWorkflowSchemaType,
} from "@/lib/validation/workflow";
import { WorkflowStatus } from "@/types/indes";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const createWorkflow = async (values: createWorkflowSchemaType) => {
  const { success, data } = createWorkflowSchema.safeParse(values);
  if (!success) {
    throw new Error("Invalid form data ");
  }
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not found");
  }
  const result = await prisma.workflow.create({
    data: {
      userId,
      status: WorkflowStatus.DRAFT,
      definition: "TODO",
      ...data,
    },
  });
  if (!result) {
    throw new Error("Failed to create workflow");
  }
  revalidatePath("/workflows");
};
