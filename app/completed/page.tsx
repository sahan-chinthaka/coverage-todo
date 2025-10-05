import ViewTasks from "@/components/view-tasks";
import { ChevronLeft, Trash2 } from "lucide-react";
import Link from "next/link";

export default function CompletedPage() {
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
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-green-500 to-green-400 bg-clip-text text-transparent">
            Completed Tasks
          </h1>
          <p className="text-muted-foreground text-lg">Great work! Here are all your completed achievements</p>
        </div>

        <div className="flex justify-center mb-8">
          <Link
            href="/trash"
            className="inline-flex items-center gap-2 px-6 py-3 bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground rounded-lg transition-colors duration-200 font-medium"
          >
            <Trash2 className="w-4 h-4" />
            View Trash
          </Link>
        </div>

        <div>
          <ViewTasks showDeleteButton={true} taskStatusFilter="completed" />
        </div>
      </div>
    </div>
  );
}
