import React, { useState } from "react";

function InsertTask({ user, projectId, onClose, onTaskAdded }) {
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
          userId: user.id,
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

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="creator-container modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close-btn" onClick={onClose}>
          &times;
        </button>

        {error && (
          <div className="alert-message error-banner">
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="alert-message success-banner">
            <p>{success}</p>
          </div>
        )}

        <div className="top">
          <h2>Add New Task</h2>
        </div>

        <form onSubmit={handleSubmit} className="creator-form">
          <div className="form-group">
            <label htmlFor="taskName">Task Name *</label>
            <input
              type="text"
              id="taskName"
              className="insert_input-text"
              placeholder="e.g., Wireframe design revisions"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="note">Notes / Description</label>
            <textarea
              id="note"
              className="insert_textarea"
              placeholder="Provide a brief summary of requirements..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={submitting}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              className="insert_input-date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={submitting}
            />
          </div>

          <button type="submit" className="btn-submit" disabled={submitting}>
            {submitting ? "Adding..." : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default InsertTask;
