import prisma from "@/database/prisma";
import { waitFor } from "@/lib/helper/waitFor";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
} from "@/types/workflow";
import "server-only";

export const ExecuteWorkflow = async (executionId: string) => {
  const execution = await prisma.workflowExecution.findUnique({
    where: {
      id: executionId,
    },
    include: {
      phases: true,
      workflow: true,
    },
  });
  if (!execution) {
    throw new Error("Execution not found");
  }
  const environment = { phases: {} };
  //initialize workflow execution
  await initializeWorkflowExecution(executionId, execution.workflowId);
  //initialize phases status
  await initializePhasesStatus(execution);
  let creditConsumer = 0;
  let executionFailed = false;
  for (const phase of execution.phases) {
    //execute phase
    //consumer credit
    await waitFor(3000);
  }
  //finalize execution
  await finialWorkflowExecution(
    executionId,
    execution.workflowId,
    executionFailed,
    creditConsumer
  );
  // clear up enironment
};
const initializeWorkflowExecution = async (
  executionId: string,
  workflowId: string
) => {
  await prisma.workflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      startAt: new Date(),
      status: WorkflowExecutionStatus.RUNNING,
    },
  });
  await prisma.workflow.update({
    where: {
      id: workflowId,
    },
    data: {
      lastRunAt: new Date(),
      lastRunId: executionId,
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
    },
  });
};
const initializePhasesStatus = async (execution: any) => {
  await prisma.executionPhase.updateMany({
    where: {
      id: {
        in: execution.phases.map((phase: any) => phase.id),
      },
    },
    data: {
      status: ExecutionPhaseStatus.PENDING,
    },
  });
};
const finialWorkflowExecution = async (
  executionId: string,
  workflowId: string,
  executionFaild: boolean,
  creditConsumer: number
) => {
  const finalStatus = executionFaild
    ? WorkflowExecutionStatus.FAILED
    : WorkflowExecutionStatus.COMPLETED;

  await prisma.workflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      status: finalStatus,
      creditsConsumed: creditConsumer,
      completedAt: new Date(),
    },
  });

  await prisma.workflow
    .update({
      where: {
        id: workflowId,
        lastRunId: executionId,
      },
      data: {
        lastRunStatus: finalStatus,
      },
    })
    .catch((e) => {
      //
    });
};
