"use client";
import { Input } from "@/components/ui/input";
import { taskParam, TaskParamType } from "@/types/task";
import React, { useCallback } from "react";
import StringParam from "./param/StringParam";
import { useReactFlow } from "@xyflow/react";
import { AppNode } from "@/types/workflow";

const NodeParamField = ({
  input,
  nodeId,
}: {
  input: taskParam;
  nodeId: string;
}) => {
  const { updateNodeData, getNode } = useReactFlow();
  const node = getNode(nodeId) as AppNode;
  const value = node.data.inputs[input.name];
  const updateNodeParamValue = useCallback(
    (newValue: string) => {
      updateNodeData(nodeId, {
        inputs: {
          ...node.data.inputs,
          [input.name]: newValue,
        },
      });
    },
    [nodeId, updateNodeData, input.name, node.data.inputs]
  );
  switch (input.type) {
    case TaskParamType.STRING:
      return (
        <StringParam
          params={input}
          value={value}
          updateNodeParamValue={updateNodeParamValue}
        />
      );
    default:
      return (
        <div className="w-full">
          <p className="text-muted-foreground text-xs">no implementation</p>
        </div>
      );
  }
};

export default NodeParamField;
