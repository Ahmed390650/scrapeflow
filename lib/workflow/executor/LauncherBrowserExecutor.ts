import { ExecutionEnvironment } from "@/types/execution";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowserTask";

export const LauncherBrowserExecutor = async (
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> => {
  try {
    const websiteUrl = environment.getInput("Website Url");

    const browser = await puppeteer.launch({
      headless: true,
    });
    environment.log.info("Browser started successfully");
    environment.setBrowser(browser);
    const page = await browser.newPage();

    await page.goto(websiteUrl);
    environment.setPage(page);
    environment.log.info("Opened page at:" + websiteUrl);
    return true;
  } catch (err: any) {
    environment.log.error(err.message);
    return false;
  }
};
