import React from "react";

function Editor_Workspace_List({ columns }) {
  return (
    <div className="print_list-layout">
      {columns.map(
        (col) =>
          col.tasks.length > 0 && (
            <div
              className={`print_list-section print_${col.class}`}
              key={col.title}
            >
              <h3 className="print_list-section-title">{col.title}</h3>
              <div className="print_list-container">
                {col.tasks.map((task) => (
                  <div className="print_task-card" key={task.id}>
                    <h4>{task.name}</h4>
                    {task.note && <p className="task-note">{task.note}</p>}
                    {task.due_date && (
                      <span className="task-date">
                        📅 {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
      )}
    </div>
  );
}

export default Editor_Workspace_List;
