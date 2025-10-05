"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  isDeleted?: boolean;
  isPending?: boolean;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  isDeleted = false,
  isPending = false,
}: DeleteConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className={`w-5 h-5 ${isDeleted ? 'text-destructive' : 'text-orange-500'}`} />
            {isDeleted ? "Delete Permanently" : "Delete Task"}
          </DialogTitle>
          <DialogDescription className="text-left">
            {isDeleted ? (
              <>
                Are you sure you want to permanently delete <strong>"{title}"</strong>? 
                This action cannot be undone and the task will be completely removed from your account.
              </>
            ) : (
              <>
                Are you sure you want to delete <strong>"{title}"</strong>? 
                The task will be moved to trash and can be restored later.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
            className="font-semibold"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                {isDeleted ? "Deleting..." : "Moving to trash..."}
              </div>
            ) : (
              <>
                {isDeleted ? "Delete Permanently" : "Move to Trash"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}