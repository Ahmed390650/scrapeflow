import { ExecutionEnvironment } from "@/types/execution";
import { PageToHtmlTask } from "../task/PageToHtmlTask";
export const PAGETOHTMLExecutor = async (
  environment: ExecutionEnvironment<typeof PageToHtmlTask>
): Promise<boolean> => {
  try {
    const html = await environment.getPage()!.content();
    environment.setOutput("Html", html);

    return true;
  } catch (err: any) {
    environment.log.error(err.message);
    return false;
  }
};
