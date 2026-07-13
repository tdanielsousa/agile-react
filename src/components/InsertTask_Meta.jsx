import { useState } from "react";

function InsertTask_Meta({ user, projectId, onClose, onTaskAdded }) {
  const [taskName, setTaskName] = useState("");
  const [note, setNote] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!taskName.trim()) {
      setError("Please provide a task name.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/create-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: taskName,
          note: note,
          dueDate: dueDate,
          projectId: Number(projectId),
          userId: user?.id,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong.");

      setSuccess("Task created successfully!");
      setTaskName("");
      setNote("");
      setDueDate("");

      if (onTaskAdded) onTaskAdded();

      setTimeout(() => {
        onClose();
      }, 2200);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    taskName,
    setTaskName,
    note,
    setNote,
    dueDate,
    setDueDate,
    error,
    success,
    submitting,
    handleSubmit,
  };
}

export default InsertTask_Meta;
