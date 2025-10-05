import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { Clipboard } from "lucide-react";
import Task from "./task";

async function ViewTasks({
  showDeleteButton = true,
  taskStatusFilter = "all",
  limit,
  onlyDeleted = false,
}: {
  showDeleteButton?: boolean;
  taskStatusFilter?: "all" | "completed" | "incomplete";
  limit?: number;
  onlyDeleted?: boolean;
}) {
  const user = await currentUser();

  const tasks = await prisma.task.findMany({
    where: {
      user: user?.id,
      ...(taskStatusFilter === "completed" ? { completed: true } : taskStatusFilter === "incomplete" ? { completed: false } : {}),
      ...(onlyDeleted ? { deletedAt: { not: null } } : { deletedAt: null }),
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
          <Clipboard className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{onlyDeleted ? "Trash is empty" : "No tasks yet"}</h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          {onlyDeleted
            ? "No deleted tasks found. Deleted tasks will appear here for 30 days before being permanently removed."
            : taskStatusFilter === "completed"
            ? "You haven't completed any tasks yet. Keep working!"
            : taskStatusFilter === "incomplete"
            ? "Great job! All your tasks are completed."
            : "Start by adding your first task above."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          className="animate-in slide-in-from-top-2 fade-in duration-300"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <Task
            id={task.id}
            title={task.title}
            completed={task.completed}
            description={task.description ?? undefined}
            showDeleteButton={showDeleteButton}
            isDeleted={onlyDeleted}
            deletedAt={task.deletedAt}
          />
        </div>
      ))}
    </div>
  );
}

export default ViewTasks;
