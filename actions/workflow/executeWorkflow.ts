import prisma from "@/database/prisma";
import { waitFor } from "@/lib/helper/waitFor";
import { ExecutorRegistry } from "@/lib/workflow/executor/registry";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { Environment, ExecutionEnvironment } from "@/types/execution";
import { TaskParamType } from "@/types/task";
import {
  AppNode,
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
} from "@/types/workflow";
import { ExecutionPhase } from "@prisma/client";
import { Browser } from "puppeteer";
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
  const environment: Environment = { phases: {} };
  //initialize workflowExecution status and startAt & workflow lastRun<status,id,At>
  await initializeWorkflowExecution(executionId, execution.workflowId);
  //initialize Executionphases <status,startAt>
  await initializePhasesStatus(execution);
  let creditConsumer = 0;
  let executionFailed = false;
  for (const phase of execution.phases) {
    //execute phase
    const phaseExecution = await executeWorkflowPhase(phase, environment);
    if (!phaseExecution.success) {
      executionFailed = true;
      break;
    }
  }
  //finalize workflowExecution <status,CompoleteAt> & workflow lastRun<Status>
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
const executeWorkflowPhase = async (
  phase: ExecutionPhase,
  environment: Environment
) => {
  const startAt = new Date();
  const node = JSON.parse(phase.node) as AppNode;
  //Setup environment phases name <nodeId> with inputs values and outputs values
  setupEnvironmentForPhase(node, environment);
  //initialize Executionphase status , startAt
  await prisma.executionPhase.update({
    where: {
      id: phase.id,
    },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startAt,
      inputs: JSON.stringify(environment.phases[node.id].inputs),
    },
  });
  const creditRequired = TaskRegistry[node.data.type].credits;
  console.log(
    `Executing phase ${phase.name} with ${creditRequired} credits required`
  );
  //TODO :decrement user balance (with required credit)

  const success = await executePhase(phase, node, environment);
  //finical executionPhase compoleteAt status
  await finialPhase(phase.id, success);
  return { success };
};

const executePhase = async (
  phase: ExecutionPhase,
  node: AppNode,
  environment: Environment
): Promise<boolean> => {
  const runFn = ExecutorRegistry[node.data.type];
  if (!runFn) {
    return false;
  }
  const executionEnvironment = createExecutionEnvironment(node, environment);
  return await runFn(executionEnvironment);
};
const finialPhase = async (phaseId: string, success: boolean) => {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;
  await prisma.executionPhase.update({
    where: {
      id: phaseId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
    },
  });
};
const setupEnvironmentForPhase = (node: AppNode, environment: Environment) => {
  environment.phases[node.id] = {
    inputs: {},
    outputs: {},
  };
  const inputs = TaskRegistry[node.data.type].inputs;
  for (const input of inputs) {
    if (input.type === TaskParamType.BROWSER_INSTANCE) continue;
    const inputValue = node.data.inputs[input.name];
    if (inputValue) {
      environment.phases[node.id].inputs[input.name] = inputValue;
      continue;
    }
  }
};
const createExecutionEnvironment = (
  node: AppNode,
  environment: Environment
): ExecutionEnvironment<any> => {
  return {
    getInput: (name: string) => environment.phases[node.id].inputs[name],
    getBrowser: () => environment.browser,
    setBrowser: (browser: Browser) => (environment.browser = browser),
  };
};
