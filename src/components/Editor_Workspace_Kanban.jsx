import React from "react";

function Editor_Workspace_Kanban({ columns }) {
  return (
    <div className="print_kanban-grid">
      {columns.map((col) => (
        <div
          className={`print_kanban-column print_${col.class}`}
          key={col.title}
        >
          <h3>
            {col.title} <span className="count">({col.tasks.length})</span>
          </h3>
          <div className="print_task-list-container">
            {col.tasks.length === 0 ? (
              <p className="no-tasks">No tasks</p>
            ) : (
              col.tasks.map((task) => (
                <div className="print_task-card" key={task.id}>
                  <h4>{task.name}</h4>
                  {task.note && <p className="task-note">{task.note}</p>}
                  {task.due_date && (
                    <span className="task-date">
                      📅 {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Editor_Workspace_Kanban;
