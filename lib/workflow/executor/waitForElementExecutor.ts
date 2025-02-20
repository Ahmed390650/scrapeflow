import { ExecutionEnvironment } from "@/types/execution";
import { WaitForElementTask } from "../task/WaitForElementTask";

export const WaitForElementExecutor = async (
  environment: ExecutionEnvironment<typeof WaitForElementTask>
): Promise<boolean> => {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("selector not found");
      return false;
    }
    const visibility = environment.getInput("Visiblilty");
    if (!visibility) {
      environment.log.error("input > visibility not definied");
      return false;
    }
    await environment.getPage()?.waitForSelector(selector, {
      visible: visibility === "visible",
      hidden: visibility === "visible",
    });
    environment.log.info(`Element ${selector} became ${visibility}`);
    return true;
  } catch (err: any) {
    environment.log.error(err.message);
    return false;
  }
};
