import { TaskType } from "@/types/task";
import { LauncherBrowserExecutor } from "./LauncherBrowserExecutor";
import { Environment, ExecutionEnvironment } from "@/types/execution";
import { PAGETOHTMLExecutor } from "./PAGETOHTMLExecutor";
import { WorkflowTask } from "@/types/appNode";
import { ExtractTextFromElementExecutor } from "./ExtractTextFromElementExecutor";
import { FillInputExecutor } from "./FillInputExecutor";
import { ClickElementExecutor } from "./ClickElementExecutor";
import { WaitForElementExecutor } from "./waitForElementExecutor";
import { DeliverViaWebhookExecutor } from "./deliverViaWebhookExecutor";
import { ExtractDataWithAIExecutor } from "./ExtractDataWithAIExecutor";
import { ReadPropertyFromJSONExecutor } from "./ReadPropertyFromJSONExecutor";
import { AddPropertyToJSONExecutor } from "./addPropertyToJSONExecutor";
import { NavgiateURLExecutor } from "./NavgiateURLExecutor";
import { ScrollToElementExecutor } from "./addPropertyToJSONExecutor copy";
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
  FILL_INPUT: FillInputExecutor,
  CLICK_ELEMENT: ClickElementExecutor,
  WAIT_FOR_ELEMENT: WaitForElementExecutor,
  DELIVER_VIA_WEBHOOK: DeliverViaWebhookExecutor,
  EXTRACT_DATA_WITH_AI: ExtractDataWithAIExecutor,
  READ_PROPERTY_FROM_JSON: ReadPropertyFromJSONExecutor,
  ADD_PROPERTY_TO_JSON: AddPropertyToJSONExecutor,
  NAVIGATE_URL: NavgiateURLExecutor,
  SCROLL_TO_ELEMENT: ScrollToElementExecutor,
};
