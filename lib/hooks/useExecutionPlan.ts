import {
  FlowToExecutionPlan,
  FlowToExecutionValidationError,
} from "@/lib/workflow/executionPlan";
import { AppNode } from "@/types/workflow";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import useFlowValidation from "./useFlowValidation";
import { AppNodeMissingInputs } from "@/types/appNode";
import { toast } from "sonner";

const useExecutionPlan = () => {
  const { toObject } = useReactFlow();
  const { setInvalidInputs, clearErrors } = useFlowValidation();
  const handleError = useCallback(
    (error: {
      type: FlowToExecutionValidationError;
      invalidInputs?: AppNodeMissingInputs[];
    }) => {
      switch (error.type) {
        case FlowToExecutionValidationError.NO_ENTRY_POINT:
          toast.error("No entry point found");
          break;
        case FlowToExecutionValidationError.INVALID_INPUTS:
          toast.error("Invalid inputs found");
          setInvalidInputs(error?.invalidInputs!);
          break;
        default:
          toast.error("Failed to generate execution plan");
          break;
      }
    },
    [setInvalidInputs]
  );
  const generateExecutionPlan = useCallback(() => {
    const { nodes, edges } = toObject();
    const { executionPlan, error } = FlowToExecutionPlan(
      nodes as AppNode[],
      edges
    );
    if (error) {
      handleError(error);
      return null;
    }
    clearErrors();
    return executionPlan;
  }, [toObject, handleError, clearErrors]);
  return generateExecutionPlan;
};
export default useExecutionPlan;
