import { TaskType } from "@/types/task";
import { LauncherBrowserExecutor } from "./LauncherBrowserExecutor";
import { Environment, ExecutionEnvironment } from "@/types/execution";
import { PAGETOHTMLExecutor } from "./PAGETOHTMLExecutor";
import { WorkflowTask } from "@/types/appNode";
import { ExtractTextFromElementExecutor } from "./ExtractTextFromElementExecutor";
type ExecutorFn<T extends WorkflowTask> = (
  environment: ExecutionEnvironment<T>
) => Promise<boolean>;
type Registry = {
  [k in TaskType]: ExecutorFn<WorkflowTask & { type: k }>;
};
export const ExecutorRegistry: Registry = {
  LAUNCH_BROWSER: LauncherBrowserExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
  PAGE_TO_HTML: PAGETOHTMLExecutor,
};
