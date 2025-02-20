import prisma from "@/database/prisma";
import { waitFor } from "@/lib/helper/waitFor";
import { createLogColletor } from "@/lib/log";
import { ExecutorRegistry } from "@/lib/workflow/executor/registry";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { Environment, ExecutionEnvironment } from "@/types/execution";
import { LogCollector } from "@/types/logs";
import { TaskParamType } from "@/types/task";
import {
  AppNode,
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
} from "@/types/workflow";
import { ExecutionPhase } from "@prisma/client";
import { Edge } from "@xyflow/react";
import { Browser, Page } from "puppeteer";
import "server-only";

export const ExecuteWorkflow = async (
  executionId: string,
  NextRuntAt?: Date
) => {
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
  const edges = JSON.parse(execution.definition).edges as Edge[];
  const environment: Environment = { phases: {} };
  //initialize workflowExecution status and startAt & workflow lastRun<status,id,At>
  await initializeWorkflowExecution(
    executionId,
    execution.workflowId,
    NextRuntAt
  );
  //initialize Executionphases <status,startAt>
  await initializePhasesStatus(execution);
  let creditsConsumed = 0;
  let executionFailed = false;
  for (const phase of execution.phases) {
    //execute phase
    const phaseExecution = await executeWorkflowPhase(
      phase,
      environment,
      edges,
      execution.userId
    );
    if (!phaseExecution.success) {
      executionFailed = true;
      break;
    }
    creditsConsumed += phaseExecution.creditsConsumed;
  }
  //finalize workflowExecution <status,CompoleteAt> & workflow lastRun<Status>
  await finialWorkflowExecution(
    executionId,
    execution.workflowId,
    executionFailed,
    creditsConsumed
  );
  // clear up enironment
  cleanUpEnvironment(environment);
  // revalidatePath("workflow/runs");
};
const initializeWorkflowExecution = async (
  executionId: string,
  workflowId: string,
  NextRuntAt?: Date
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
      ...(NextRuntAt && { NextRuntAt }),
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
  creditsConsumed: number
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
      creditsConsumed,
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
  environment: Environment,
  edges: Edge[],
  userId: string
) => {
  const LogCollector = createLogColletor();
  const startAt = new Date();
  const node = JSON.parse(phase.node) as AppNode;

  //Setup environment phases name <nodeId> with inputs values and outputs values
  setupEnvironmentForPhase(node, environment, edges);
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
  //TODO :decrement user balance (with required credit)
  let success = await descrementCredits(creditRequired, userId, LogCollector);
  const creditsConsumed = success ? creditRequired : 0;
  if (success) {
    success = await executePhase(phase, node, environment, LogCollector);
  }
  //finical executionPhase compoleteAt status
  const outputs = environment.phases[node.id].outputs;
  await finialPhase(phase.id, success, outputs, LogCollector, creditsConsumed);
  return { success, creditsConsumed };
};

const executePhase = async (
  phase: ExecutionPhase,
  node: AppNode,
  environment: Environment,
  logCollector: LogCollector
): Promise<boolean> => {
  const runFn = ExecutorRegistry[node.data.type];
  if (!runFn) {
    logCollector.error(`Executor of type ${node.data.type} not found`);
    return false;
  }
  await waitFor(3000);
  const executionEnvironment = createExecutionEnvironment(
    node,
    environment,
    logCollector
  );
  return await runFn(executionEnvironment);
};
const finialPhase = async (
  phaseId: string,
  success: boolean,
  outputs: any,
  logCollerctor: LogCollector,
  creditsConsumed: number
) => {
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
      outputs: JSON.stringify(outputs),
      creditsConsumed,
      logs: {
        createMany: {
          data: logCollerctor.getAll().map((log) => ({
            message: log.message,
            logLevel: log.level,
            timestamp: log.timestamp,
          })),
        },
      },
    },
  });
};
const setupEnvironmentForPhase = (
  node: AppNode,
  environment: Environment,
  edegs: Edge[]
) => {
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
    //Get input value from outputs in the environmnet
    const connectEdge = edegs.find(
      (edge) => edge.target === node.id && edge.targetHandle === input.name
    );
    if (!connectEdge) {
      console.error("Missing edge for input", input.name, "node id", node.id);
      continue;
    }
    const outputValue =
      environment.phases[connectEdge.source].outputs[connectEdge.sourceHandle!];
    environment.phases[node.id].inputs[input.name] = outputValue;
  }
};
const createExecutionEnvironment = (
  node: AppNode,
  environment: Environment,
  logCollector: LogCollector
): ExecutionEnvironment<any> => {
  return {
    getInput: (name: string) => environment.phases[node.id].inputs[name],
    getBrowser: () => environment.browser,
    setBrowser: (browser: Browser) => (environment.browser = browser),
    getPage: () => environment.page,
    setPage: (page: Page) => (environment.page = page),
    setOutput: (name: string, value: string) =>
      (environment.phases[node.id].outputs[name] = value),
    log: logCollector,
  };
};
const cleanUpEnvironment = (environment: Environment) => {
  if (environment.browser) {
    environment.browser?.close().catch((err) => {
      console.error("cannot close the browser,reason", err);
    });
  }
};
const descrementCredits = async (
  amount: number,
  userId: string,
  logCollector: LogCollector
) => {
  try {
    await prisma.userBalance.update({
      where: {
        userId,
        credits: {
          gte: amount,
        },
      },
      data: {
        credits: {
          decrement: amount,
        },
      },
    });
    return true;
  } catch (error) {
    logCollector.error("insufficient balance");
    return false;
  }
};
