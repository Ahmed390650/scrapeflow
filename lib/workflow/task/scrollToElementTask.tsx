import { WorkflowTask } from "@/types/appNode";
import { TaskParamType, TaskType } from "@/types/task";
import { ArrowUpIcon } from "lucide-react";

export const ScrollToElementTask = {
  type: TaskType.SCROLL_TO_ELEMENT,
  credits: 2,
  label: "Scroll to element",
  Icon: (props) => <ArrowUpIcon className="stroke-orange-400" {...props} />,
  isEntryPoint: false,
  inputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
    {
      name: "Selector",
      type: TaskParamType.STRING,
      required: true,
    },
  ] as const,
  outputs: [
    { name: "Web page", type: TaskParamType.BROWSER_INSTANCE },
  ] as const,
} satisfies WorkflowTask;
