import { ExecuteWorkflow } from "@/actions/workflow/executeWorkflow";
import prisma from "@/database/prisma";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { WorkflowExecutionPlan } from "@/types/appNode";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
} from "@/types/workflow";
import { timingSafeEqual } from "crypto";
import { CronExpressionParser } from "cron-parser";
const isValidSecert = (secert: string) => {
  const API_SECERT = process.env.API_SECERT;
  if (!API_SECERT) return false;
  try {
    return timingSafeEqual(Buffer.from(secert), Buffer.from(API_SECERT));
  } catch (error) {
    return false;
  }
};
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const secert = authHeader.split(" ")[1];
  if (!isValidSecert(secert)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const workflowId = searchParams.get("workflowId");
  if (!workflowId) {
    return Response.json({ error: "bad request" }, { status: 400 });
  }
  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
    },
  });

  const { userId, definition } = workflow!;
  const executionPlan = JSON.parse(
    workflow?.executionPlan!
  ) as WorkflowExecutionPlan;
  if (!executionPlan) {
    return Response.json({ error: "bad request" }, { status: 400 });
  }
  try {
    const crone = CronExpressionParser.parse(workflow?.cron!);
    const NextRuntAt = crone.next().toDate();
    const execution = await prisma.workflowExecution.create({
      data: {
        userId,
        workflowId,
        status: WorkflowExecutionStatus.PENDING,
        trigger: WorkflowExecutionTrigger.CRON,
        definition: definition,
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
    });

    await ExecuteWorkflow(execution.id, NextRuntAt);
  } catch (error) {
    return Response.json({ error: "bad request" }, { status: 500 });
  }

  return new Response(null, { status: 200 });
}
