"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function addTask(title: string, desc?: string) {
  try {
    const user = await currentUser();

    if (!user?.id) throw new Error("User not authenticated");

    await prisma.task.create({
      data: {
        title,
        description: desc,
        user: user.id,
      },
    });

    return { done: true };
  } catch (error) {
    return { error: (error as Error).message, done: false };
  }
}
