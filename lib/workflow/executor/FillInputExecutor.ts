import { ExecutionEnvironment } from "@/types/execution";
import { FillInputTask } from "../task/FillInputTask";
export const FillInputExecutor = async (
  environment: ExecutionEnvironment<typeof FillInputTask>
): Promise<boolean> => {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("selector not found");
      return false;
    }
    const value = environment.getInput("Value");
    if (!value) {
      environment.log.error("value not found");
      return false;
    }
    await environment.getPage()?.type(selector, value);

    return true;
  } catch (err: any) {
    environment.log.error(err.message);
    return false;
  }
};
