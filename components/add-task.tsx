"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addTask } from "@/server/actions/task";
import { AlertCircle, Plus } from "lucide-react";
import * as React from "react";
import { useState } from "react";

type Props = {
  onAdd?: (task: { title: string; description?: string }) => void;
};

function AddTask({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    const task = { title: title.trim(), description: description.trim() };

    if (onAdd) onAdd(task);

    setLoading(true);
    try {
      const res = await addTask(title.trim(), description.trim());

      if (!res.done) {
        throw new Error(res.error);
      }

      setTitle("");
      setDescription("");
    } catch (err) {
      setError((err as Error)?.message || "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto max-w-2xl">
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Task Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Description
              <span className="font-normal text-muted-foreground ml-1">(optional)</span>
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any additional details..."
              rows={3}
              className="text-base resize-none"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-end pt-2">
            <Button type="submit" disabled={loading} className="px-8 py-2.5 font-semibold">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Adding...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Task
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTask;
