import { ExecutionEnvironment } from "@/types/execution";
import { PageToHtmlTask } from "../task/PageToHtmlTask";
export const PAGETOHTMLExecutor = async (
  environment: ExecutionEnvironment<typeof PageToHtmlTask>
): Promise<boolean> => {
  try {
    const websiteUrl = environment.getBrowser();
    console.log(websiteUrl);

    return true;
  } catch (err: any) {
    console.error(err);
    return false;
  }
};
