import prisma from "@/database/prisma";
import { waitFor } from "@/lib/helper/waitFor";
import { auth } from "@clerk/nextjs/server";
import React from "react";
import Editor from "../../_components/Editor";

const page = async ({
  params,
}: {
  params: Promise<{ workflowId: string }>;
}) => {
  const { workflowId } = await params;
  const { userId } = await auth();
  if (!userId) return <div>unauthorized</div>;
  await waitFor(3000);
  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId,
    },
  });
  return <Editor workflow={workflow} />;
};

export default page;
