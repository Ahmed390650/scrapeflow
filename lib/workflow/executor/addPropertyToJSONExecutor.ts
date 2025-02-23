import { AddPropertyToJSONTask } from "../task/AddPropertyToJSONTask";
import { ExecutionEnvironment } from "@/types/execution";

export const AddPropertyToJSONExecutor = async (
  environment: ExecutionEnvironment<typeof AddPropertyToJSONTask>
): Promise<boolean> => {
  try {
    const json = JSON.parse(environment.getInput("JSON"));
    if (!json) {
      environment.log.error("json not found");
      return false;
    }
    const propertyName = environment.getInput("Property name");
    if (!propertyName) {
      environment.log.error("propertyName not found");
      return false;
    }
    const propertyValue = environment.getInput("Property value");
    if (!propertyValue) {
      environment.log.error("propertyValue not found");
      return false;
    }
    json[propertyName] = propertyValue;
    environment.setOutput("Update JSON", JSON.stringify(json));
    return true;
  } catch (err: any) {
    environment.log.error(err.message);
    return false;
  }
};
