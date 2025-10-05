import { cleanupOldDeletedTasks } from "@/server/actions/task";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Running task cleanup cron job...");
    const result = await cleanupOldDeletedTasks();

    if (result.done) {
      console.log(`Task cleanup completed: ${result.deletedCount || 0} tasks deleted`);
      return NextResponse.json({
        success: true,
        message: result.message,
        deletedCount: result.deletedCount,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.error("Task cleanup failed:", result.error);
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
