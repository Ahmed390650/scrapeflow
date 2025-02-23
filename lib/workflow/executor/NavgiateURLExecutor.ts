import { ExecutionEnvironment } from "@/types/execution";
import { NavgiateURLTask } from "../task/navgiateURLTask";

export const NavgiateURLExecutor = async (
  environment: ExecutionEnvironment<typeof NavgiateURLTask>
): Promise<boolean> => {
  try {
    const Url = environment.getInput("Url");
    if (!Url) {
      environment.log.error("Url not found");
      return false;
    }
    await environment.getPage()?.goto(Url);
    environment.log.info(`visited ${Url}`);
    return true;
  } catch (err: any) {
    environment.log.error(err.message);
    return false;
  }
};
