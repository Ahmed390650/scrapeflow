import { WorkflowTask } from "@/types/appNode";
import { TaskParamType, TaskType } from "@/types/task";
import { EyeIcon } from "lucide-react";

export const WaitForElementTask = {
  type: TaskType.WAIT_FOR_ELEMENT,
  label: "Wait for Element",
  Icon: (props) => <EyeIcon className="stroke-amber-400" {...props} />,
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "Web Page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
    {
      name: "Selector",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Visiblilty",
      type: TaskParamType.SELECT,
      required: true,
      hideHandle: true,
      options: [
        {
          label: "Hidden",
          value: "Hidden",
        },
        {
          label: "Visible",
          value: "Visible",
        },
      ],
    },
  ] as const,
  outputs: [
    {
      name: "Web  page",
      type: TaskParamType.BROWSER_INSTANCE,
    },
  ] as const,
} satisfies WorkflowTask;
