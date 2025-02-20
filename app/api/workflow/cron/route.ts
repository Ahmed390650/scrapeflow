import prisma from "@/database/prisma";
import { GetApiUrl } from "@/lib/helper/appUrl";
import { WorkflowStatus } from "@/types/appNode";

export async function GET(request: Request) {
  const DateNow = new Date();
  const workflows = await prisma.workflow.findMany({
    select: { id: true },
    where: {
      status: WorkflowStatus.PUBLISHED,
      NextRuntAt: {
        lt: DateNow,
      },
      cron: { not: null },
    },
  });
  for (const workflow of workflows) {
    triggerWorkflow(workflow.id);
  }
  return Response.json(
    { workflowExecution: workflows.length },
    {
      status: 200,
    }
  );
}
const triggerWorkflow = (workflowId: string) => {
  const triggerApiUrl = GetApiUrl(
    `api/workflow/execute?workflowId=${workflowId}`
  );
  fetch(triggerApiUrl, {
    headers: {
      Authorization: `Bearer ${process.env.API_SECERT!}`,
    },
    cache: "no-store",
  }).catch((error) => {
    console.log("Error triggering workflow with id", error.message);
  });
};
