"use server";
import prisma from "@/database/prisma";
import { auth } from "@clerk/nextjs/server";
import { WorkflowExecutionPlan, WorkflowStatus } from "@/types/appNode";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
} from "@/types/workflow";
import { ExecuteWorkflow } from "./executeWorkflow";

export default async function RunWorkflow(form: {
  workflowId: string;
  flowDefinition?: string;
}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not found");
  }
  const { workflowId, flowDefinition } = form;
  if (!workflowId) {
    throw new Error("Workflow not found");
  }
  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId,
    },
  });
  if (!workflow) {
    throw new Error("Workflow not found");
  }
  let executionPlan: WorkflowExecutionPlan;
  let workflowDefinition = flowDefinition;

  if (workflow.status === WorkflowStatus.PUBLISHED) {
    if (!workflow.executionPlan) {
      throw new Error("no execution plan found in published workflow");
    }
    executionPlan = JSON.parse(workflow.executionPlan);
    workflowDefinition = workflow.definition;
  } else {
    if (!flowDefinition) {
      throw new Error("Flow definition not found");
    }
    const flow = JSON.parse(flowDefinition);
    const result = FlowToExecutionPlan(flow.nodes, flow.edges);
    if (result.error) {
      throw new Error("Execution plan not found");
    }
    if (!result.executionPlan) {
      throw new Error("Execution plan not found");
    }
    executionPlan = result.executionPlan;
  }

  const execution = await prisma.workflowExecution.create({
    data: {
      userId,
      workflowId,
      status: WorkflowExecutionStatus.PENDING,
      trigger: WorkflowExecutionTrigger.MANUAL,
      definition: workflowDefinition,
      phases: {
        create: executionPlan.flatMap((phase) =>
          phase.nodes.flatMap((node) => {
            return {
              userId,
              status: ExecutionPhaseStatus.PENDING,
              number: phase.phase,
              node: JSON.stringify(node),
              name: TaskRegistry[node.data.type].label,
            };
          })
        ),
      },
    },
    select: {
      id: true,
      phases: true,
    },
  });
  if (!execution) {
    throw new Error("workflow execution not created");
  }
  ExecuteWorkflow(execution.id);
  return execution;
}
