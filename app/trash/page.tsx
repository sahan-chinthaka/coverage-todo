import ViewTasks from "@/components/view-tasks";
import { ChevronLeft } from "lucide-react";
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
          <p className="text-muted-foreground text-lg">Deleted tasks are stored here temporarily</p>
        </div>

        <div>
          <ViewTasks showDeleteButton={true} taskStatusFilter="all" onlyDeleted={true} />
        </div>
      </div>
    </div>
  );
}
