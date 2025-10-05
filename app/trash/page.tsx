import ViewTasks from "@/components/view-tasks";
import { AlertTriangle, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function TrashPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to tasks
            </Link>
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
            Trash
          </h1>
          <p className="text-muted-foreground text-lg mb-4">Deleted tasks are stored here temporarily</p>
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-start gap-3">
              <div className="text-amber-600 dark:text-amber-400 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">Automatic deletion policy</h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Tasks in trash will be permanently deleted after <strong>30 days</strong>. You can restore them anytime before
                  then, or delete them permanently yourself.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <ViewTasks showDeleteButton={true} taskStatusFilter="all" onlyDeleted={true} />
        </div>
      </div>
    </div>
  );
}
