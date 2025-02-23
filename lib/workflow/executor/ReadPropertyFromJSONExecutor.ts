import { ExecutionEnvironment } from "@/types/execution";
import { ReadPropertyFromJSONTask } from "../task/ReadPropertyFromJSONTask";

export const ReadPropertyFromJSONExecutor = async (
  environment: ExecutionEnvironment<typeof ReadPropertyFromJSONTask>
): Promise<boolean> => {
  try {
    const json = JSON.parse(environment.getInput("JSON"));
    if (!json) {
      environment.log.error("json not found");
      return false;
    }

    const propertyName = environment.getInput("Property name");
    if (!propertyName) {
    }

    const propertyValue = json[propertyName];
    if (propertyValue === undefined) {
      environment.log.error("property Value not found");
      return false;
    }
    environment.setOutput("Property Value", propertyValue);
    return true;
  } catch (err: any) {
    environment.log.error(err.message);
    return false;
  }
};
