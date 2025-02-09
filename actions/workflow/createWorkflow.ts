"use server";
import prisma from "@/database/prisma";
import {
  createWorkflowSchema,
  createWorkflowSchemaType,
} from "@/lib/validation/workflow";
import { createFlowNode } from "@/lib/workflow/createFlowNode";
import { WorkflowStatus } from "@/types/appNode";
import { TaskType } from "@/types/task";
import { AppNode } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { Edge } from "@xyflow/react";
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
  const initialFlow: { nodes: AppNode[]; edges: Edge[] } = {
    nodes: [],
    edges: [],
  };
  // Create flow entry point
  initialFlow.nodes.push(createFlowNode(TaskType.LAUNCH_BROWSER));
  const result = await prisma.workflow.create({
    data: {
      userId,
      status: WorkflowStatus.DRAFT,
      definition: JSON.stringify(initialFlow),
      ...data,
    },
  });
  if (!result) {
    throw new Error("Failed to create workflow");
  }
  return result;
};
