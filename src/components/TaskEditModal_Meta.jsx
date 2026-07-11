import React, { useState } from "react";

function TaskEditModal_Meta({ task, onClose, onTaskUpdated, children }) {
  const [name, setName] = useState(task?.name || "");
  const [status, setStatus] = useState(task?.status || "TODO");
  const [note, setNote] = useState(task?.note || "");

  const [dueDate, setDueDate] = useState(
    task?.due_date ? new Date(task.due_date).toISOString().split("T")[0] : ""
  );
  const [saving, setSaving] = useState(false);

  if (!task) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const finalDueDate = dueDate ? new Date(dueDate).getTime() : null;

    fetch("/update-task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskId: task.id,
        name,
        status,
        note,
        dueDate: finalDueDate,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update task");
        return res.json();
      })
      .then((data) => {
        setSaving(false);
        if (data.success) {
          onTaskUpdated();
          onClose();
        }
      })
      .catch((err) => {
        console.error("Error saving task changes:", err);
        setSaving(false);
        alert("Failed to update task. Please try again.");
      });
  };

  return children({
    name,
    setName,
    status,
    setStatus,
    note,
    setNote,
    dueDate,
    setDueDate,
    saving,
    handleSubmit,
  });
}

export default TaskEditModal_Meta;
