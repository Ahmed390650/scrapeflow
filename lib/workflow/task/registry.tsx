import { TaskType } from "@/types/task";
import { ExtractTextFromElementTask } from "./ExtractTextFromElement";
import { LaunchBrowserTask } from "./LaunchBrowserTask";
import { PageToHtmlTask } from "./PageToHtmlTask";
import { WorkflowTask } from "@/types/appNode";
import { FillInputTask } from "./FillInputTask";
import { ClickElementTask } from "./ClickElementTask";
import { WaitForElementTask } from "./WaitForElementTask";
import { DeliverViaWebhookTask } from "./deliverViaWebhookTask";
import { ExtractDataWithAITask } from "./extractDataWithAITask";
import { ReadPropertyFromJSONTask } from "./ReadPropertyFromJSONTask";
import { AddPropertyToJSONTask } from "./AddPropertyToJSONTask";
import { NavgiateURLTask } from "./navgiateURLTask";
import { ScrollToElementTask } from "./scrollToElementTask";

type Registry = {
  [K in TaskType]: WorkflowTask & { type: K };
};
export const TaskRegistry: Registry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
  FILL_INPUT: FillInputTask,
  CLICK_ELEMENT: ClickElementTask,
  WAIT_FOR_ELEMENT: WaitForElementTask,
  DELIVER_VIA_WEBHOOK: DeliverViaWebhookTask,
  EXTRACT_DATA_WITH_AI: ExtractDataWithAITask,
  READ_PROPERTY_FROM_JSON: ReadPropertyFromJSONTask,
  ADD_PROPERTY_TO_JSON: AddPropertyToJSONTask,
  NAVIGATE_URL: NavgiateURLTask,
  SCROLL_TO_ELEMENT: ScrollToElementTask,
};
