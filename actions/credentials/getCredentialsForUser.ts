"use server";

import prisma from "@/database/prisma";
import { auth } from "@clerk/nextjs/server";

export const GetCredentialsForUser = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not found");
  }

  return prisma.credentials.findMany({
    where: {
      userId,
    },
    orderBy: {
      name: "asc",
    },
  });
};
