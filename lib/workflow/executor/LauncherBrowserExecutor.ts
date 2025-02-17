import { waitFor } from "@/lib/helper/waitFor";
import { Environment, ExecutionEnvironment } from "@/types/execution";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowserTask";
export const LauncherBrowserExecutor = async (
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> => {
  try {
    const websiteUrl = environment.getInput("Website Url");
    console.log(websiteUrl);
    const browser = await puppeteer.launch({
      headless: false,
    });
    await waitFor(3000);
    browser.close();
    return true;
  } catch (err: any) {
    console.error(err);
    return false;
  }
};
