import { WorkflowTask } from "@/types/appNode";
import { TaskParamType, TaskType } from "@/types/task";
import { Link2Icon } from "lucide-react";

export const NavgiateURLTask = {
  type: TaskType.NAVIGATE_URL,
  credits: 2,
  label: "Navigate Url",
  Icon: (props) => <Link2Icon className="stroke-orange-400" {...props} />,
  isEntryPoint: false,
  inputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
    {
      name: "Url",
      type: TaskParamType.STRING,
      required: true,
    },
  ] as const,
  outputs: [
    { name: "Web page", type: TaskParamType.BROWSER_INSTANCE },
  ] as const,
} satisfies WorkflowTask;
