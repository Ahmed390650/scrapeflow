import { ExecutionEnvironment } from "@/types/execution";
import { DeliverViaWebhookTask } from "../task/deliverViaWebhookTask";

export const DeliverViaWebhookExecutor = async (
  environment: ExecutionEnvironment<typeof DeliverViaWebhookTask>
): Promise<boolean> => {
  try {
    const targetURL = environment.getInput("Target Url");
    if (!targetURL) {
      environment.log.error("input>targetUrl not defined");
      return false;
    }
    const body = environment.getInput("Body");
    if (!body) {
      environment.log.error("input>body not defined");
      return false;
    }
    const response = await fetch(targetURL, {
      headers: {
        "Content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(body),
    });
    const statusCode = await response.status;
    if (statusCode !== 200) {
      environment.log.error(`status code ${statusCode}`);
      return false;
    }
    const responseBody = await response.json();
    environment.log.info(JSON.stringify(responseBody, null, 4));
    return true;
  } catch (err: any) {
    environment.log.error(err.message);
    return false;
  }
};
