"use server";

import prisma from "@/database/prisma";
import {
  duplicateWorkflowSchema,
  duplicateWorkflowSchemaType,
} from "@/lib/validation/workflow";
import { WorkflowStatus } from "@/types/appNode";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const DuplicateWorkflow = async (
  values: duplicateWorkflowSchemaType
) => {
  const { success, data } = duplicateWorkflowSchema.safeParse(values);
  if (!success) {
    throw new Error("Invalid form data ");
  }
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not found");
  }
  const sourceWorkflow = await prisma.workflow.findUnique({
    where: {
      id: values.workflowId,
      userId,
    },
  });
  if (!sourceWorkflow) {
    throw new Error("no source for workflow");
  }
  // Create flow entry point
  const result = await prisma.workflow.create({
    data: {
      userId,
      status: WorkflowStatus.DRAFT,
      definition: sourceWorkflow.definition,
      name: values.name,
      description: values.description,
    },
  });
  if (!result) {
    throw new Error("Failed to duplicate workflow");
  }
  revalidatePath("/workflows");
};
