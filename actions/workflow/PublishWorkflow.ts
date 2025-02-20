"use server";
import prisma from "@/database/prisma";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { CalculateWorkflowCost } from "@/lib/workflow/helper";
import { WorkflowStatus } from "@/types/appNode";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const PublishWorkflow = async ({
  workflowId,
  flowDefinition,
}: {
  workflowId: string;
  flowDefinition: string;
}) => {
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
    throw new Error("workflow not found");
  }
  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error("workflow is not  a Draft");
  }
  const flow = JSON.parse(flowDefinition);
  const result = FlowToExecutionPlan(flow.nodes, flow.edges);
  if (result.error) {
    throw new Error("flow definition in not valid");
  }
  if (!result.executionPlan) {
    throw new Error("no execution plan generated");
  }
  const creditsCost = CalculateWorkflowCost(flow.nodes);
  await prisma.workflow.update({
    where: {
      id: workflowId,
      userId,
    },
    data: {
      executionPlan: JSON.stringify(result.executionPlan),
      creditsCost,
      definition: flowDefinition,
      status: WorkflowStatus.PUBLISHED,
    },
  });
  revalidatePath(`/workflow/editor/${workflowId}`);
};
