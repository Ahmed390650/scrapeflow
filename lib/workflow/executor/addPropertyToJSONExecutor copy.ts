import { ScrollToElementTask } from "./../task/scrollToElementTask";
import { ExecutionEnvironment } from "@/types/execution";

export const ScrollToElementExecutor = async (
  environment: ExecutionEnvironment<typeof ScrollToElementTask>
): Promise<boolean> => {
  try {
    const Selector = environment.getInput("Selector");
    if (!Selector) {
      environment.log.error("Selector not found");
      return false;
    }
    environment.getPage()?.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (!element) {
        throw new Error("element not found");
      }
      const top = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top });
    }, Selector);
    return true;
  } catch (err: any) {
    environment.log.error(err.message);
    return false;
  }
};
