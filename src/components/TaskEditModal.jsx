import React, { useState } from "react";

function TaskEditModal({ task, onClose, onTaskUpdated }) {
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

  return (
    <div className="taskmodal-backdrop" onClick={onClose}>
      <div className="taskmodal-box" onClick={(e) => e.stopPropagation()}>
        <button className="taskmodal-close-btn" onClick={onClose}>
          &times;
        </button>
        
        <h3>Edit Task</h3>

        <form onSubmit={handleSubmit}>
          <div className="taskmodal-form-group">
            <label htmlFor="task-name">Task Name</label>
            <input
              id="task-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={saving}
            />
          </div>

          <div className="taskmodal-form-group">
            <label htmlFor="task-status">Status</label>
            <select
              id="task-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={saving}
            >
              <option value="TODO">To Do</option>
              <option value="PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="OVER">Over</option>
            </select>
          </div>

          <div className="taskmodal-form-group">
            <label htmlFor="task-date">Due Date</label>
            <input
              id="task-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={saving}
            />
          </div>

          <div className="taskmodal-form-group">
            <label htmlFor="task-note">Notes</label>
            <textarea
              id="task-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={saving}
              placeholder="Add task notes here..."
            />
          </div>

          <div className="taskmodal-actions">
            <button type="submit" disabled={saving}>
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskEditModal;