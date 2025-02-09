"use client";
import { Workflow } from "@prisma/client";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import React, { useCallback, useEffect } from "react";
import "@xyflow/react/dist/style.css";
import NodeComponent from "./nodes/NodeComponent";
import { createFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskType } from "@/types/task";
import { AppNode } from "@/types/workflow";

const fitViewOptions = { padding: 1 };
const snapGrid: [number, number] = [50, 50];
const nodeTypes = {
  FlowScrapeNode: NodeComponent,
};

const FlowEditor = ({ workflow }: { workflow: Workflow }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.definition);
      if (!flow) return;
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
    } catch (error) {}
  }, [workflow.definition, setEdges, setNodes]);
  const onDragnOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);
  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const taskType = e.dataTransfer.getData(
        "application/reactflow"
      ) as TaskType;
      if (typeof taskType === undefined || !taskType) return null;
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      const node = createFlowNode(taskType, position);
      setNodes((prev) => prev.concat(node));
    },
    [setNodes]
  );
  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        fitView
        nodeTypes={nodeTypes}
        fitViewOptions={fitViewOptions}
        snapGrid={snapGrid}
        onDragOver={onDragnOver}
        onDrop={onDrop}
        snapToGrid>
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  );
};

export default FlowEditor;
