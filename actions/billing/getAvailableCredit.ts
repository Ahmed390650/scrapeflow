"use server";

import prisma from "@/database/prisma";
import { auth } from "@clerk/nextjs/server";

const GetAvailableCredit = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("no user found");
  }
  const balance = await prisma.userBalance.findUnique({
    where: {
      userId,
    },
  });
  if (!balance) return -1;
  return balance.credits;
};
export default GetAvailableCredit;
