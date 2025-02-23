"use server";

import prisma from "@/database/prisma";
import { symmetricEncrypt } from "@/lib/encrypt";
import {
  createCredentialsSchema,
  createCredentialsSchemaType,
} from "@/lib/validation/credentials";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const CreateCredentials = async (form: createCredentialsSchemaType) => {
  const { success, error } = createCredentialsSchema.safeParse(form);

  if (!success) {
    throw new Error(error.message);
  }
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not found");
  }
  const { name, value } = form;
  const encryptedValue = symmetricEncrypt(value);
  console.log({ encryptedValue });
  const reuslt = await prisma.credentials.create({
    data: {
      userId,
      name,
      value: encryptedValue,
    },
  });
  if (!reuslt) {
    throw new Error("Something went wrong");
  }
  revalidatePath("/credentinals");
};
