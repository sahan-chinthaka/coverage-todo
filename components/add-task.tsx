"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addTask } from "@/server/actions/task";
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
    <form onSubmit={handleSubmit} className="w-full mx-auto max-w-xl p-4 bg-transparent">
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Title</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter task title" />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
          rows={4}
        />
      </div>

      {error && <p className="text-sm text-destructive mb-2">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add task"}
        </Button>
      </div>
    </form>
  );
}

export default AddTask;
