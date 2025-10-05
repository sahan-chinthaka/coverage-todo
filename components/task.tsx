"use client";

import { cn } from "@/lib/utils";
import { deletePermanentTask, deleteTask, restoreTask, toggleTaskComplete } from "@/server/actions/task";
import { Archive, Check, RotateCcw, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";

function Task({
  id,
  title,
  completed,
  description,
  showDeleteButton = true,
  isDeleted = false,
  deletedAt,
}: {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  showDeleteButton?: boolean;
  isDeleted?: boolean;
  deletedAt?: Date | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPermanentDeleteDialog, setShowPermanentDeleteDialog] = useState(false);

  return (
    <div
      className={cn(
        "group relative rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200",
        isDeleted
          ? "bg-muted/30 border border-muted"
          : completed
          ? "bg-muted/50 border border-muted"
          : "bg-card border border-border hover:border-primary/20"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-0.5">
          {isDeleted ? (
            <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/50 bg-muted flex items-center justify-center">
              <Archive className="w-3 h-3 text-muted-foreground" />
            </div>
          ) : (
            <label className="relative flex cursor-pointer">
              <input
                type="checkbox"
                checked={completed}
                onChange={() =>
                  startTransition(() => {
                    void toggleTaskComplete(id);
                  })
                }
                className="sr-only"
                aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
              />
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center",
                  completed
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-border hover:border-primary/50 bg-background"
                )}
              >
                {completed && <Check className="w-3 h-3" />}
              </div>
            </label>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "font-semibold text-lg leading-tight transition-all duration-200",
              isDeleted
                ? "line-through text-muted-foreground"
                : completed
                ? "line-through text-muted-foreground"
                : "text-foreground group-hover:text-primary"
            )}
          >
            {title}
          </h3>
          {description && (
            <p
              className={cn(
                "text-sm mt-2 leading-relaxed transition-all duration-200",
                isDeleted ? "text-muted-foreground/70" : completed ? "text-muted-foreground/70" : "text-muted-foreground"
              )}
            >
              {description}
            </p>
          )}
          {isDeleted && (
            <div className="mt-2 space-y-1">
              <span className="inline-block text-xs text-muted-foreground/60 bg-muted px-2 py-1 rounded">
                {completed ? "Completed" : "Incomplete"} • Deleted
              </span>
              {deletedAt && (
                <div className="text-xs text-muted-foreground/70">
                  {(() => {
                    const now = new Date();
                    const deleteDate = new Date(deletedAt);
                    const permanentDeleteDate = new Date(deleteDate.getTime() + 30 * 24 * 60 * 60 * 1000);
                    const daysLeft = Math.ceil((permanentDeleteDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));

                    if (daysLeft <= 0) {
                      return <span className="text-red-500 font-medium">⚠️ Will be permanently deleted soon</span>;
                    } else if (daysLeft <= 3) {
                      return (
                        <span className="text-orange-500 font-medium">
                          ⚠️ {daysLeft} day{daysLeft === 1 ? "" : "s"} left until permanent deletion
                        </span>
                      );
                    } else {
                      return (
                        <span>
                          🗑️ {daysLeft} day{daysLeft === 1 ? "" : "s"} left until permanent deletion
                        </span>
                      );
                    }
                  })()}
                </div>
              )}
            </div>
          )}
        </div>

        {showDeleteButton && (
          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {isDeleted ? (
              <div className="flex items-center gap-2">
                <button
                  className="p-2 text-muted-foreground hover:text-green-600 hover:bg-green-600/10 rounded-lg transition-colors duration-200 disabled:opacity-50"
                  onClick={() =>
                    startTransition(() => {
                      void restoreTask(id);
                    })
                  }
                  disabled={isPending}
                  aria-label="Restore task"
                  title="Restore task"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors duration-200 disabled:opacity-50"
                  onClick={() => setShowPermanentDeleteDialog(true)}
                  disabled={isPending}
                  aria-label="Delete permanently"
                  title="Delete permanently"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors duration-200 disabled:opacity-50"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isPending}
                aria-label="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {isPending && (
        <div className="absolute inset-0 bg-background/50 rounded-xl flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() =>
          startTransition(() => {
            void deleteTask(id);
          })
        }
        title={title}
        isDeleted={false}
        isPending={isPending}
      />

      <DeleteConfirmationDialog
        open={showPermanentDeleteDialog}
        onOpenChange={setShowPermanentDeleteDialog}
        onConfirm={() =>
          startTransition(() => {
            void deletePermanentTask(id);
          })
        }
        title={title}
        isDeleted={true}
        isPending={isPending}
      />
    </div>
  );
}

export default Task;
