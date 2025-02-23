"use client";
import { taskParam, TaskParamType } from "@/types/task";
import React, { useCallback } from "react";
import StringParam from "./param/StringParam";
import { useReactFlow } from "@xyflow/react";
import { AppNode } from "@/types/workflow";
import BrowserInstanceParam from "./param/BrowserInstanceParam";
import SelectParam from "./param/SelectParam";
import CredentialSelectParam from "./param/CredentialSelectParam";

const NodeParamField = ({
  input,
  nodeId,
  disabled,
}: {
  input: taskParam;
  nodeId: string;
  disabled: boolean;
}) => {
  const { updateNodeData, getNode } = useReactFlow();
  const node = getNode(nodeId) as AppNode;
  const value = node.data.inputs[input.name];
  const updateNodeParamValue = useCallback(
    (newValue: string) => {
      updateNodeData(nodeId, {
        inputs: {
          ...node.data.inputs,
          [input.name]: newValue.trim(),
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
          disabled={disabled}
          value={value}
          updateNodeParamValue={updateNodeParamValue}
        />
      );
    case TaskParamType.BROWSER_INSTANCE:
      return (
        <BrowserInstanceParam
          params={input}
          value=""
          updateNodeParamValue={updateNodeParamValue}
        />
      );
    case TaskParamType.SELECT:
      return (
        <SelectParam
          params={input}
          disabled={disabled}
          value={value}
          updateNodeParamValue={updateNodeParamValue}
        />
      );
    case TaskParamType.CREDENTIAL:
      return (
        <CredentialSelectParam
          params={input}
          disabled={disabled}
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
