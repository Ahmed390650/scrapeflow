import { ExecutionEnvironment } from "@/types/execution";
import { ExtractDataWithAITask } from "../task/extractDataWithAITask";
import OpenAI from "openai";
import { symmetricDecrypt } from "@/lib/encrypt";
import prisma from "@/database/prisma";

export const ExtractDataWithAIExecutor = async (
  environment: ExecutionEnvironment<typeof ExtractDataWithAITask>
): Promise<boolean> => {
  try {
    const Content = environment.getInput("Content");
    if (!Content) {
      environment.log.error("Content not found");
      return false;
    }
    const Prompt = environment.getInput("Prompt");
    if (!Prompt) {
      environment.log.error("Prompt not found");
      return false;
    }
    const Credentials = environment.getInput("Credentials");
    if (!Credentials) {
      environment.log.error("Credentials not found");
      return false;
    }
    const credential = await prisma.credentials.findUnique({
      where: {
        id: Credentials,
      },
    });
    if (!credential) {
      environment.log.error("credential not found");
      return false;
    }
    const plainCredentialValue = symmetricDecrypt(credential?.value);

    // const openai = new OpenAI({
    //   apiKey: plainCredentialValue,
    //   baseURL: "https://api.deepseek.com",
    // });

    // const response = await openai.chat.completions.create({
    //   model: "gpt-4o-mini",
    //   messages: [
    //     {
    //       role: "system",
    //       content:
    //         "You are a webscraper helper that extracts data from HTML or test.You will be given a piece of text or HTML content as input and also the prompt with the data you want to extract.The response should always be only the extracted data as a JSON array or object.without any additional words or explanations.Analyze the input carefully and extract data precisely based on the prompt.If no data is found, return an empty JSON array.Work only with the provided content and ensure the output is always a valid JSON array without and surrounding text",
    //     },
    //     {
    //       role: "user",
    //       content: Content,
    //     },
    //     { role: "user", content: Prompt },
    //   ],
    //   temperature: 1,
    // });
    // environment.log.info(`Prompt tokens: ${response.usage?.prompt_tokens}`);
    // environment.log.info(
    //   `completion tokens: ${response.usage?.completion_tokens}`
    // );
    // const result = response.choices[0].message.content;
    // if (!result) {
    //   environment.log.error("empty response from AI");
    //   return false;
    // }
    const mockExtractedData = {
      usernameSelector: "#username",
      passwordSelector: "#password",
      loginSelector: "body > div > form > input.btn.btn-primary",
    };
    environment.setOutput("Extracted data", JSON.stringify(mockExtractedData));
    return true;
  } catch (err: any) {
    environment.log.error(err.message);
    return false;
  }
};
