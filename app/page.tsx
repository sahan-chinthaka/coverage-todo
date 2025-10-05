import AddTask from "@/components/add-task";
import ViewTasks from "@/components/view-tasks";
import { Check } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Task Manager
          </h1>
          <p className="text-muted-foreground text-lg">Stay organized and get things done</p>
        </div>

        <div className="mb-12">
          <AddTask />
        </div>

        <div>
          <ViewTasks showDeleteButton={false} limit={5} taskStatusFilter="incomplete" />
        </div>

        <div className="text-center my-10">
          <Link
            href="/completed"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium"
          >
            <Check className="w-4 h-4" />
            View completed tasks
          </Link>
        </div>
      </div>
    </div>
  );
}
