import React, { useState, useEffect } from 'react';

function Workspace({ user, project, layout, tasksVersion }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch tasks whenever the project changes OR tasksVersion triggers an update
  useEffect(() => {
    if (!project?.id) return;

    // Only trigger full-screen load state if we don't have tasks rendered yet
    if (tasks.length === 0) {
      setLoading(true);
    }

    fetch(`/get-tasks?projectId=${project.id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch tasks');
        return res.json();
      })
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading tasks:", err);
        setLoading(false);
      });
  }, [project?.id, tasksVersion]);

  // Bucketing tasks by status
  const todoTasks = tasks.filter(t => t.status === 'TODO');
  const progressTasks = tasks.filter(t => t.status === 'PROGRESS');
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED');
  const overTasks = tasks.filter(t => t.status === 'OVER');

  // Define column metadata for clean rendering loops
  const columns = [
    { title: 'To Do', tasks: todoTasks, class: 'todo' },
    { title: 'In Progress', tasks: progressTasks, class: 'progress' },
    { title: 'Completed', tasks: completedTasks, class: 'completed' },
    { title: 'Over', tasks: overTasks, class: 'over' }
  ];

  if (loading) {
    return (
      <div className="editor-workspace msg-state">
        <p>Loading tasks from Turso...</p>
      </div>
    );
  }

  return (
    <div className="print_editor-workspace">
      {layout === 'kanban' ? (
        /* --- KANBAN VIEW (4 Pillars) --- */
        <div className="print_kanban-grid">
          {columns.map(col => (
            <div className={`print_kanban-column print_${col.class}`} key={col.title}>
              <h3>{col.title} <span className="count">({col.tasks.length})</span></h3>
              <div className="print_task-list-container">
                {col.tasks.length === 0 ? (
                  <p className="no-tasks">No tasks</p>
                ) : (
                  col.tasks.map(task => (
                    <div className="print_task-card" key={task.id}>
                      <h4>{task.name}</h4>
                      {task.note && <p className="task-note">{task.note}</p>}
                      {task.due_date && <span className="task-date">📅 {new Date(task.due_date).toLocaleDateString()}</span>}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* --- LIST VIEW (Sequential Groups) --- */
        <div className="print_list-layout">
          {columns.map(col => (
            col.tasks.length > 0 && (
              <div className={`print_list-section print_${col.class}`} key={col.title}>
                <h3 className="print_list-section-title">{col.title}</h3>
                <div className="print_list-container">
                  {col.tasks.map(task => (
                    <div className="print_task-card" key={task.id}>
                      <h4>{task.name}</h4>
                      {task.note && <p className="task-note">{task.note}</p>}
                      {task.due_date && <span className="task-date">📅 {new Date(task.due_date).toLocaleDateString()}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}

export default Workspace;
