"use client";
import { Workflow } from "@prisma/client";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  getOutgoers,
  MiniMap,
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
import DeletableEdge from "./edges/DeletableEdge";
import { TaskRegistry } from "@/lib/workflow/task/registry";

const fitViewOptions = { padding: 1 };
const snapGrid: [number, number] = [50, 50];
const nodeTypes = {
  FlowScrapeNode: NodeComponent,
};

const edgesTypes = {
  default: DeletableEdge,
};
const FlowEditor = ({ workflow }: { workflow: Workflow }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition, updateNodeData } = useReactFlow();
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
    [setNodes, screenToFlowPosition]
  );
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
      if (!connection.targetHandle) return;
      //Remove input value if is present on
      const node = nodes.find((node) => node.id === connection.target);
      if (!node) return;
      const nodeInputs = node.data.inputs;
      updateNodeData(node.id, {
        inputs: { ...nodeInputs, [connection.targetHandle]: "" },
      });
    },
    [setEdges, nodes, updateNodeData]
  );
  const isValidConnection = useCallback(
    (connection: Connection | Edge) => {
      //no self-connection allowed
      if (connection.source === connection.target) {
        return false;
      }
      //Same taskParam type connection not allowed
      const target = nodes.find((node) => node.id === connection.target);
      const source = nodes.find((node) => node.id === connection.source);
      if (!target || !source) {
        console.error("Invalid connection:source or target node not found");
        return false;
      }
      const sourceTask = TaskRegistry[source.data.type];
      const targetTask = TaskRegistry[target.data.type];
      const output = sourceTask.outputs.find(
        (o) => o.name === connection.sourceHandle
      );
      const input = targetTask.inputs.find(
        (i) => i.name === connection.targetHandle
      );
      if (input?.type !== output?.type) {
        console.error("invalid connection:type mismatch");
        return false;
      }
      //preventing cycle loop
      const hasCycle = (node: AppNode, visited = new Set()) => {
        if (visited.has(node.id)) return false;

        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };
      const detectedCycle = hasCycle(target);
      return !detectedCycle;
    },
    [nodes, edges]
  );
  return (
    <main className="h-full w-full ">
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        fitView
        nodeTypes={nodeTypes}
        edgeTypes={edgesTypes}
        fitViewOptions={fitViewOptions}
        snapGrid={snapGrid}
        onDragOver={onDragnOver}
        onDrop={onDrop}
        isValidConnection={isValidConnection}
        onConnect={onConnect}
        snapToGrid>
        {/* <MiniMap zoomable pannable /> */}
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  );
};

export default FlowEditor;
