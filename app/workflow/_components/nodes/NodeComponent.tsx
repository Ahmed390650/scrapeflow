import React, { memo } from "react";
import NodeCard from "./NodeCard";
import { NodeProps } from "@xyflow/react";
import NodeHeader from "./NodeHeader";
import { TaskType } from "@/types/task";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { AppNodeData } from "@/types/workflow";
import NodeInputs, { NodeInput } from "./NodeInputs";
import NodeOutputs, { NodeOutput } from "./NodeOutputs";

const NodeComponent = memo(({ selected, id, data }: NodeProps) => {
  const nodeData = data as AppNodeData;
  const task = TaskRegistry[nodeData.type];
  return (
    <NodeCard nodeId={id} isSelected={selected}>
      <NodeHeader taskType={nodeData.type} nodeId={id} />
      <NodeInputs>
        {task.inputs.map((input, i) => (
          <NodeInput key={input.name} input={input} nodeId={id} />
        ))}
      </NodeInputs>
      <NodeOutputs>
        {task.outputs.map((output, i) => (
          <NodeOutput key={output.name} output={output} />
        ))}
      </NodeOutputs>
    </NodeCard>
  );
});
export default NodeComponent;
NodeComponent.displayName = "NodeComponent";
