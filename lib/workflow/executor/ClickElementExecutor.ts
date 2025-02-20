import { ExecutionEnvironment } from "@/types/execution";
import { ClickElementTask } from "../task/ClickElementTask";

export const ClickElementExecutor = async (
  environment: ExecutionEnvironment<typeof ClickElementTask>
): Promise<boolean> => {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("selector not found");
      return false;
    }

    await environment.getPage()?.click(selector);

    return true;
  } catch (err: any) {
    environment.log.error(err.message);
    return false;
  }
};
