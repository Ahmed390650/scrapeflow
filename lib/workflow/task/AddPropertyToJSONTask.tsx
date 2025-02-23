import { WorkflowTask } from "@/types/appNode";
import { TaskParamType, TaskType } from "@/types/task";
import { DatabaseIcon, LucideProps, TextIcon } from "lucide-react";

export const AddPropertyToJSONTask = {
  type: TaskType.ADD_PROPERTY_TO_JSON,
  credits: 2,
  label: "Add property to JSON",
  Icon: (props: LucideProps) => (
    <DatabaseIcon className="stroke-orange-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "JSON",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Property name",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Property value",
      type: TaskParamType.STRING,
      required: true,
    },
  ] as const,
  outputs: [{ name: "Update JSON", type: TaskParamType.STRING }] as const,
} satisfies WorkflowTask;
