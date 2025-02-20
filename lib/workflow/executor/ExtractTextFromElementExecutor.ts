import { ExecutionEnvironment } from "@/types/execution";
import { ExtractTextFromElementTask } from "../task/ExtractTextFromElement";
import * as cherrio from "cheerio";
export const ExtractTextFromElementExecutor = async (
  environment: ExecutionEnvironment<typeof ExtractTextFromElementTask>
): Promise<boolean> => {
  try {
    const html = environment.getInput("Html");
    if (!html) {
      environment.log.error("html not found");
      return false;
    }
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("no selector found!");
      return false;
    }
    const $ = cherrio.load(html);
    const element = $(selector);
    if (!element) {
      environment.log.error("Element not found");
      return false;
    }
    const extractText = $.text(element);
    if (!extractText) {
      environment.log.error("Element not found");
      return false;
    }

    environment.setOutput("Extracted text", extractText);
    return true;
  } catch (err: any) {
    environment.log.error(err.message);
    return false;
  }
};
