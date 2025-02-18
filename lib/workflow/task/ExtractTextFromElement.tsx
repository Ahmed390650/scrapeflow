import { WorkflowTask } from "@/types/appNode";
import { TaskParamType, TaskType } from "@/types/task";
import { LucideProps, TextIcon } from "lucide-react";

export const ExtractTextFromElementTask = {
  type: TaskType.EXTRACT_TEXT_FROM_ELEMENT,
  credits: 2,
  label: "Extract text from element",
  Icon: (props: LucideProps) => (
    <TextIcon className="stroke-rose-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      type: TaskParamType.STRING,
      name: "Html",
      required: true,
      variant: "textarea",
    },
    {
      type: TaskParamType.STRING,
      name: "Selector",
      required: true,
    },
  ] as const,
  outputs: [{ name: "Extracted text", type: TaskParamType.STRING }] as const,
} satisfies WorkflowTask;
