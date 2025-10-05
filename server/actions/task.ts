"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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

    revalidatePath("/");
    revalidatePath("/completed");
    revalidatePath("/trash");

    return { done: true };
  } catch (error) {
    return { error: (error as Error).message, done: false };
  }
}

export async function deleteTask(id: string) {
  try {
    const user = await currentUser();

    if (!user?.id) throw new Error("User not authenticated");

    await prisma.task.update({
      where: {
        id,
        user: user.id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    revalidatePath("/");
    revalidatePath("/completed");
    revalidatePath("/trash");

    return { done: true };
  } catch (error) {
    return { error: (error as Error).message, done: false };
  }
}

export async function deletePermanentTask(id: string) {
  try {
    const user = await currentUser();

    if (!user?.id) throw new Error("User not authenticated");

    await prisma.task.deleteMany({
      where: {
        id,
        user: user.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/completed");
    revalidatePath("/trash");

    return { done: true };
  } catch (error) {
    return { error: (error as Error).message, done: false };
  }
}

export async function restoreTask(id: string) {
  try {
    const user = await currentUser();

    if (!user?.id) throw new Error("User not authenticated");

    await prisma.task.update({
      where: {
        id,
        user: user.id,
      },
      data: {
        deletedAt: null,
      },
    });

    revalidatePath("/");
    revalidatePath("/completed");
    revalidatePath("/trash");

    return { done: true };
  } catch (error) {
    return { error: (error as Error).message, done: false };
  }
}

export async function toggleTaskComplete(id: string) {
  try {
    const user = await currentUser();

    if (!user?.id) throw new Error("User not authenticated");

    const task = await prisma.task.findFirst({ where: { id, user: user.id } });
    if (!task) throw new Error("Task not found");

    await prisma.task.update({ where: { id }, data: { completed: !task.completed } });

    revalidatePath("/");
    revalidatePath("/completed");
    revalidatePath("/trash");

    return { done: true };
  } catch (error) {
    return { error: (error as Error).message, done: false };
  }
}

export async function cleanupOldDeletedTasks() {
  try {
    // Calculate the date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Find and delete tasks that were deleted more than 30 days ago
    const deletedTasks = await prisma.task.deleteMany({
      where: {
        deletedAt: {
          not: null,
          lt: thirtyDaysAgo,
        },
      },
    });

    console.log(`Cleanup completed: ${deletedTasks.count} tasks permanently deleted`);
    return {
      done: true,
      deletedCount: deletedTasks.count,
      message: `Successfully deleted ${deletedTasks.count} old tasks`,
    };
  } catch (error) {
    console.error("Cleanup failed:", error);
    return {
      error: (error as Error).message,
      done: false,
    };
  }
}
