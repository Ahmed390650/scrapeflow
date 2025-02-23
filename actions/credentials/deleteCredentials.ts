"use server";

import prisma from "@/database/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const DeleteCredentials = async (name: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("unauthentication");
  }

  const result = await prisma.credentials.delete({
    where: {
      userId_name: {
        userId,
        name,
      },
    },
  });
  if (!result) {
    throw new Error("Something went wrong");
  }
  revalidatePath("/credentials");
};
