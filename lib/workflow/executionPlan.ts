import {
  WorkflowExecutionPlan,
  WorkflowExecutionPlanPhase,
} from "@/types/appNode";
import { AppNode } from "@/types/workflow";
import { Edge, getIncomers } from "@xyflow/react";
import { TaskRegistry } from "./task/registry";
type FlowToExecutionPlanType = {
  executionPlan?: WorkflowExecutionPlan;
};
export const FlowToExecutionPlan = (
  nodes: AppNode[],
  edges: Edge[]
): FlowToExecutionPlanType => {
  const entryPoint = nodes.find(
    (node) => TaskRegistry[node.data.type].isEntryPoint
  );
  if (!entryPoint) {
    throw new Error("TODO: handle no entry point");
  }
  const planned = new Set<string>();

  const executionPlan: WorkflowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint],
    },
  ];
  planned.add(entryPoint.id);
  // loop every node without entryPoint
  for (
    let phase = 2;
    phase <= nodes.length && planned.size < nodes.length;
    phase++
  ) {
    const nextPhase: WorkflowExecutionPlanPhase = { phase, nodes: [] };
    for (const currentNode of nodes) {
      if (planned.has(currentNode.id)) {
        //current node already planned and in execution plan
        continue;
      }
      const invalidInputs = getInvalidInputs(currentNode, edges, planned);
      //checking of invalidInputs of currentnode
      if (invalidInputs.length > 0) {
        const incomers = getIncomers(currentNode, nodes, edges);
        if (incomers.every((incomer) => planned.has(incomer.id))) {
          //if all incoming/edges are planned and there are still invalid inputs
          //this means that this node is not needed and can be skipped
          //which means that the workflow is invalid and needs to be fixed
          console.error("invalid inputs", currentNode.id, invalidInputs);
          throw new Error("TODO: handle invalid inputs");
        } else {
          continue;
        }
      }

      nextPhase.nodes.push(currentNode);
    }
    for (const node of nextPhase.nodes) {
      planned.add(node.id);
    }
    executionPlan.push(nextPhase);
  }
  return { executionPlan };
};
function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>) {
  const invalidInputs = [];

  const inputs = TaskRegistry[node.data.type].inputs;
  for (const input of inputs) {
    const inputValue = node.data.inputs[input.name];
    const inputValueProvider = inputValue?.length > 0;
    if (inputValueProvider) {
      //this input is fine ,so we can move on
      continue;
    }

    //if the value is not provided by user we need to check
    //if there is an output linked to current input
    const incomingEdges = edges.filter((edge) => edge.target === node.id);

    const inputLinkedToOutput = incomingEdges.find(
      (edge) => edge.targetHandle === input.name
    );
    const requiredInputProvidedByVisitedOutput =
      input.required &&
      inputLinkedToOutput &&
      planned.has(inputLinkedToOutput.source);
    if (requiredInputProvidedByVisitedOutput) {
      continue;
    } else if (!input.required) {
      if (!inputLinkedToOutput) continue;
      if (inputLinkedToOutput && planned.has(inputLinkedToOutput.source)) {
        continue;
      }
    }
    invalidInputs.push(input.name);
  }
  return invalidInputs;
}
