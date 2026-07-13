import React from "react";
import TaskEditModal_Meta from "./TaskEditModal_Meta";

function TaskEditModal({ task, onClose, onTaskUpdated }) {
  return (
    <TaskEditModal_Meta
      task={task}
      onClose={onClose}
      onTaskUpdated={onTaskUpdated}
    >
      {({
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
      }) => (
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
                  className={`status-select ${status.toLowerCase()}`}
                >
                  <option value="TODO">⯀ To Do</option>
                  <option value="PROGRESS">⯀ In Progress</option>
                  <option value="COMPLETED">⯀ Completed</option>
                  <option value="OVER">⯀ Overdue</option>
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
      )}
    </TaskEditModal_Meta>
  );
}

export default TaskEditModal;
